import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
	name: 'streamcast',
	description: '',
	version: '0.0.1',
	manifest_version: 3,
	icons: {
		'16': 'icons/streams-icon-web.png',
		'32': 'icons/streams-icon-web.png',
		'48': 'icons/streams-icon-web.png',
		'128': 'icons/streams-icon-web.png',
	},
	action: {
		default_popup: 'popup.html',
		default_icon: 'icons/streams-icon-web.png',
	},
	options_page: 'options.html',
	background: {
		service_worker: 'src/background/index.ts',
		type: 'module',
	},
	content_scripts: [
		{
			matches: ['<all_urls>'],
			js: ['src/content/index.ts'],
		},
	],
	web_accessible_resources: [
		{
			resources: ['icons/streams-icon-web.png', 'icons/streams-icon-web-active.png'],
			matches: [],
		},
	],
	permissions: ['tabs', 'activeTab', 'storage', 'desktopCapture'],
})
