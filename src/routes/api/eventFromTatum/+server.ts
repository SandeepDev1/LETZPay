import type {RequestEvent} from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function POST(request: RequestEvent) {
    const data = await request.request.json()
    return new Response("OK", {status: 200})
}