import type { ParentComponent } from 'solid-js'

type FieldTextProps = {
	rows?: number
	maxRows?: number
	isResizable?: boolean
}

const FieldText: ParentComponent<FieldTextProps> = (_) => {
	return (
		<div>
			<label>
				<input />
			</label>
		</div>
	)
}

export default FieldText
