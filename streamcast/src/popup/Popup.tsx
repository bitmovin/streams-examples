import { useEffect, useState } from 'react'
import { ExtensionState, MessageType } from '../interface'
import { getApiKey, getState, setState, storeApiKey } from '../utils'
import { IconCamera, IconCameraOff, IconCheck, IconClipboard, IconLink, IconSettings } from './Icons'
import './Popup.css'
import { Settings } from './Settings'

function App() {
	const [extensionState, setExtensionState] = useState<ExtensionState>()
	const [showSettings, setShowSettings] = useState<boolean>(false)

	useEffect(() => {
		chrome.storage.session.onChanged.addListener(onSessionStorageChange)
		getState(['isRecording', 'streamId', 'isLoading', 'lastTabId', 'recordingTabId', 'error']).then((result) => {
			setExtensionState({
				isLoading: result.isLoading,
				isRecording: result.isRecording,
				lastTabId: result.lastTabId,
				recordingTabId: result.recordingTabId,
				streamId: result.streamId,
				error: result.error,
			} as ExtensionState)
		})

		return () => {
			chrome.storage.session.onChanged.removeListener(onSessionStorageChange)
		}
	}, [])

	const onSessionStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
		const newState = { ...extensionState }
		Object.keys(changes).forEach((key) => {
			newState[key as keyof ExtensionState] = changes[key].newValue
		})
		setExtensionState(newState)
	}

	const copyStreamUrl = () => {
		const url = `https://streams.bitmovin.com/${extensionState?.streamId}/embed`
		navigator.clipboard.writeText(url)
	}

	const startRecording = () => {
		setState('error', '')
		chrome.runtime.sendMessage({ type: MessageType.StartRecording })
	}

	const stopRecording = () => {
		chrome.runtime.sendMessage({ type: MessageType.StopRecording })
	}

	const goToStream = (streamId: string) => {
		const url = `https://streams.bitmovin.com/${streamId}/embed`
		window.open(url, '_blank')
	}

	if (showSettings) {
		return (
			<main>
				<Settings onClose={() => setShowSettings(false)} />
			</main>
		)
	}

	const renderError = (error: string) => {
		return <div className="popup-error">{error}</div>
	}

	const renderStreamInfo = (streamId: string) => {
		return (
			<div className="popup-streaminfo">
				<div>
					<IconCheck />
					<span className="popup-streaminfo-message">Successfully created a new Stream</span>
				</div>
				<div className="popup-streaminfo-buttons">
					<button className="popup-button btn-copy" onClick={copyStreamUrl}>
						<IconClipboard />
						Copy URL
					</button>
					<button className="popup-button btn-link" onClick={() => goToStream(streamId)}>
						<IconLink />
						Go to stream
					</button>
				</div>
			</div>
		)
	}

	return (
		<main>
			<h3>StreamCast</h3>
			<div className="popup-start-stop-buttons">
				{extensionState?.isRecording ? (
					<button className="popup-button btn-stop" onClick={stopRecording}>
						<IconCameraOff />
						Stop
					</button>
				) : (
					<button className="popup-button btn-start" onClick={startRecording}>
						<IconCamera /> Record
					</button>
				)}
			</div>
			{extensionState?.isRecording && <div>Recording...</div>}
			{extensionState?.streamId && !extensionState?.isRecording && renderStreamInfo(extensionState.streamId)}
			<div>{extensionState?.isLoading && <span>UPLOADING</span>}</div>
			{extensionState?.error && renderError(extensionState.error)}
			<button className="icon-button btn-settings" onClick={() => setShowSettings(true)}>
				<IconSettings />
			</button>
		</main>
	)
}

export default App
