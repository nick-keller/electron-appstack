import { Button } from '@renderer/components/ui/button'
import { formatDuration, useLicense } from '@renderer/lib/license'
import { trpc } from '@renderer/lib/trpc'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

// Shown when the time left to work offline is below this
const WARNING_MS = 3 * 24 * 60 * 60 * 1000

/** Warns that the app will lock soon if it stays offline. */
export function LicenseBanner() {
  const { t } = useTranslation()
  const license = useLicense()
  const refresh = useMutation(trpc.license.refresh.mutationOptions())

  if (!license?.enabled || license.state !== 'ACTIVE') return null
  const { offline } = license
  if (offline.mode !== 'offline' || !offline.validUntil || offline.remainingMs > WARNING_MS) {
    return null
  }

  return (
    <div className="flex items-center justify-between gap-4 border-b bg-muted px-4 py-2 text-sm">
      <span>
        {t('license.offlineBanner', {
          duration: formatDuration(offline.remainingMs, t),
          name: t('appName')
        })}
      </span>
      <Button
        size="sm"
        variant="outline"
        disabled={refresh.isPending}
        onClick={() => refresh.mutate()}
      >
        {t('license.checkAgain')}
      </Button>
    </div>
  )
}
