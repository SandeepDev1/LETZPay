import type { RequestEvent } from "@sveltejs/kit";
import { getChargeDetailsFromId } from "../../../lib/mongo/db";

/** @type {import('./$types').RequestHandler} */
export async function GET(request: RequestEvent) {
  const chargeId = request.url.searchParams.get("id")
  if(!chargeId){
    return new Response(JSON.stringify({success: false, error: true, msg: "CHARGE_ID_MISSING"}), {status: 400, headers: {"Content-Type": "application/json"}})
  }

  const charge = await getChargeDetailsFromId(chargeId)
  if(!charge) {
    return new Response(JSON.stringify({success: false, error: true, msg: "SOMETHING_WENT_WRONG"}), {status: 500, headers: {"Content-Type": "application/json"}})
  }
  //@ts-ignore
  delete charge._id
  delete charge.derivationKey
  //@ts-ignore
  delete charge.webhookUrl

  return new Response(JSON.stringify(charge), {status: 200, headers: {"Content-Type": "application/json"}})
}