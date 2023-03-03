import type { Component } from 'solid-js'
import { isInIframe } from '@/utils/misc'
import * as css from './RouteSvg.css'

const RouteSvg: Component = () => {
	if (!isInIframe()) {
		window.history.replaceState(null, '', window.location.origin)
	}

	return <div class={css.root}></div>
}

export default RouteSvg
