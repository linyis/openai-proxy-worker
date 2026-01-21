// Worker 程式碼 (index.js)

// 設定 OpenAI API 的基礎 URL
const OPENAI_BASE_URL = "https://api.openai.com";

/**
 * 處理所有傳入的請求
 * @param {Request} request
 */
async function handleRequest(request ) {
  // 1. 取得請求路徑 (例如 /v1/chat/completions)
  const url = new URL(request.url);
  const path = url.pathname;

  // 2. 建立新的目標 URL
  // 將請求轉發到 https://api.openai.com + 原始路徑
  const targetUrl = OPENAI_BASE_URL + path;

  // 3. 複製原始請求 ，但修改目標 URL
  // 必須使用新的 Request 物件，因為 Request 物件是不可變的
  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  });

  // 4. 轉發請求並取得回應
  try {
    const response = await fetch(newRequest);
    // 5. 將 OpenAI 的回應直接回傳給客戶端
    return response;
  } catch (error) {
    // 處理轉發失敗的情況
    return new Response(`Proxy Error: ${error.message}`, { status: 500 });
  }
}

// 監聽所有請求
addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});
