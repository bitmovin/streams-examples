import { ExtensionState } from './interface'

export function setState(key: keyof ExtensionState, value: any, callback: () => void = () => {}) {
	chrome.storage.session.set({ [key]: value }, callback)
}

export function setStates(items: { [key: string]: any }, callback: () => void = () => {}) {
	chrome.storage.session.set(items, callback)
}

export function getState(keys: keyof ExtensionState | Array<keyof ExtensionState>): Promise<{ [key: string]: any }> {
	return chrome.storage.session.get(keys)
}

export function clearState(callback: () => void = () => {}) {
	chrome.storage.session.clear(callback)
}

export function storeApiKey(apiKey: string) {
	chrome.storage.sync.set({ apiKey }, () => {})
}

export async function getApiKey() {
	const key = await chrome.storage.sync.get('apiKey')
	return key.apiKey
}
