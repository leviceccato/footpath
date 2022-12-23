import type { Component } from 'solid-js'
import { isInIframe } from '@/scripts/utils'
import { useNavigate } from '@solidjs/router'
import * as css from './RouteSvg.css'

const RouteSvg: Component = () => {
	const navigate = useNavigate()

	if (!isInIframe()) {
		navigate('/', { replace: true })
	}

	return <div class={css.root}></div>
}

export default RouteSvg
