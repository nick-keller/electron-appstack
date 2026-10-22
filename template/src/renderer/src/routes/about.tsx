import { Button } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import { formatDuration, useLicense } from '@renderer/lib/license'
import { publicUrl } from '@renderer/lib/public-url'
import { trpc } from '@renderer/lib/trpc'
import type { LicenseInfo } from '@shared/license'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  LoaderCircleIcon,
  RefreshCwIcon
} from 'lucide-react'
import { type ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

// About window, opened from the app menu (macOS) or the Help menu (Windows and Linux).

export const Route = createFileRoute('/about')({
  staticData: { standalone: true },
  loader: ({ context }) => context.queryClient.ensureQueryData(trpc.license.info.queryOptions()),
  component: About
})

function About() {
  const { t } = useTranslation()
  const { data: info } = useSuspenseQuery(trpc.app.info.queryOptions())
  const license = useLicense()

  return (
    <main className="flex min-h-screen flex-col gap-6 p-8">
      <div className="space-y-2 text-center">
        <img src={publicUrl('images/logo.svg')} alt="" className="mx-auto size-20" />
        <h1 className="font-semibold text-xl">{info.name}</h1>
        <p className="text-muted-foreground text-sm">
          {t('about.version', { version: info.version })}
        </p>
      </div>
      <Separator />
      {license && <LicenseDetails license={license} />}
    </main>
  )
}

function LicenseDetails({ license }: { license: LicenseInfo }) {
  const { t, i18n } = useTranslation()
  const refresh = useMutation(trpc.license.refresh.mutationOptions())
  const openPortal = useMutation(trpc.license.openPortal.mutationOptions())

  if (!license.enabled) {
    return <p className="text-center text-muted-foreground text-sm">{t('about.disabled')}</p>
  }

  const { offline } = license
  const verification =
    offline.mode === 'online' ? (
      t('about.online')
    ) : offline.validUntil ? (
      <>
        {t('about.offline', { duration: formatDuration(offline.remainingMs, t) })}
        <span className="block text-muted-foreground text-xs">
          {t('about.offlineUntil', {
            date: offline.validUntil.toLocaleString(i18n.language, {
              dateStyle: 'medium',
              timeStyle: 'short'
            })
          })}
        </span>
      </>
    ) : (
      t('about.offlineNone')
    )

  return (
    <section className="space-y-4">
      <h2 className="font-medium text-sm">{t('about.license')}</h2>
      <dl className="space-y-3 text-sm">
        <Row label={t('about.key')}>
          {license.maskedKey ? (
            <span className="flex items-center justify-end gap-1">
              <code className="truncate font-mono text-xs">{license.maskedKey}</code>
              <CopyKeyButton />
            </span>
          ) : (
            t('about.noKey')
          )}
        </Row>
        <Row label={t('about.status')}>
          <span className="inline-flex items-center gap-1.5">
            <span
              className={
                license.state === 'ACTIVE'
                  ? 'size-2 rounded-full bg-green-500'
                  : 'size-2 rounded-full bg-destructive'
              }
            />
            {t(`license.stateLabels.${license.state}`)}
          </span>
        </Row>
        {license.maskedKey && <Row label={t('about.verification')}>{verification}</Row>}
      </dl>

      {license.testProduct && (
        <p className="text-muted-foreground text-xs">{t('about.testProduct')}</p>
      )}
      {license.clockTampered && (
        <p className="text-destructive text-xs">{t('about.clockTampered')}</p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => openPortal.mutate()}>
          <ExternalLinkIcon />
          {t('license.manage')}
        </Button>
        {license.maskedKey && (
          <Button
            variant="outline"
            size="sm"
            disabled={refresh.isPending}
            onClick={() => refresh.mutate()}
          >
            {refresh.isPending ? <LoaderCircleIcon className="animate-spin" /> : <RefreshCwIcon />}
            {t('license.checkAgain')}
          </Button>
        )}
      </div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right">{children}</dd>
    </div>
  )
}

/** Copies the full key from the main process: the renderer only knows the masked one. */
function CopyKeyButton() {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const copy = useMutation(
    trpc.license.copyKey.mutationOptions({ onSuccess: () => setCopied(true) })
  )

  useEffect(() => {
    if (!copied) return
    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? t('about.copied') : t('about.copy')}
      title={copied ? t('about.copied') : t('about.copy')}
      onClick={() => copy.mutate()}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  )
}
