import { codeToTokens } from 'shiki'

// Highlighted at build time; the page's own background is kept instead of the theme's
export async function CodeBlock({
  code,
  lang = 'tsx',
  className,
}: {
  code: string
  lang?: 'tsx' | 'bash'
  className?: string
}) {
  const { tokens } = await codeToTokens(code, { lang, theme: 'github-dark' })

  return (
    <pre className={className}>
      <code>
        {tokens.map((line, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static lines
          <span key={i}>
            {line.map((token, j) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static tokens
              <span key={j} style={{ color: token.color }}>
                {token.content}
              </span>
            ))}
            {i < tokens.length - 1 && '\n'}
          </span>
        ))}
      </code>
    </pre>
  )
}
