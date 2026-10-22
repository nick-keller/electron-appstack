import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Checkbox } from '@renderer/components/ui/checkbox'
import { Input } from '@renderer/components/ui/input'
import { publicUrl } from '@renderer/lib/public-url'
import { trpc } from '@renderer/lib/trpc'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Trash2Icon } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(trpc.todos.list.queryOptions()),
  component: Home
})

function Home() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const { data: todos } = useSuspenseQuery(trpc.todos.list.queryOptions())

  const invalidate = () => queryClient.invalidateQueries({ queryKey: trpc.todos.list.queryKey() })
  const create = useMutation(trpc.todos.create.mutationOptions({ onSuccess: invalidate }))
  const setDone = useMutation(trpc.todos.setDone.mutationOptions({ onSuccess: invalidate }))
  const remove = useMutation(trpc.todos.delete.mutationOptions({ onSuccess: invalidate }))

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!title.trim()) return
    create.mutate({ title }, { onSuccess: () => setTitle('') })
  }

  const remaining = todos.filter((todo) => !todo.done).length

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <img src={publicUrl('images/logo.svg')} alt="" className="mx-auto size-16" />
      <Card>
        <CardHeader>
          <CardTitle>{t('home.title')}</CardTitle>
          <CardDescription>{t('home.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onSubmit} className="flex gap-2">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={t('home.placeholder')}
            />
            <Button type="submit" disabled={create.isPending}>
              {t('home.add')}
            </Button>
          </form>

          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm">{t('home.empty')}</p>
          ) : (
            <ul className="divide-y">
              {todos.map((todo) => (
                <li key={todo.id} className="flex items-center gap-3 py-2">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.done}
                    onCheckedChange={(done) => setDone.mutate({ id: todo.id, done: done === true })}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={todo.done ? 'flex-1 text-muted-foreground line-through' : 'flex-1'}
                  >
                    {todo.title}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('home.delete')}
                    onClick={() => remove.mutate({ id: todo.id })}
                  >
                    <Trash2Icon />
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <p className="text-muted-foreground text-xs">
            {t('home.remaining', { count: remaining })}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
