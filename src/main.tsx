// Solid Refresh pragma
/* @refresh reload */

import 'modern-normalize/modern-normalize.css'

import { render } from 'solid-js/web'

import App from '@/components/TheApp'

render(() => <App />, document.getElementById('root') as HTMLElement)
