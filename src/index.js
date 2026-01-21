const OPENAI_BASE_URL = "https://api.openai.com";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const targetUrl = OPENAI_BASE_URL + url.pathname + url.search;

    // CORS 預檢
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    /**
     * ⚠️ 關鍵：不要用 request.headers
     * 只建立「必要的乾淨 headers」
     */
    const headers = new Headers();
    headers.set("Authorization", `Bearer ${env.OPENAI_API_KEY}`);
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");

    // 只在需要 body 的方法讀 body
    let body;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.text(); // 保留原始 JSON
    }

    const openaiRequest = new Request(targetUrl, {
      method: request.method,
      headers,
      body,
    });

    const response = await fetch(openaiRequest);

    // 回傳 response（加 CORS）
    const respHeaders = new Headers(response.headers);
    respHeaders.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, {
      status: response.status,
      headers: respHeaders,
    });
  },
};
