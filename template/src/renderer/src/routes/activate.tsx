import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'
import { useLicense } from '@renderer/lib/license'
import { publicUrl } from '@renderer/lib/public-url'
import { trpc } from '@renderer/lib/trpc'
import type { ActivationResult, LicenseInfo } from '@shared/license'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { LoaderCircleIcon, TriangleAlertIcon } from 'lucide-react'
import { type FormEvent, type ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Activation window, opened by the main process instead of the main window while the license is
// not active. Once activated, the main process closes it and opens the main window.

export const Route = createFileRoute('/activate')({
  staticData: { standalone: true },
  component: Activate
})

type EnabledLicense = Extract<LicenseInfo, { enabled: true }>

function Activate() {
  const { t } = useTranslation()
  const license = useLicense()
  const refresh = useMutation(trpc.license.refresh.mutationOptions())

  // The SDK does not watch the network: check again as soon as the computer is back online
  useEffect(() => {
    const onOnline = () => refresh.mutate()
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [refresh.mutate])

  if (!license) return null

  if (license.enabled && license.state === 'LOADING') {
    return (
      <Layout>
        <p className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <LoaderCircleIcon className="size-4 animate-spin" />
          {t('license.checking')}
        </p>
      </Layout>
    )
  }

  const locked = license.enabled && license.state !== 'MISSING_KEY' && license.state !== 'ACTIVE'

  return (
    <Layout>
      {locked ? (
        <>
          <LockedState
            license={license}
            refresh={() => refresh.mutate()}
            refreshing={refresh.isPending}
          />
          <p className="text-center text-muted-foreground text-xs">{t('license.anotherKey')}</p>
        </>
      ) : (
        <div className="space-y-1 text-center">
          <h1 className="font-semibold text-xl">
            {t('license.activateTitle', { name: t('appName') })}
          </h1>
          <p className="text-muted-foreground text-sm">{t('license.activateDescription')}</p>
        </div>
      )}
      <ActivationForm />
      {license.enabled && license.testProduct && (
        <p className="text-center text-muted-foreground text-xs">{t('license.testProduct')}</p>
      )}
    </Layout>
  )
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col justify-center gap-6 p-8">
      <img src={publicUrl('images/logo.svg')} alt="" className="mx-auto size-20" />
      {children}
    </main>
  )
}

/** Why the license is locked, and what the customer can do about it. */
function LockedState({
  license,
  refresh,
  refreshing
}: {
  license: EnabledLicense
  refresh: () => void
  refreshing: boolean
}) {
  const { t } = useTranslation()
  const { data: info } = useQuery(trpc.app.info.queryOptions())
  const openPortal = useMutation(trpc.license.openPortal.mutationOptions())
  const openPurchasePage = useMutation(trpc.license.openPurchasePage.mutationOptions())

  const name = t('appName')
  const current = info?.version
  const { state, latestAllowedVersion } = license

  let description: string
  if (state === 'VERSION_NOT_ALLOWED') {
    // `undefined` when refused offline by the stored token, which doesn't know the latest version
    description =
      latestAllowedVersion === undefined
        ? t('license.states.VERSION_NOT_ALLOWED.descriptionOffline', { name, current })
        : latestAllowedVersion === null
          ? t('license.states.VERSION_NOT_ALLOWED.descriptionNone', { name, current })
          : t('license.states.VERSION_NOT_ALLOWED.description', {
              name,
              current,
              version: latestAllowedVersion
            })
  } else if (state === 'INVALID_KEY') {
    description = t('license.states.INVALID_KEY.description', { key: license.maskedKey })
  } else if (
    state === 'EXPIRED' ||
    state === 'MACHINE_LIMIT_REACHED' ||
    state === 'OFFLINE_EXPIRED' ||
    state === 'CLOCK_TAMPERED'
  ) {
    description = t(`license.states.${state}.description`, { name })
  } else {
    return null
  }

  const checkAgain = (
    <Button variant="outline" onClick={refresh} disabled={refreshing}>
      {refreshing && <LoaderCircleIcon className="animate-spin" />}
      {state === 'EXPIRED' ? t('license.renewed') : t('license.checkAgain')}
    </Button>
  )
  const purchase = license.purchaseUrl && (
    <Button onClick={() => openPurchasePage.mutate()}>
      {state === 'EXPIRED' ? t('license.renew') : t('license.upgrade')}
    </Button>
  )
  const manage = (
    <Button variant="outline" onClick={() => openPortal.mutate()}>
      {t('license.manage')}
    </Button>
  )

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <h1 className="flex items-center justify-center gap-2 font-semibold text-xl">
          <TriangleAlertIcon className="size-5 text-destructive" />
          {t(`license.states.${state}.title`)}
        </h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {state === 'EXPIRED' && (
          <>
            {purchase}
            {checkAgain}
          </>
        )}
        {state === 'VERSION_NOT_ALLOWED' && (
          <>
            {purchase}
            {manage}
            {checkAgain}
          </>
        )}
        {state === 'MACHINE_LIMIT_REACHED' && (
          <>
            {manage}
            {checkAgain}
          </>
        )}
        {(state === 'OFFLINE_EXPIRED' || state === 'CLOCK_TAMPERED') && checkAgain}
      </div>
    </div>
  )
}

/** License key input. On success, the main process replaces this window with the main one. */
function ActivationForm() {
  const { t } = useTranslation()
  const { data: info } = useQuery(trpc.app.info.queryOptions())
  const license = useLicense()
  const openPurchasePage = useMutation(trpc.license.openPurchasePage.mutationOptions())
  const [key, setKey] = useState('')
  const [error, setError] = useState<string | null>(null)
  const activate = useMutation(
    trpc.license.activate.mutationOptions({
      onSuccess: (result) => setError(result.ok ? null : errorMessage(result))
    })
  )

  const errorMessage = (result: Extract<ActivationResult, { ok: false }>): string => {
    const name = t('appName')
    const current = info?.version
    if (result.code === 'version_not_allowed') {
      return result.latestAllowedVersion
        ? t('license.errors.version_not_allowed', {
            name,
            current,
            version: result.latestAllowedVersion
          })
        : t('license.errors.version_not_allowed_none', { name, current })
    }
    return t(`license.errors.${result.code}`, { name })
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!key.trim()) {
      setError(t('license.errors.validation_error'))
      return
    }
    activate.mutate(key)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="license-key">{t('license.key')}</Label>
        <Input
          id="license-key"
          value={key}
          onChange={(event) => {
            setKey(event.target.value)
            setError(null)
          }}
          placeholder={t('license.keyPlaceholder')}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          aria-invalid={error !== null}
          aria-describedby={error ? 'license-error' : undefined}
          className="font-mono"
        />
        {error && (
          <p id="license-error" role="alert" className="text-destructive text-sm">
            {error}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={activate.isPending}>
        {activate.isPending && <LoaderCircleIcon className="animate-spin" />}
        {activate.isPending ? t('license.activating') : t('license.activate')}
      </Button>
      {license?.enabled && license.state === 'MISSING_KEY' && license.purchaseUrl && (
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={() => openPurchasePage.mutate()}
        >
          {t('license.buy')}
        </Button>
      )}
    </form>
  )
}
