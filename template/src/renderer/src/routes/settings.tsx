import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Label } from '@renderer/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { Separator } from '@renderer/components/ui/separator'
import { trpc } from '@renderer/lib/trpc'
import { languageSettingSchema, themeSchema } from '@shared/config'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/settings')({
  component: Settings
})

function Settings() {
  const { t } = useTranslation()
  const { data: config } = useSuspenseQuery(trpc.config.get.queryOptions())
  const { data: info } = useSuspenseQuery(trpc.app.info.queryOptions())

  // No need to update the cache on success: the main process emits `config.onChange`
  const setTheme = useMutation(trpc.config.setTheme.mutationOptions())
  const setLanguage = useMutation(trpc.config.setLanguage.mutationOptions())

  return (
    <div className="mx-auto max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.title')}</CardTitle>
          <CardDescription>{t('settings.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">{t('settings.theme')}</Label>
            <Select
              value={config.theme}
              onValueChange={(value) => setTheme.mutate(themeSchema.parse(value))}
            >
              <SelectTrigger id="theme" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeSchema.options.map((theme) => (
                  <SelectItem key={theme} value={theme}>
                    {t(`theme.${theme}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="language">{t('settings.language')}</Label>
            <Select
              value={config.language}
              onValueChange={(value) => setLanguage.mutate(languageSettingSchema.parse(value))}
            >
              <SelectTrigger id="language" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageSettingSchema.options.map((language) => (
                  <SelectItem key={language} value={language}>
                    {t(`language.${language}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-1 text-muted-foreground text-sm">
            <p className="font-medium text-foreground">{t('settings.versions')}</p>
            <p>
              {info.name} {info.version}
            </p>
            {Object.entries(info.versions).map(([name, version]) => (
              <p key={name}>
                {name} {version}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
