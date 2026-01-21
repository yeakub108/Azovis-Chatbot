"use client";

import { useEffect, useState } from "react";

export default function TestAPIPage() {
  const [apiUrl, setApiUrl] = useState<string>("");
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Check if env variable is loaded
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || "Not set");
  }, []);

  const testBackend = async () => {
    setError("");
    setTestResult(null);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/health`;
    console.log("Testing backend at:", url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTestResult(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error:", err);
    }
  };

  const testChatAPI = async () => {
    setError("");
    setTestResult(null);

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/chat`;
    console.log("Testing chat API at:", url);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Hello",
          sessionId: "test-session",
        }),
      });

      const data = await response.json();
      setTestResult(data);
    } catch (err: any) {
      setError(err.message);
      console.error("Error:", err);
    }
  };

  return (
    <div style={{ padding: "50px", fontFamily: "monospace" }}>
      <h1>Backend Connection Test</h1>

      <div style={{ marginBottom: "20px" }}>
        <strong>NEXT_PUBLIC_API_URL:</strong> {apiUrl}
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={testBackend}
          style={{ padding: "10px 20px", marginRight: "10px" }}
        >
          Test Health Endpoint
        </button>
        <button onClick={testChatAPI} style={{ padding: "10px 20px" }}>
          Test Chat API
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#fee",
            border: "1px solid red",
            marginBottom: "20px",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {testResult && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#efe",
            border: "1px solid green",
          }}
        >
          <strong>Success:</strong>
          <pre>{JSON.stringify(testResult, null, 2)}</pre>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <h3>Manual Test URLs:</h3>
        <ul>
          <li>
            <a href="http://localhost:5000/health" target="_blank">
              http://localhost:5000/health
            </a>
          </li>
          <li>
            <a href="http://localhost:5000/" target="_blank">
              http://localhost:5000/
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
