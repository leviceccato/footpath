import { isInIframe } from '@/utils/misc'
import { type Component } from 'solid-js'
import * as css from './_Svg.css'

export const Svg: Component = () => {
	if (!isInIframe()) {
		/* Redirect to main route */
		window.history.replaceState(null, '', window.location.origin)
	}

	return <div class={css.root} />
}
