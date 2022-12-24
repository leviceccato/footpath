import { Routes, Route } from '@solidjs/router'
import type { Component } from 'solid-js'
import * as css from './TheApp.css'

import RouteMain from '@/components/RouteMain'
import RouteSvg from '@/components/RouteSvg'

const TheApp: Component = () => {
	return (
		<div class={css.root}>
			<Routes>
				<Route
					path="/"
					component={RouteMain}
				/>
				<Route
					path="/svg"
					component={RouteSvg}
				/>
			</Routes>
		</div>
	)
}

export default TheApp
