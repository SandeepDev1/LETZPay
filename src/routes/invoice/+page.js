
/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
  const res = await fetch("/api/getCurrency", {method: "GET"})
  const text = await res.text()
  return JSON.parse(text)
}