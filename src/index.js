const TARGET = "https://mickey7207-mickeycam.hf.space";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    const target = new URL(TARGET);
    target.pathname = url.pathname;
    target.search = url.search;

    const proxyRequest = new Request(target.toString(), request);

    return fetch(proxyRequest, {
      redirect: "follow"
    });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      fetch(TARGET, {
        method: "GET",
        headers: {
          "User-Agent": "Cloudflare-KeepAlive"
        }
      }).catch(() => {})
    );
  }
};
