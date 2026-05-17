import { useState, useRef, useEffect, ReactNode } from "react";
import { getBotResponse, defaultMessage } from "./chatbotData";

interface Message {
  id: number;
  role: "bot" | "user";
  text: string;
  time: string;
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Simple markdown-like renderer for bold, code blocks, inline code, links, lists
function renderMarkdown(text: string): ReactNode {
  const lines = text.split("\n");
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block start
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={key++}
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "6px",
            padding: "10px 12px",
            fontSize: "12px",
            overflowX: "auto",
            margin: "6px 0",
            color: "#7dd3fc",
            fontFamily: "monospace",
          }}
        >
          {codeLines.join("\n")}
        </pre>
      );
      continue;
    }

    // Table row
    if (line.startsWith("|")) {
      const cells = line.split("|").filter((c) => c.trim() !== "");
      if (cells.every((c) => c.trim().replace(/-/g, "") === "")) continue; // separator row
      elements.push(
        <div key={key++} style={{ display: "flex", gap: "4px", margin: "2px 0", fontSize: "12px" }}>
          {cells.map((cell, ci) => (
            <span
              key={ci}
              style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: "4px",
                padding: "2px 8px",
                flex: 1,
                color: "#e2e8f0",
              }}
            >
              {cell.trim()}
            </span>
          ))}
        </div>
      );
      continue;
    }

    // List item
    if (line.match(/^[-*•]\s/) || line.match(/^\d+\.\s/)) {
      elements.push(
        <div key={key++} style={{ display: "flex", gap: "6px", margin: "2px 0", fontSize: "13px" }}>
          <span style={{ color: "#38bdf8", flexShrink: 0 }}>›</span>
          <span>{inlineFormat(line.replace(/^[-*•]\s/, "").replace(/^\d+\.\s/, ""))}</span>
        </div>
      );
      continue;
    }

    // Empty line → spacer
    if (line.trim() === "") {
      elements.push(<div key={key++} style={{ height: "4px" }} />);
      continue;
    }

    // Normal line
    elements.push(
      <div key={key++} style={{ margin: "2px 0", fontSize: "13px", lineHeight: "1.5" }}>
        {inlineFormat(line)}
      </div>
    );
  }

  return <>{elements}</>;
}

function inlineFormat(text: string): ReactNode[] {
  // Handles **bold**, `inline code`, [link](url), ✅ emoji checkboxes
  const parts: (JSX.Element | string)[] = [];
  const regex = /\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) {
      parts.push(<strong key={key++} style={{ color: "#f0f9ff", fontWeight: 700 }}>{match[1]}</strong>);
    } else if (match[2]) {
      parts.push(
        <code
          key={key++}
          style={{
            background: "rgba(0,0,0,0.35)",
            borderRadius: "4px",
            padding: "1px 5px",
            fontSize: "12px",
            color: "#7dd3fc",
            fontFamily: "monospace",
          }}
        >
          {match[2]}
        </code>
      );
    } else if (match[3] && match[4]) {
      parts.push(
        <a
          key={key++}
          href={match[4]}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#38bdf8", textDecoration: "underline" }}
        >
          {match[3]}
        </a>
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "bot", text: defaultMessage, time: getTime() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed, time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const botReply = getBotResponse(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: botReply, time: getTime() },
      ]);
      setTyping(false);
    }, 700);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const quickQuestions = [
    "How do I get a GitHub token?",
    "How do I set up the project?",
    "What does this app do?",
    "How do I fix MongoDB errors?",
  ];

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Open Help Chat"
        style={{
          position: "fixed",
          bottom: "28px",
          right: "28px",
          width: "58px",
          height: "58px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 24px rgba(14,165,233,0.45)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: "transform 0.2s, box-shadow 0.2s",
          fontSize: "24px",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 32px rgba(14,165,233,0.6)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(14,165,233,0.45)";
        }}
      >
        {open ? "✕" : "🤖"}
      </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "100px",
            right: "28px",
            width: "360px",
            maxHeight: "560px",
            borderRadius: "16px",
            background: "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)",
            border: "1px solid rgba(99,102,241,0.3)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9998,
            overflow: "hidden",
            fontFamily: "'Segoe UI', system-ui, sans-serif",
            animation: "chatPop 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <style>{`
            @keyframes chatPop {
              from { opacity: 0; transform: scale(0.85) translateY(20px); }
              to   { opacity: 1; transform: scale(1)    translateY(0);     }
            }
            @keyframes blink {
              0%,80%,100% { opacity: 0; } 40% { opacity: 1; }
            }
            .chat-scrollbar::-webkit-scrollbar { width: 4px; }
            .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.4); border-radius: 4px; }
          `}</style>

          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(90deg, #0ea5e9, #6366f1)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ fontSize: "22px" }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>GitHub Tracker Assistant</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px" }}>Always here to help</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                marginLeft: "auto",
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="chat-scrollbar"
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  gap: "8px",
                  alignItems: "flex-end",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: msg.role === "bot"
                      ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
                      : "linear-gradient(135deg,#10b981,#0ea5e9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    flexShrink: 0,
                  }}
                >
                  {msg.role === "bot" ? "🤖" : "👤"}
                </div>

                {/* Bubble */}
                <div style={{ maxWidth: "78%" }}>
                  <div
                    style={{
                      background: msg.role === "bot"
                        ? "rgba(255,255,255,0.06)"
                        : "linear-gradient(135deg,#0ea5e9,#6366f1)",
                      color: "#e2e8f0",
                      borderRadius: msg.role === "bot" ? "12px 12px 12px 2px" : "12px 12px 2px 12px",
                      padding: "10px 13px",
                      border: msg.role === "bot" ? "1px solid rgba(255,255,255,0.08)" : "none",
                    }}
                  >
                    {msg.role === "bot" ? renderMarkdown(msg.text) : <span style={{ fontSize: "13px" }}>{msg.text}</span>}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      color: "rgba(255,255,255,0.3)",
                      marginTop: "3px",
                      textAlign: msg.role === "user" ? "right" : "left",
                      paddingLeft: msg.role === "bot" ? "4px" : 0,
                      paddingRight: msg.role === "user" ? "4px" : 0,
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                <div
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg,#0ea5e9,#6366f1)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px",
                  }}
                >
                  🤖
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px 12px 12px 2px",
                    padding: "12px 16px",
                    display: "flex",
                    gap: "4px",
                    alignItems: "center",
                  }}
                >
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <span
                      key={i}
                      style={{
                        width: "6px", height: "6px",
                        borderRadius: "50%", background: "#7dd3fc",
                        animation: `blink 1.2s ${delay}s infinite`,
                        display: "inline-block",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div style={{ padding: "0 12px 8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => {
                      const userMsg: Message = { id: Date.now(), role: "user", text: q, time: getTime() };
                      setMessages((prev) => [...prev, userMsg]);
                      setInput("");
                      setTyping(true);
                      setTimeout(() => {
                        setMessages((prev) => [
                          ...prev,
                          { id: Date.now() + 1, role: "bot", text: getBotResponse(q), time: getTime() },
                        ]);
                        setTyping(false);
                      }, 700);
                    }, 0);
                  }}
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.35)",
                    borderRadius: "20px",
                    color: "#a5b4fc",
                    fontSize: "11px",
                    padding: "4px 10px",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.3)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.15)"; }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input bar */}
          <div
            style={{
              padding: "10px 12px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "10px",
                padding: "9px 13px",
                color: "#e2e8f0",
                fontSize: "13px",
                outline: "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              style={{
                background: input.trim()
                  ? "linear-gradient(135deg,#0ea5e9,#6366f1)"
                  : "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "10px",
                padding: "0 14px",
                color: "#fff",
                cursor: input.trim() ? "pointer" : "not-allowed",
                fontSize: "16px",
                transition: "background 0.2s",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
