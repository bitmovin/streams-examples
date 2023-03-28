import { Message, MessageSender, MessageType } from './interface'
import BitmovinApi, { InputType, StreamsVideoResponse } from '@bitmovin/api-sdk'
import { getApiKey, getState, setState, setStates } from './utils'

let bitmovinApi: BitmovinApi
let mediaRecorder: MediaRecorder

chrome.runtime.onMessage.addListener(messageHandler)

async function messageHandler(request: Message, _sender: MessageSender, sendResponse: (response: Message) => void) {
	if (request.type === MessageType.StopRecording) {
		stopCapture()
	}
}

setupApi()
startCapture()

function setupApi() {
	getApiKey().then((apiKey) => {
		bitmovinApi = new BitmovinApi({ apiKey })
	})
}

function startCapture() {
	setState('error', undefined)

	chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'tab'], function (streamId) {
		if (!streamId) {
			getState('lastTabId').then(async (result) => {
				await chrome.tabs.update(result.lastTabId!!, { active: true, selected: true })

				getState('recordingTabId').then((result) => {
					chrome.tabs.remove(result.recordingTabId)
				})
			})

			return
		}
		const videoOptions = {
			mandatory: {
				chromeMediaSource: 'desktop',
				chromeMediaSourceId: streamId,
			},
		}

		// Once user has chosen screen or window, create a stream from it and start recording
		navigator.mediaDevices
			.getUserMedia({
				audio: false,
				video: videoOptions as any,
			})
			.then((stream) => {
				setState('isRecording', true)

				mediaRecorder = new MediaRecorder(stream)
				const chunks: any[] = []

				mediaRecorder.ondataavailable = function (e) {
					chunks.push(e.data)
				}

				mediaRecorder.onstop = async function (e) {
					stream.getTracks().forEach((track) => track.stop())

					setState('isRecording', false)

					const blob = new Blob(chunks, {
						type: 'video/webm',
					})

					downloadLocally(blob)
					uploadFile(blob).then(async (result) => {
						let newState
						if (result instanceof Error) {
							newState = {
								isLoading: false,
								error: 'Something went wrong',
							}
						} else {
							newState = {
								streamId: result.id,
								isLoading: false,
							}
						}

						await chrome.action.setIcon({ path: '/icons/streams-icon-web.png' })
						setStates(newState, () => {
							getState('recordingTabId').then((result) => {
								chrome.tabs.remove(result.recordingTabId)
							})
						})
					})
				}

				mediaRecorder.start()
				chrome.action.setIcon({ path: '/icons/streams-icon-web-active.png' })
				getState('lastTabId').then((result) => {
					chrome.tabs.update(result.lastTabId!!, { active: true, selected: true })
				})
			})
	})
}

function downloadLocally(blob: Blob) {
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	document.body.appendChild(a)
	a.setAttribute('style', 'display: none')
	a.href = url
	a.download = 'StreamCast.webm'
	a.click()
	window.URL.revokeObjectURL(url)
}

async function uploadFile(file: Blob): Promise<StreamsVideoResponse | Error> {
	setState('isLoading', true)
	try {
		const input = await bitmovinApi.encoding.inputs.directFileUpload.create({
			type: InputType.DIRECT_FILE_UPLOAD,
			name: 'StreamCast',
		})
		const inputId = input.id
		const uploadUrl = input.uploadUrl

		await fetch(uploadUrl!!, { method: 'PUT', body: file })
		const assetUrl = `https://api.bitmovin.com/v1/encoding/inputs/direct-file-upload/${inputId}`

		const requestData = { assetUrl, title: 'StreamCast' }
		return bitmovinApi.streams.video.create(requestData)
	} catch (e: any) {
		console.error(e)
		return new Error('Something went wrong')
	}
}

function stopCapture() {
	mediaRecorder.stop()
}
