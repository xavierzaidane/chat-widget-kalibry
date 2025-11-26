export async function callChatAPI(
  messages: Array<{ role: string; text: string }>,
  signal?: AbortSignal
) {
  try {
    // Resolve API URL from multiple fallbacks so widget works when injected into Shopify
    const envUrl = (import.meta as any).env?.VITE_CHAT_API_URL as string | undefined;
    const win = (typeof window !== 'undefined' ? (window as any) : undefined);
    const configUrl = win?.__KALIBRY_WIDGET_CONFIG__?.CHAT_API_URL;
    const scriptDatasetUrl = (() => {
      if (typeof document === 'undefined') return undefined;
      // prefer script with data-chat-api-url attribute (the script tag used to inject the widget)
      const s = document.querySelector('script[data-chat-api-url]') as HTMLScriptElement | null;
      return s?.dataset?.chatApiUrl;
    })();

    const apiUrl = (envUrl || configUrl || scriptDatasetUrl || '').trim();

    if (!apiUrl) {
      throw new Error('Chat API URL is not configured');
    }

    const payload = {
      chat_history: messages.map((m) => ({
        role: m.role === 'bot' ? 'assistant' : m.role,
        content: m.text,
      })),
      language: 'en',
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: signal || controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('Backend error:', errText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json().catch(() => null);
    console.log('Raw API Response:', data);

    if (typeof data === 'string') return data;
    if (data?.response?.content && typeof data.response.content === 'string') return data.response.content;
    if (data?.content && typeof data.content === 'string') return data.content;
    if (data?.response && typeof data.response === 'string') return data.response;
    if (data?.message && typeof data.message === 'string') return data.message;

    console.warn('Could not extract content from response:', data);
    return 'No response received';
  } catch (err: any) {
    console.error('Chat API Error:', err);
    if (err?.name === 'AbortError') return 'Request timeout. Please try again.';
    return 'Failed to get response. Please try again.';
  }
}
