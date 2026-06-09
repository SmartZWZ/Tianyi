export default {
  async fetch(request, env) {
    const direct = await env.ASSETS.fetch(request)
    if (direct.status !== 404) return direct

    const url = new URL(request.url)
    const pathname = url.pathname
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length >= 2) {
      const stripped = "/" + segments.slice(1).join("/")
      const url2 = new URL(request.url)
      url2.pathname = stripped
      const retry = await env.ASSETS.fetch(new Request(url2.toString(), request))
      if (retry.status !== 404) return retry
    }

    const accept = request.headers.get("Accept") || ""
    const isHtml = accept.includes("text/html")
    if (!isHtml) return direct

    url.pathname = "/index.html"

    return env.ASSETS.fetch(new Request(url.toString(), request))
  },
}
