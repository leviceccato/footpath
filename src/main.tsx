// Solid Refresh pragma
/* @refresh reload */

import 'modern-normalize/modern-normalize.css'
import '@/base.css'

import { render } from 'solid-js/web'
import PocketBase from 'pocketbase'

import TheApp from '@/components/TheApp'

render(() => <TheApp />, document.getElementById('root') as HTMLElement)

const pb = new PocketBase(import.meta.env.VITE_API_URL)

pb.collection('users')
	.getFullList(200, { sort: '-created' })
	.then((data) => {
		console.log('data', data)
	})
