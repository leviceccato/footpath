import { fontFace, globalStyle as g } from '@vanilla-extract/css'
import * as themeCss from '@/components/ProviderTheme.css'

export type Font = {
	weight: number
	top: number
	bottom: number
	family: string
}

export const fontPlexSansMedium: Font = {
	weight: 500,
	top: 0.85,
	bottom: 0.85,
	family: fontFace({
		src: `local("IBM Plex Sans"), url("/fonts/IBMPlexSans-Medium.woff2") format("woff2")`,
	}),
}

export const fontPlexMonoRegular: Font = {
	weight: 400,
	top: 0.85,
	bottom: 0.85,
	family: fontFace({
		src: `local("IBM Plex Sans"), url("/fonts/IBMPlexMono-Regular.woff2") format("woff2")`,
	}),
}

export const fontPlexMonoBold: Font = {
	weight: 700,
	top: 0.85,
	bottom: 0.85,
	family: fontFace({
		src: `local("IBM Plex Sans"), url("/fonts/IBMPlexMono-Bold.woff2") format("woff2")`,
	}),
}

g('html', {
	height: '100%',
})

g('body', {
	margin: 0,
	height: '100%',
	// Fixes bold looking fonts on macOS in Chrome & Safari
	WebkitFontSmoothing: 'antialiased',
	// Fixes bold looking fonts on macOS in Firefox
	MozOsxFontSmoothing: 'grayscale',
	lineHeight: 1.4,
	fontFamily: 'inherit',
})

g('::selection', {
	backgroundColor: `rgba(${themeCss.colourBase1000Var}, 0.2)`,
	color: themeCss.colour1000Var,
})

g('blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre', {
	margin: 0,
})

g('ol, ul', {
	listStyle: 'none',
	margin: 0,
	padding: 0,
})

g('h1, h2, h3, h4, h5, h6', {
	fontSize: 'inherit',
	fontWeight: 'inherit',
})

g('a', {
	color: 'inherit',
	textDecoration: 'inherit',
})

g('input', {
	fontFamily: 'inherit',
	fontSize: 'inherit',
	color: 'inherit',
})

g('input::-webkit-input-placeholder', {
	color: 'inherit',
})

g('input::placeholder', {
	color: 'inherit',
	opacity: 'inherit',
})

g('input::-ms-clear', {
	display: 'none',
	width: 0,
	height: 0,
})

// Clears the 'X' from Chrome
g(
	'input[type="search"]::-webkit-search-decoration, input[type="search"]::-webkit-search-cancel-button, input[type="search"]::-webkit-search-results-button, input[type="search"]::-webkit-search-results-decoration',
	{
		display: 'none',
	},
)

g('input[type=range]', {
	WebkitAppearance: 'none',
	width: '100%',
	display: 'block',
})

g('input[type=range]::-webkit-slider-thumb', {
	WebkitAppearance: 'none',
})

g(':where(input[type=range]:focus)', {
	outline: 'none',
})

g('input[type=range]::-ms-track', {
	width: '100%',
	background: 'transparent',
	cursor: 'pointer',
	borderColor: 'transparent',
	color: 'transparent',
})

g('button, textarea, input, select, a', {
	WebkitTapHighlightColor: ['rgba(0, 0, 0, 0)', 'transparent'],
})

g('button', {
	display: 'inline-flex',
	color: 'inherit',
	background: 'none',
	border: 'none',
	fontFamily: 'inherit',
	textAlign: 'inherit',
	fontSize: 'inherit',
	letterSpacing: 'inherit',
	lineHeight: 'inherit',
	padding: 0,
})

g('button:focus', {
	outline: 'none',
})

g('button:enabled', {
	cursor: 'pointer',
})

g('button:disabled', {
	cursor: 'not-allowed',
})

g('img, svg, video, canvas, audio, iframe, embed, object', {
	maxWidth: '100%',
	display: 'block',
	verticalAlign: 'middle',
})

g('svg', {
	fill: 'currentColor',
})
