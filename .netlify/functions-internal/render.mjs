import { init } from '../serverless.js';

export const handler = init({
	appDir: "_app",
	assets: new Set(["favicon.png","letzpay copy.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		entry: {"file":"_app/immutable/start-ed7a39f5.js","imports":["_app/immutable/start-ed7a39f5.js","_app/immutable/chunks/index-261e70bd.js","_app/immutable/chunks/singletons-04d00b6b.js"],"stylesheets":[]},
		nodes: [
			() => import('../server/nodes/0.js'),
			() => import('../server/nodes/1.js'),
			() => import('../server/nodes/2.js')
		],
		routes: [
			{
				id: "",
				pattern: /^\/$/,
				names: [],
				types: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			},
			{
				id: "api/createPaymentLink",
				pattern: /^\/api\/createPaymentLink\/?$/,
				names: [],
				types: [],
				page: null,
				endpoint: () => import('../server/entries/endpoints/api/createPaymentLink/_server.ts.js')
			},
			{
				id: "api/eventFromTatum",
				pattern: /^\/api\/eventFromTatum\/?$/,
				names: [],
				types: [],
				page: null,
				endpoint: () => import('../server/entries/endpoints/api/eventFromTatum/_server.ts.js')
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
});
