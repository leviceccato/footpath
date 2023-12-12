// This is necessary since we added ["bun-types"] to tsconfig
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Solid Refresh pragma
/* @refresh reload */

import '@/base.css'
import 'modern-normalize/modern-normalize.css'
import { App } from '@/components/App'
import { render } from 'solid-js/web'

render(() => <App />, document.getElementById('root') as HTMLElement)
