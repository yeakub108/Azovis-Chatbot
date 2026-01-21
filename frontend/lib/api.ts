import { ChatResponse } from "./types";

// Use environment variable for API URL
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api`;

// Helper function for better error messages
async function handleFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error("Network error:", error);
    throw new Error(
      "Cannot connect to server. Please check if server is running."
    );
  }
}

export async function sendMessage(
  message: string,
  sessionId: string,
): Promise<ChatResponse> {
  console.log("Sending request to:", `${API_BASE_URL}/chat`);

  const response = await handleFetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      sessionId,
    }),
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function resetConversation(
  sessionId: string,
): Promise<ChatResponse> {
  console.log("Sending request to:", `${API_BASE_URL}/chat/reset`);

  const response = await handleFetch(`${API_BASE_URL}/chat/reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sessionId,
    }),
  });

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Server error:", errorText);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
