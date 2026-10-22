import { configSchema } from '@shared/config'
import { createTypedStore } from './typed-store'

/** App config, saved as `config.json` in the user data folder. */
export const config = createTypedStore(configSchema)
