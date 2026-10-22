---
name: add-ui-component
description: Add a shadcn/ui component (button, dialog, dropdown, table…) or build UI in the renderer. Use before writing any new UI component.
---

# UI components

1. Check `src/renderer/src/components/ui/` first. If the component is missing, add it with the
   shadcn CLI (it reads `components.json`):

   ```sh
   npx shadcn@latest add dialog dropdown-menu
   ```

   Then run `npm run check:fix` to format the generated files.
2. Import from `@renderer/components/ui/<name>`. Compose classes with `cn()` from the `cn` package.
3. Style with Tailwind classes and theme colors (`bg-background`, `text-foreground`,
   `text-muted-foreground`, `border`…), never hard-coded colors: they adapt to dark mode.
4. Icons: `lucide-react` (`import { PlusIcon } from 'lucide-react'`).
5. Images: put files in `src/renderer/public/images/` and use `publicUrl('images/name.png')`
   (no leading slash: it breaks under `file://`). Images imported from `src/renderer/src/assets/`
   (`import logo from '@renderer/assets/logo.png'`) also work and get a hashed file name.
6. App-specific components go in `src/renderer/src/components/` (not in `ui/`).
