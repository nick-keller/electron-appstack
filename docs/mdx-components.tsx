import { useMDXComponents as getThemeComponents } from 'nextra-theme-docs'
import { Img } from './components/img'

const themeComponents = getThemeComponents()

export function useMDXComponents(components?: Record<string, React.ComponentType>) {
  return {
    ...themeComponents,
    Img,
    ...components
  }
}
