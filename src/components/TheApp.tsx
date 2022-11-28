import { For, Show } from 'solid-js'
import { Routes, Route } from '@solidjs/router'
import { createStore } from 'solid-js/store'
import { useI18n } from '@/components/ProviderI18n'
import { useTheme } from '@/components/ProviderTheme'
import { useIcons } from '@/components/ProviderIcons'
import type { Component } from 'solid-js'
import * as css from './TheApp.css'

import ErrorDisplay from '@/components/ErrorDisplay'
import RouteMain from '@/components/RouteMain'

const TheApp: Component = () => {
	const [theme] = useTheme()

	return (
		<div
			class={`${css.root} ${theme().class}`}
			style={theme().vars}
		>
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
