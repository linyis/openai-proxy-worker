const OPENAI_BASE_URL = "https://api.openai.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const targetUrl = OPENAI_BASE_URL + url.pathname;

    // 預檢請求（CORS）
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      });
    }

    // 複製 headers，並注入 OpenAI API Key
    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${env.OPENAI_API_KEY}`);
    headers.set("Host", "api.openai.com");

    // 讀取 body（只能一次）
    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const response = await fetch(proxyRequest);

    // 回傳 response（加 CORS）
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
