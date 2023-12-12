// This is necessary since we added ["bun-types"] to tsconfig
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Solid Refresh pragma
/* @refresh reload */

import '@/base.css'
import 'modern-normalize/modern-normalize.css'
import { TheApp } from '@/components/TheApp'
import { render } from 'solid-js/web'

render(() => <TheApp />, document.getElementById('root') as HTMLElement)
