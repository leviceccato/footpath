import { Routes, Route } from '@solidjs/router'
import type { Component } from 'solid-js'
import * as css from './TheApp.css'

import ErrorDisplay from '@/components/ErrorDisplay'
import RouteMain from '@/components/RouteMain'

const TheApp: Component = () => {
	return (
		<div class={css.root}>
			<ErrorDisplay>
				<Routes>
					<Route
						path="/"
						component={RouteMain}
					/>
				</Routes>
			</ErrorDisplay>
		</div>
	)
}

export default TheApp
