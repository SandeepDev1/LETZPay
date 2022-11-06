import type { RequestEvent } from "@sveltejs/kit";
import { CurrencyList } from "../../../lib/tatum/models";

/** @type {import('./$types').RequestHandler} */
export async function GET(request: RequestEvent) {
  return new Response(JSON.stringify(CurrencyList), {status: 200, headers: {"Content-Type": "application/json"}})
}