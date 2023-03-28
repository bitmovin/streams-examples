import { Message, MessageSender } from '../interface'

chrome.runtime.onMessage.addListener(messageListener)

async function messageListener(request: Message, _sender: MessageSender, sendResponse: (response: Message) => void) {}
