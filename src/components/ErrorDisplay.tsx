import { ErrorBoundary } from 'solid-js/web'
import type { ParentComponent } from 'solid-js'
import * as css from './ErrorDisplay.css'

import Text from '@/components/Text'

const ErrorDisplay: ParentComponent = (props) => {
	return (
		<ErrorBoundary
			fallback={(error) => (
				<div class={css.root}>
					<Text variant="bodyS">An error has occured in script execution</Text>
					<Text variant="bodyXs">See console for error output</Text>
					{() => {
						console.error(error)
						return null
					}}
				</div>
			)}
		>
			{props.children}
		</ErrorBoundary>
	)
}

export default ErrorDisplay
