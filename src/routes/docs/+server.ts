import type { RequestEvent } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export function GET(request: RequestEvent) {
  return new Response(null, {status: 302, headers: {"location": "https://documenter.getpostman.com/view/13139178/2s8YYLLNBv#intro"}})
}