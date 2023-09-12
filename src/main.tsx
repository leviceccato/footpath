// This is necessary since we added ["bun-types"] to tsconfig
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Solid Refresh pragma
/* @refresh reload */

import 'modern-normalize/modern-normalize.css'
import '@/base.css'

import { render } from 'solid-js/web'

import TheApp from '@/components/TheApp'

render(() => <TheApp />, document.getElementById('root') as HTMLElement)
