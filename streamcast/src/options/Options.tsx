import { useState } from 'react'
import './Options.css'

function App() {
	const [crx, setCrx] = useState('create-chrome-ext')

	return (
		<main>
			<h3>Options Page</h3>

			<p>StreamCasts options</p>
			<label htmlFor="apiKey">API Key</label>
			<input id="apiKey" />
		</main>
	)
}

export default App
