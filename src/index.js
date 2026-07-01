const TARGET = "https://mickey7207-mickeycam.hf.space";

export default {
  async fetch(request) {
    const incoming = new URL(request.url);
    const target = new URL(TARGET);

    target.pathname = incoming.pathname;
    target.search = incoming.search;

    const headers = new Headers(request.headers);

    // Send the correct Host to Hugging Face
    headers.set("Host", target.hostname);

    const response = await fetch(target.toString(), {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : request.body,
      redirect: "manual",
    });

    const newHeaders = new Headers(response.headers);

    // Rewrite redirects to your custom domain
    const location = newHeaders.get("location");
    if (location) {
      newHeaders.set(
        "location",
        location.replace(TARGET, incoming.origin)
      );
    }

    // Rewrite cookie domain if present
    const cookie = newHeaders.get("set-cookie");
    if (cookie) {
      newHeaders.set(
        "set-cookie",
        cookie.replace(/Domain=[^;]+;?/i, "")
      );
    }

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(fetch(TARGET).catch(() => {}));
  },
};
