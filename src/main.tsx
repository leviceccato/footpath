/* Solid Refresh pragma */
/* @refresh reload */

import '@/base.css'
import { App } from '@/components/App'
import 'modern-normalize/modern-normalize.css'
import { render } from 'solid-js/web'

const rootId = 'root'
const root = document.getElementById(rootId)
if (!root) {
	console.error(`Failed to mount app, no element with id '${rootId}' found`)
} else {
	render(() => <App />, root)
}
