import { useEffect, useState } from 'react'
import { clearState, getApiKey, getState, storeApiKey } from '../utils'
import { IconClose, IconSave } from './Icons'

interface Props {
	onClose: () => void
}

export const Settings: React.FC<Props> = ({ onClose }) => {
	const [apiKey, setApiKey] = useState<string>('')
	const [didUpdate, setDidUpdate] = useState<boolean>(false)

	useEffect(() => {
		chrome.storage.sync.onChanged.addListener(onApiKeyChange)

		getApiKey().then((apiKey) => {
			setApiKey(apiKey)
		})

		return () => {
			chrome.storage.sync.onChanged.removeListener(onApiKeyChange)
		}
	}, [])

	const onApiKeyChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
		if (changes.apiKey && changes.apiKey.newValue) {
			setApiKey(changes.apiKey.newValue)
		}
	}

	const updateApiKey = () => {
		storeApiKey(apiKey)
		setDidUpdate(true)
	}

	const renderApiKeyHint = () => {
		console.log(apiKey)
		if (apiKey?.length > 0) {
			return
		}

		return (
			<div className="api-key-hint">
				You can find your API key in your{' '}
				<a href="https://bitmovin.com/dashboard/account" target="_blank">
					Bitmovin dashboard
				</a>
				.
			</div>
		)
	}

	return (
		<div className="popup-settings">
			<button className="icon-button btn-settings" onClick={onClose}>
				<IconClose />
			</button>
			<h3>Settings</h3>
			{renderApiKeyHint()}
			<div className="settings-container">
				<div className="settings-item">
					<label htmlFor="api-key">Bitmovin API key</label>
					<input id="api-key" type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
				</div>
			</div>
			<button className="popup-button btn-save-settings" onClick={updateApiKey}>
				<IconSave />
				Save
			</button>
			{didUpdate && <div className="settings-update-msg">Settings updated!</div>}
		</div>
	)
}
