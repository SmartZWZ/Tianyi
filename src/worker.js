export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    if (response.status !== 404) return response

    const accept = request.headers.get("Accept") || ""
    const isHtml = accept.includes("text/html")
    if (!isHtml) return response

    const url = new URL(request.url)
    url.pathname = "/index.html"

    return env.ASSETS.fetch(new Request(url.toString(), request))
  },
}
