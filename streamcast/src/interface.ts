export enum MessageType {
	StartRecording = 'StartRecording',
	StopRecording = 'StopRecording',
}

export interface Message {
	type: MessageType
	payload?: unknown
}

export interface ExtensionState {
	isRecording?: boolean
	streamId?: string
	isLoading?: boolean
	lastTabId?: number
	recordingTabId?: number
	error?: string
}

export interface MessageSender {
	id?: string
	origin?: string
}
