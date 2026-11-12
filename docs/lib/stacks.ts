// Stack pages: one landing page (/electron-react-boilerplate...) and one ranking
// (/best-electron-react-boilerplate...) per stack people search a boilerplate for. Rendered by
// app/(home)/[slug]/page.tsx, rankings computed from data/boilerplates.json like /compare.

import type { Boilerplate, FeatureKey } from './boilerplates'

export type IconName =
  | 'atom'
  | 'braces'
  | 'database'
  | 'exchange'
  | 'layers'
  | 'lock'
  | 'moon'
  | 'palette'
  | 'refresh'
  | 'rocket'
  | 'settings'
  | 'shield'
  | 'sparkles'
  | 'zap'
  | 'languages'
  | 'key'

export type RankingColumn = 'ui' | 'components' | 'styling' | 'build' | 'ipc'

export type StackPage = {
  id: string
  // Name of the technology, as written in the H1 highlight
  name: string
  // The search query the landing page targets
  keyword: string
  // How the other boilerplates of the ranking are called, when not "Electron <name> boilerplates"
  peers?: string
  path: string
  rankingPath: string
  // Names of the logos in the hero dock, from the home page stack
  logos: string[]
  // Which boilerplates the ranking includes
  match: (b: Boilerplate) => boolean
  landing: {
    title: string
    description: string
    keywords: string[]
    eyebrow: string
    // Before, highlighted part, after
    h1: [string, string, string]
    tagline: string
    subtitle: string
    highlightsTitle: string
    highlightsLead: string
    highlights: { title: string; description: string; icon: IconName; href: string }[]
    code: {
      eyebrow: string
      title: string
      text: string
      code: string
      lang: 'tsx' | 'ts' | 'bash' | 'css'
      href: string
      link: string
    }
    // Titles of the home page features already covered by the highlights above
    skipFeatures: string[]
    faq: { question: string; answer: string }[]
  }
  ranking: {
    // Without the year, which is appended from the data file
    title: string
    shortTitle: string
    intro: string
    keywords: string[]
    columns: RankingColumn[]
    // Features shown first in the matrix
    focus: FeatureKey[]
    howToChoose: { title: string; text: string }[]
  }
}

const typedExample = `// src/main/trpc/routers/todos.ts (main process)
export const todosRouter = router({
  create: licensedProcedure
    .input(z.object({ title: z.string().trim().min(1).max(200) }))
    .mutation(({ ctx, input }) =>
      ctx.db.insert(todos).values(input).returning().get()
    )
})

// src/renderer/src/routes/index.tsx (renderer)
const create = useMutation(trpc.todos.create.mutationOptions())
create.mutate({ title: 'Ship v1' }) // typed, validated, autocompleted`

const has = (b: Boilerplate, key: 'ui' | 'styling', value: string) =>
  ((b.stack[key] as string[] | undefined) ?? []).includes(value)

export const stackPages: StackPage[] = [
  {
    id: 'react',
    name: 'React',
    keyword: 'Electron React boilerplate',
    path: '/electron-react-boilerplate',
    rankingPath: '/best-electron-react-boilerplate',
    logos: [
      'React',
      'TanStack Router',
      'TanStack Query',
      'TypeScript',
      'Vite',
      'tRPC',
      'shadcn/ui',
      'Tailwind CSS',
      'SQLite',
      'Electron'
    ],
    match: (b) => has(b, 'ui', 'React'),
    landing: {
      title: 'Electron React Boilerplate: TypeScript, tRPC, SQLite (Free)',
      description:
        'Free Electron React boilerplate: React 19, TypeScript, TanStack Router, shadcn/ui, typed IPC with tRPC, SQLite, auto update and signed releases.',
      keywords: [
        'electron react boilerplate',
        'electron react template',
        'electron react typescript',
        'electron react starter',
        'react electron app',
        'electron react 19'
      ],
      eyebrow: 'Electron + React 19',
      h1: ['Electron ', 'React', ' boilerplate with the backend already built'],
      tagline: 'React 19 in the renderer. tRPC, SQLite and a release pipeline behind it.',
      subtitle:
        'Most Electron React templates stop at a window that renders App.tsx. This one ships the React stack you would pick today, and the desktop backend the others leave to you.',
      highlightsTitle: 'The React stack you would pick today',
      highlightsLead:
        'React 19, a type-safe router, a data layer and a design system, already wired to the Electron main process.',
      highlights: [
        {
          title: 'React 19 with hot reload',
          description:
            'Vite reloads the renderer on every save, and the main process restarts when you change it.',
          icon: 'atom',
          href: '/doc/development'
        },
        {
          title: 'TanStack Router',
          description:
            'File-based routes: a file in routes/ is a page, and links and params are checked by the compiler.',
          icon: 'layers',
          href: '/doc/routing'
        },
        {
          title: 'TanStack Query over IPC',
          description:
            'useQuery and useMutation call the main process through tRPC, with caching and invalidation.',
          icon: 'exchange',
          href: '/doc/ipc'
        },
        {
          title: 'shadcn/ui and Tailwind CSS',
          description:
            'Accessible components copied into your code, Tailwind CSS v4 and a dark mode that follows the OS.',
          icon: 'palette',
          href: '/doc/components'
        }
      ],
      code: {
        eyebrow: 'React meets the main process',
        title: 'Call your main process from React like a local hook',
        text: 'No ipcRenderer, no channel names, no hand-written preload API. A tRPC procedure in the main process is a typed TanStack Query hook in your components.',
        code: typedExample,
        lang: 'ts',
        href: '/doc/ipc',
        link: 'Read the IPC guide'
      },
      skipFeatures: ['Modern React stack', 'Hot reload', 'Design system'],
      faq: [
        {
          question: 'Is this the Electron React Boilerplate project?',
          answer:
            'No. Electron React Boilerplate (electron-react-boilerplate.js.org) is a separate, popular project. Electron AppStack is another free Electron boilerplate built on React, which adds UI components, typed IPC with tRPC, a SQLite database, source code protection and license keys. The comparison page lists every difference.'
        },
        {
          question: 'Which React version does it use?',
          answer:
            'React 19, built by Vite through electron-vite, in strict TypeScript. Routing uses TanStack Router and data fetching uses TanStack Query.'
        },
        {
          question: 'Can I use React Router, Redux or Zustand instead?',
          answer:
            'Yes. Data that comes from the main process lives in the TanStack Query cache, so most apps need no global store, but you can add any state library to the renderer. TanStack Router only touches the routes folder and the router setup, so it can be swapped for React Router.'
        },
        {
          question: 'Does it work with Vue, Svelte or Angular?',
          answer:
            'No, the renderer is React only. The main process, the database, the release workflow and the licensing do not depend on React, but the UI, the routes and the IPC client are written for it.'
        }
      ]
    },
    ranking: {
      title: 'Best Electron React boilerplates',
      shortTitle: 'React',
      intro:
        'Every Electron boilerplate with a React renderer, scored on the same features, Electron version, maintenance and popularity as our main ranking.',
      keywords: [
        'best electron react boilerplate',
        'electron react boilerplate',
        'electron react boilerplate alternative',
        'electron react template',
        'electron react starter'
      ],
      columns: ['build', 'components', 'ipc'],
      focus: ['router', 'uiComponents', 'typedIpc', 'database', 'autoUpdate', 'codeSigning'],
      howToChoose: [
        {
          title: 'Look past the renderer',
          text: 'Every React template renders a page. The difference is the main process: typed IPC, a database, auto update and signed releases are what take weeks to add.'
        },
        {
          title: 'Check the Electron version',
          text: 'Electron supports only its latest three major versions. A template several majors behind ships a Chromium without security fixes.'
        },
        {
          title: 'Pick a modern React stack',
          text: 'React 19 with Vite, a typed router and a data fetching library will save you a migration later. Webpack and Create React App setups are a sign of an old template.'
        }
      ]
    }
  },
  {
    id: 'shadcn',
    name: 'shadcn/ui',
    keyword: 'Electron shadcn/ui boilerplate',
    path: '/electron-shadcn-boilerplate',
    rankingPath: '/best-electron-shadcn-boilerplate',
    logos: [
      'shadcn/ui',
      'Radix UI',
      'Tailwind CSS',
      'Lucide',
      'React',
      'TypeScript',
      'Vite',
      'tRPC',
      'SQLite',
      'Electron'
    ],
    match: (b) => b.stack.components === 'shadcn/ui',
    landing: {
      title: 'Electron shadcn/ui Boilerplate with Tailwind v4 (Free)',
      description:
        'Free Electron shadcn/ui boilerplate with Tailwind v4, Radix UI and Lucide. Add any shadcn component in one command, dark mode follows the OS.',
      keywords: [
        'electron shadcn',
        'electron shadcn boilerplate',
        'electron shadcn template',
        'shadcn electron',
        'electron shadcn ui',
        'electron tailwind shadcn'
      ],
      eyebrow: 'Electron + shadcn/ui',
      h1: ['Electron ', 'shadcn/ui', ' boilerplate with every component one command away'],
      tagline: 'The whole shadcn/ui catalog, one npx shadcn add away.',
      subtitle:
        'shadcn/ui, Tailwind CSS v4, Radix UI and Lucide, configured for the Electron renderer. Then everything else a desktop app needs: typed IPC, SQLite, auto update, signed releases and license keys.',
      highlightsTitle: 'shadcn/ui, set up for Electron',
      highlightsLead:
        'The shadcn CLI, the theme and the dark mode work in the Electron renderer out of the box, so you only pick components.',
      highlights: [
        {
          title: 'components.json ready for Electron',
          description:
            'Aliases point at the renderer, so the shadcn CLI writes components to src/renderer/src/components/ui with working imports.',
          icon: 'settings',
          href: '/doc/components'
        },
        {
          title: 'New York style, CSS variables',
          description:
            'Every color is a CSS variable in one stylesheet: restyle every component at once, or paste a theme from a shadcn theme generator.',
          icon: 'palette',
          href: '/doc/theming'
        },
        {
          title: 'Dark mode that follows the OS',
          description:
            'System, light or dark from the native menu or the settings, synced with nativeTheme, so every dark: variant just works.',
          icon: 'moon',
          href: '/doc/theming'
        },
        {
          title: 'Radix UI and Lucide included',
          description:
            'Accessible primitives from the radix-ui package and lucide-react icons, already installed for the components you add.',
          icon: 'layers',
          href: '/doc/components'
        }
      ],
      code: {
        eyebrow: 'One command per component',
        title: 'Add any shadcn/ui component, no setup',
        text: 'Button, Card, Checkbox, Input, Label, Select and Separator ship with the example screens. Every other component of the shadcn/ui registry installs with the CLI, straight into the renderer.',
        code: `npx shadcn@latest add dialog table sonner

# Written to src/renderer/src/components/ui/
# Imported with the renderer alias:
# @renderer/components/ui/dialog`,
        lang: 'bash',
        href: '/doc/components',
        link: 'Read the UI guide'
      },
      skipFeatures: ['Design system', 'Dark mode'],
      faq: [
        {
          question: 'Which shadcn/ui components are included?',
          answer:
            'Button, Card, Checkbox, Input, Label, Select and Separator are installed and used by the example screens. Every other shadcn/ui component installs with npx shadcn@latest add <name>: components.json is already configured for the Electron renderer.'
        },
        {
          question: 'Does it use Tailwind CSS v4?',
          answer:
            'Yes. Tailwind CSS v4 runs through its Vite plugin, with no tailwind.config file. The shadcn/ui theme lives in the renderer stylesheet as CSS variables, with a light and a dark palette.'
        },
        {
          question: 'How is it different from electron-shadcn?',
          answer:
            'electron-shadcn is a popular Electron Forge template with shadcn/ui, oRPC and Playwright end-to-end tests. Electron AppStack uses electron-vite and electron-builder, and adds a SQLite database, persistent settings, code signing in CI, source code protection, license keys with Stripe and instructions for AI agents.'
        },
        {
          question: 'Can AI coding agents add components?',
          answer:
            'Yes. The template ships an add-ui-component skill: Claude Code, Cursor, Codex and Copilot check the existing components first, install missing ones with the shadcn CLI and use the theme colors instead of hard-coded ones.'
        }
      ]
    },
    ranking: {
      title: 'Best Electron shadcn/ui boilerplates',
      shortTitle: 'shadcn/ui',
      intro:
        'Every Electron boilerplate that ships shadcn/ui components, scored on the same features, Electron version, maintenance and popularity as our main ranking.',
      keywords: [
        'best electron shadcn boilerplate',
        'electron shadcn',
        'electron shadcn template',
        'electron-shadcn alternative',
        'shadcn electron starter'
      ],
      columns: ['build', 'ipc', 'styling'],
      focus: ['uiComponents', 'darkMode', 'router', 'typedIpc', 'database', 'licensing'],
      howToChoose: [
        {
          title: 'Check components.json',
          text: 'The shadcn CLI needs aliases that match the renderer folder. When they are right, adding a component is one command and its imports work.'
        },
        {
          title: 'Dark mode should follow the OS',
          text: 'A desktop app is expected to follow the system theme. Look for a template that syncs the dark class with Electron nativeTheme, not only a toggle.'
        },
        {
          title: 'Components are the easy part',
          text: 'Every template here has shadcn/ui. Compare what is behind it: typed IPC, a database, auto update, signed releases and licensing.'
        }
      ]
    }
  },
  {
    id: 'vite',
    name: 'Vite',
    keyword: 'Electron Vite boilerplate',
    path: '/electron-vite-boilerplate',
    rankingPath: '/best-electron-vite-boilerplate',
    logos: [
      'Vite',
      'electron-vite',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'tRPC',
      'SQLite',
      'V8 bytecode',
      'Electron'
    ],
    match: (b) => /Vite/.test(String(b.stack.build)),
    landing: {
      title: 'Electron Vite Boilerplate: electron-vite and React (Free)',
      description:
        'Free Electron Vite boilerplate on electron-vite: hot reload for main, preload and renderer, V8 bytecode, React, TypeScript, tRPC and SQLite.',
      keywords: [
        'electron vite boilerplate',
        'electron vite template',
        'electron-vite react',
        'electron vite react typescript',
        'vite electron starter',
        'electron-vite boilerplate'
      ],
      eyebrow: 'electron-vite + Vite',
      h1: ['Electron ', 'Vite', ' boilerplate that goes all the way to release'],
      tagline: 'Instant hot reload while you build. Signed installers when you ship.',
      subtitle:
        'Built on electron-vite: one config for the main process, the preload script and the renderer, hot reload in development, bytecode in production. And everything that comes after npm run dev.',
      highlightsTitle: 'electron-vite, configured for a real app',
      highlightsLead:
        'The fastest Electron build tool, set up with the plugins, aliases and production options a shipped app needs.',
      highlights: [
        {
          title: 'One config, three processes',
          description:
            'electron.vite.config.ts builds the main process, the preload script and the renderer, with shared path aliases.',
          icon: 'braces',
          href: '/doc/project-structure'
        },
        {
          title: 'Hot reload everywhere',
          description:
            'The renderer updates instantly with Vite HMR, and the main process restarts on change.',
          icon: 'zap',
          href: '/doc/development'
        },
        {
          title: 'V8 bytecode in production',
          description:
            'electron-vite compiles the main process to bytecode, so the packaged app ships no readable JavaScript for it.',
          icon: 'lock',
          href: '/doc/source-protection'
        },
        {
          title: 'Vite plugins ready',
          description:
            'React, TanStack Router and Tailwind CSS plugins in the renderer. Add any Vite plugin next to them.',
          icon: 'layers',
          href: '/doc/routing'
        }
      ],
      code: {
        eyebrow: 'electron.vite.config.ts',
        title: 'The whole build in one file',
        text: 'Main, preload and renderer share their aliases. Production builds turn the main process into V8 bytecode with one option.',
        code: `export default defineConfig({
  main: {
    resolve: { alias },
    // Main process compiled to V8 bytecode in production
    build: { bytecode: { transformArrowFunctions: false } }
  },
  preload: { resolve: { alias } },
  renderer: {
    resolve: { alias },
    plugins: [tanstackRouter({ target: 'react' }), react(), tailwindcss()]
  }
})`,
        lang: 'ts',
        href: '/doc/development',
        link: 'Read the development guide'
      },
      skipFeatures: ['Hot reload'],
      faq: [
        {
          question: 'Does it use electron-vite or vite-plugin-electron?',
          answer:
            'electron-vite, the build tool made for Electron: one config per process, dependencies kept external in the main process and bytecode compilation for source code protection. vite-plugin-electron, used by the electron-vite-react and electron-vite-vue templates, adds Electron to a regular Vite project instead.'
        },
        {
          question: 'How is it different from the create electron-vite templates?',
          answer:
            'The official electron-vite templates give you a window and a build. Electron AppStack uses the same build tool and adds routing, UI components, typed IPC with tRPC, a SQLite database, auto update, a signed release workflow and license keys.'
        },
        {
          question: 'Which versions of Vite and electron-vite?',
          answer:
            'Vite 8 with electron-vite 6, on the latest Electron. The data file behind our comparison pages is refreshed with a script, so you can check the versions of every template.'
        },
        {
          question: 'Does it use Electron Forge?',
          answer:
            'No. Development and builds go through electron-vite, packaging through electron-builder and updates through electron-updater, which publishes to GitHub Releases.'
        }
      ]
    },
    ranking: {
      title: 'Best Electron Vite boilerplates',
      shortTitle: 'Vite',
      intro:
        'Every Electron boilerplate built with Vite, through electron-vite, vite-plugin-electron or Electron Forge, scored on the same features, Electron version, maintenance and popularity as our main ranking.',
      keywords: [
        'best electron vite boilerplate',
        'electron vite template',
        'electron-vite react template',
        'electron vite starter',
        'electron vite typescript'
      ],
      columns: ['build', 'ui', 'ipc'],
      focus: ['hotReload', 'sourceProtection', 'typedIpc', 'database', 'autoUpdate', 'ciRelease'],
      howToChoose: [
        {
          title: 'electron-vite or a plugin',
          text: 'electron-vite builds the three processes with one config and can compile to bytecode. vite-plugin-electron adds Electron to a web Vite project. Electron Forge has its own Vite plugin.'
        },
        {
          title: 'Hot reload for the main process too',
          text: 'Every template reloads the renderer. Check that the main process restarts on change, or you will restart the app by hand all day.'
        },
        {
          title: 'Minimal or complete',
          text: 'Minimal templates are a good start to learn. For an app you will ship, look at what is included after the build: IPC, data, updates and releases.'
        }
      ]
    }
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    keyword: 'Electron Tailwind CSS boilerplate',
    path: '/electron-tailwind-boilerplate',
    rankingPath: '/best-electron-tailwind-boilerplate',
    logos: [
      'Tailwind CSS',
      'shadcn/ui',
      'Radix UI',
      'Lucide',
      'React',
      'TypeScript',
      'Vite',
      'tRPC',
      'Electron'
    ],
    match: (b) => has(b, 'styling', 'Tailwind CSS'),
    landing: {
      title: 'Electron Tailwind CSS Boilerplate: v4, shadcn/ui, dark mode',
      description:
        'Free Electron Tailwind CSS boilerplate: Tailwind v4 via its Vite plugin, theme tokens as CSS variables, shadcn/ui and dark mode synced with the OS.',
      keywords: [
        'electron tailwind',
        'electron tailwind boilerplate',
        'electron tailwind template',
        'electron tailwind v4',
        'electron react tailwind',
        'tailwind electron app'
      ],
      eyebrow: 'Electron + Tailwind CSS v4',
      h1: ['Electron ', 'Tailwind CSS', ' boilerplate, v4 and dark mode included'],
      tagline: 'Utility classes in the renderer. Dark mode straight from the OS.',
      subtitle:
        'Tailwind CSS v4 through its Vite plugin, theme tokens as CSS variables, shadcn/ui components and a dark mode wired to Electron nativeTheme. And the whole desktop stack behind it.',
      highlightsTitle: 'Tailwind CSS v4, ready for a desktop app',
      highlightsLead:
        'No config file to write, a theme you change in one place, and dark mode that behaves like a native app.',
      highlights: [
        {
          title: 'Tailwind v4, zero config',
          description:
            'The @tailwindcss/vite plugin and one @import line. No tailwind.config.js, no PostCSS setup.',
          icon: 'zap',
          href: '/doc/theming'
        },
        {
          title: 'Theme tokens',
          description:
            'background, foreground, primary, muted… are CSS variables: write bg-background, change the palette in one file.',
          icon: 'palette',
          href: '/doc/theming'
        },
        {
          title: 'Dark mode from the OS',
          description:
            'System, light or dark from the native menu or the settings. The dark: variant follows Electron nativeTheme.',
          icon: 'moon',
          href: '/doc/theming'
        },
        {
          title: 'Components included',
          description:
            'shadcn/ui components styled with Tailwind, Radix UI primitives, Lucide icons and tw-animate-css.',
          icon: 'layers',
          href: '/doc/components'
        }
      ],
      code: {
        eyebrow: 'src/renderer/src/styles.css',
        title: 'Your whole theme in one stylesheet',
        text: 'Tailwind CSS v4 is configured in CSS. Colors are variables, redefined for dark mode, and every component reads them.',
        code: `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}`,
        lang: 'css',
        href: '/doc/theming',
        link: 'Read the theming guide'
      },
      skipFeatures: ['Design system', 'Dark mode'],
      faq: [
        {
          question: 'Does it use Tailwind CSS v3 or v4?',
          answer:
            'Tailwind CSS v4, through the @tailwindcss/vite plugin. There is no tailwind.config file: the theme is defined in the renderer stylesheet with CSS variables.'
        },
        {
          question: 'How does dark mode work?',
          answer:
            'The theme chosen in the native menu or the settings sets nativeTheme.themeSource in the main process. Chromium exposes it as prefers-color-scheme, and the renderer toggles the dark class, so every dark: utility follows the system or the user choice.'
        },
        {
          question: 'Can I use another component library?',
          answer:
            'Yes. shadcn/ui components are copied into your code, not installed as a package, so you can delete them and use DaisyUI, Headless UI or your own components with the same Tailwind setup.'
        }
      ]
    },
    ranking: {
      title: 'Best Electron Tailwind CSS boilerplates',
      shortTitle: 'Tailwind CSS',
      intro:
        'Every Electron boilerplate styled with Tailwind CSS, scored on the same features, Electron version, maintenance and popularity as our main ranking.',
      keywords: [
        'best electron tailwind boilerplate',
        'electron tailwind template',
        'electron react tailwind template',
        'electron tailwind starter'
      ],
      columns: ['components', 'ui', 'build'],
      focus: ['uiComponents', 'darkMode', 'router', 'typedIpc', 'database', 'autoUpdate'],
      howToChoose: [
        {
          title: 'Tailwind v4 or v3',
          text: 'Tailwind CSS v4 is configured in CSS and builds faster. A template still on v3 means a migration before your first feature.'
        },
        {
          title: 'Components on top',
          text: 'Tailwind alone means building every input and dialog. A template with shadcn/ui or DaisyUI gives you accessible components styled with the same classes.'
        },
        {
          title: 'Dark mode done right',
          text: 'In a desktop app, dark mode should follow the system theme and the native menu, not only a toggle in the page.'
        }
      ]
    }
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    keyword: 'Electron TypeScript boilerplate',
    path: '/electron-typescript-boilerplate',
    rankingPath: '/best-electron-typescript-boilerplate',
    logos: [
      'TypeScript',
      'tRPC',
      'Zod',
      'Drizzle ORM',
      'TanStack Router',
      'i18next',
      'React',
      'Vite',
      'Electron'
    ],
    match: (b) => b.stack.language === 'TypeScript',
    landing: {
      title: 'Electron TypeScript Boilerplate: strict types, DB to UI',
      description:
        'Free Electron TypeScript boilerplate in strict mode: typed IPC with tRPC, typed SQLite with Drizzle, typed settings, routes and translations.',
      keywords: [
        'electron typescript boilerplate',
        'electron typescript template',
        'electron typescript starter',
        'electron react typescript',
        'typescript electron app',
        'electron strict typescript'
      ],
      eyebrow: 'Electron + TypeScript',
      h1: ['Electron ', 'TypeScript', ' boilerplate, typed from database to UI'],
      tagline: 'Strict mode in every process. No any across the IPC bridge.',
      subtitle:
        'Main, preload and renderer in strict TypeScript, and types that cross the process boundary: procedures, tables, settings, routes and translation keys are all checked by the compiler.',
      highlightsTitle: 'Types that cross the process boundary',
      highlightsLead:
        'Most templates type each file. Here the compiler also checks what goes from the database to the main process to React.',
      highlights: [
        {
          title: 'Typed IPC',
          description:
            'The renderer imports the type of the tRPC router. Rename a procedure and the compiler points at every call.',
          icon: 'exchange',
          href: '/doc/ipc'
        },
        {
          title: 'Typed database',
          description:
            'Tables are declared with Drizzle in TypeScript, queries return typed rows and migrations are generated from the schema.',
          icon: 'database',
          href: '/doc/database'
        },
        {
          title: 'Typed settings and translations',
          description:
            'electron-store validated by a zod schema, and i18next keys checked at compile time.',
          icon: 'settings',
          href: '/doc/config'
        },
        {
          title: 'Typed routes',
          description:
            'TanStack Router generates a route tree, so links, params and search params are checked.',
          icon: 'layers',
          href: '/doc/routing'
        }
      ],
      code: {
        eyebrow: 'From database to UI',
        title: 'One type, from the table to the button',
        text: 'The input is validated with zod in the main process, the row type comes from Drizzle, and the renderer gets both through tRPC, without a single type written twice.',
        code: typedExample,
        lang: 'ts',
        href: '/doc/ipc',
        link: 'Read the IPC guide'
      },
      skipFeatures: ['Typed app config', 'Translations'],
      faq: [
        {
          question: 'Is TypeScript strict mode on?',
          answer:
            'Yes, with noUnusedLocals and noUnusedParameters too. npm run typecheck checks the whole app, and npm run build runs it before every build.'
        },
        {
          question: 'Why two tsconfig files?',
          answer:
            'One for the main process and the preload script, with Node.js types, and one for the renderer, with DOM types. The renderer cannot import Node.js APIs by accident, and each side gets the right globals.'
        },
        {
          question: 'Which TypeScript version does it use?',
          answer:
            'TypeScript 7. Vite only strips types during development, so the type check runs separately with npm run typecheck, in your editor and in CI.'
        }
      ]
    },
    ranking: {
      title: 'Best Electron TypeScript boilerplates',
      shortTitle: 'TypeScript',
      intro:
        'Every Electron boilerplate written in TypeScript, scored on the same features, Electron version, maintenance and popularity as our main ranking. Typed IPC and a typed database are what set them apart.',
      keywords: [
        'best electron typescript boilerplate',
        'electron typescript template',
        'electron typescript starter',
        'electron react typescript boilerplate'
      ],
      columns: ['ui', 'build', 'ipc'],
      focus: ['typescript', 'typedIpc', 'database', 'appConfig', 'router', 'i18n'],
      howToChoose: [
        {
          title: 'TypeScript in every process',
          text: 'Some templates type the renderer and leave the main process or the preload script in JavaScript. All three should be TypeScript.'
        },
        {
          title: 'Typed IPC is the real test',
          text: 'ipcRenderer.invoke returns any. Look for tRPC, oRPC or a typed bridge, so a change in the main process breaks the build, not the app.'
        },
        {
          title: 'Strict mode from day one',
          text: 'Turning strict mode on later means fixing hundreds of errors. Start with a template that already passes it.'
        }
      ]
    }
  },
  {
    id: 'trpc',
    name: 'tRPC',
    keyword: 'Electron tRPC boilerplate',
    peers: 'Electron boilerplates with type-safe IPC',
    path: '/electron-trpc-boilerplate',
    rankingPath: '/best-electron-trpc-boilerplate',
    logos: [
      'tRPC',
      'Zod',
      'TanStack Query',
      'TypeScript',
      'React',
      'SQLite',
      'Drizzle ORM',
      'Electron'
    ],
    match: (b) => b.features.typedIpc !== 'no',
    landing: {
      title: 'Electron tRPC Boilerplate: type-safe IPC with tRPC v11',
      description:
        'Free Electron tRPC boilerplate: type-safe IPC with tRPC v11, zod validation in main, TanStack Query in React, subscriptions and SQLite.',
      keywords: [
        'electron trpc',
        'electron trpc boilerplate',
        'electron trpc template',
        'trpc electron ipc',
        'type safe ipc electron',
        'electron typed ipc'
      ],
      eyebrow: 'Electron + tRPC v11',
      h1: ['Electron ', 'tRPC', ' boilerplate for type-safe IPC'],
      tagline: 'No channel strings. No hand-written preload API. Just procedures.',
      subtitle:
        'tRPC v11 over Electron IPC: zod-validated inputs in the main process, typed calls and TanStack Query hooks in React, subscriptions for events pushed by the main process.',
      highlightsTitle: 'Electron IPC without the boilerplate',
      highlightsLead:
        'ipcMain.handle, channel names and a preload API to keep in sync are replaced by one typed router.',
      highlights: [
        {
          title: 'Procedures, not channels',
          description:
            'No string channel names to keep in sync between ipcMain, the preload script and the renderer.',
          icon: 'exchange',
          href: '/doc/ipc'
        },
        {
          title: 'Validated in the main process',
          description:
            'Inputs are parsed with zod before your code runs, so the renderer cannot send anything unexpected.',
          icon: 'shield',
          href: '/doc/ipc'
        },
        {
          title: 'TanStack Query in React',
          description:
            'queryOptions and mutationOptions for every procedure: caching, loading states and invalidation for free.',
          icon: 'atom',
          href: '/doc/ipc'
        },
        {
          title: 'Subscriptions',
          description:
            'The main process pushes events to the renderer, like a navigation from the native menu, through typed subscriptions.',
          icon: 'refresh',
          href: '/doc/ipc'
        }
      ],
      code: {
        eyebrow: 'One router, both processes',
        title: 'Define it in the main process, call it from React',
        text: 'A procedure is validated, typed and autocompleted on both sides. superjson keeps Date, Map and Set intact, and licensedProcedure gates it behind a valid license.',
        code: typedExample,
        lang: 'ts',
        href: '/doc/ipc',
        link: 'Read the IPC guide'
      },
      skipFeatures: [],
      faq: [
        {
          question: 'Which tRPC version and IPC link does it use?',
          answer:
            'tRPC v11 with trpc-electron, which carries tRPC calls over Electron IPC. On the renderer side, @trpc/tanstack-react-query gives every procedure TanStack Query options.'
        },
        {
          question: 'Is tRPC over IPC secure?',
          answer:
            'The renderer is sandboxed with context isolation and no Node.js, and the preload script only exposes the tRPC link. Every input is validated with zod in the main process before your code runs.'
        },
        {
          question: 'Can I restrict procedures to licensed users?',
          answer:
            'Yes. licensedProcedure only runs when the app has a valid license key, so paid features are enforced in the main process, not only hidden in the UI.'
        },
        {
          question: 'Can I still use ipcMain and ipcRenderer?',
          answer:
            'Yes, nothing prevents it, but tRPC covers requests, mutations and events pushed from the main process, so you rarely need to.'
        }
      ]
    },
    ranking: {
      title: 'Best Electron tRPC boilerplates for type-safe IPC',
      shortTitle: 'tRPC and typed IPC',
      intro:
        'Every Electron boilerplate with typed calls between the renderer and the main process, through tRPC, oRPC or a typed bridge, scored on the same features, Electron version, maintenance and popularity as our main ranking.',
      keywords: [
        'electron trpc boilerplate',
        'electron trpc',
        'electron type safe ipc',
        'electron typed ipc template',
        'electron orpc'
      ],
      columns: ['ipc', 'ui', 'build'],
      focus: ['typedIpc', 'database', 'typescript', 'secureDefaults', 'autoUpdate', 'licensing'],
      howToChoose: [
        {
          title: 'End to end, or partly',
          text: 'A typed preload bridge still needs channel names on both sides. tRPC and oRPC share one router type, so the compiler checks every call.'
        },
        {
          title: 'Validation in the main process',
          text: 'Types disappear at runtime. Inputs should be validated in the main process, with zod or similar, before they reach the database or the file system.'
        },
        {
          title: 'Events from the main process',
          text: 'Menus, updates and background jobs need to push events to the UI. Check that subscriptions are supported and shown in an example.'
        }
      ]
    }
  }
]

export function peersOf(page: StackPage) {
  return page.peers ?? `Electron ${page.name} boilerplates`
}

export function stackByPath(path: string) {
  return stackPages.find((s) => s.path === path || s.rankingPath === path)
}
