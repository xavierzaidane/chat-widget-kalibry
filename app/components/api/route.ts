export async function callChatAPI(messages: Array<{ role: string; text: string }>) {
  try {
    const apiUrl = (import.meta.env.VITE_CHAT_API_URL as string) || "";
    
    if (!apiUrl) {
      throw new Error('Chat API URL is not configured');
    }

    const payload = {
      chat_history: messages.map((m) => ({
        role: m.role === "bot" ? "assistant" : m.role,
        content: m.text,
      })),
      language: "en",
    };

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend error:", errText);
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    
    console.log('Raw API Response:', data);

    if (typeof data === 'string') {
      return data;
    }
    
    if (data?.response && typeof data.response === 'object') {
      if (data.response.content && typeof data.response.content === 'string') {
        return data.response.content;
      }
    }
    
    if (data?.content && typeof data.content === 'string') {
      return data.content;
    }
    
    if (data?.response && typeof data.response === 'string') {
      return data.response;
    }
    
    if (data?.message && typeof data.message === 'string') {
      return data.message;
    }

    console.warn('Could not extract content from response:', data);
    return "No response received";
  } catch (err) {
    console.error("Chat API Error:", err);
    return "Failed to get response. Please try again.";
  }
}
