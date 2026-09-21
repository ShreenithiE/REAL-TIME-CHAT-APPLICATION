const { useState, useEffect, useRef } = React;

function ChatbotApp() {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: "💜 Welcome to **CodTech AI Support**! How can I assist you with your tasks, repository guidelines, or project deliverables today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const ws = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:8000/ws/bot");

    ws.current.onopen = () => setIsConnected(true);
    ws.current.onclose = () => setIsConnected(false);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      if (data.type === "typing") {
        setIsTyping(data.is_typing);
      } else if (data.text) {
        setMessages((prev) => [...prev, { ...data, time: timeString }]);
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    ws.current.send(JSON.stringify({ message: query.trim() }));
    setInput("");
  };

  const exportTranscript = () => {
    const transcriptText = messages
      .map((m) => `[${m.time}] ${m.sender.toUpperCase()}: ${m.text}`)
      .join("\n\n");
    const blob = new Blob([transcriptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `codtech-transcript-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: "Conversation refreshed. Ready for your next query!"
      }
    ]);
  };

  return (
    <div className="relative bg-[#170b28]/80 backdrop-blur-2xl border border-purple-500/25 rounded-[2rem] shadow-[0_24px_60px_rgba(0,0,0,0.8),0_0_80px_rgba(168,85,247,0.15)] flex flex-col h-[740px] overflow-hidden">
      
      {/* Monochromatic Purple Ambient Glows */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-600/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 px-6 py-4.5 bg-[#120722]/85 backdrop-blur-md border-b border-purple-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-800 via-purple-600 to-fuchsia-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-purple-600/35 ring-2 ring-purple-400/30">
              ⚡
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#120722] ${isConnected ? "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" : "bg-purple-900"}`}></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white font-bold text-base tracking-tight">CODTECH Assistant</h1>
              <span className="bg-purple-500/20 border border-purple-400/35 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Purple Edition
              </span>
            </div>
            <p className="text-xs text-purple-300/70 flex items-center gap-1.5 mt-0.5 font-medium">
              <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? "bg-purple-400 animate-pulse" : "bg-purple-900"}`}></span>
              <span>{isConnected ? "Active • Real-time Session" : "Gateway Offline"}</span>
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={exportTranscript}
            title="Download transcript"
            className="flex items-center gap-1.5 text-xs bg-purple-900/40 hover:bg-purple-800/50 text-purple-200 hover:text-white px-3 py-1.5 rounded-xl font-semibold transition-all duration-200 border border-purple-500/30 active:scale-95"
          >
            <svg className="w-3.5 h-3.5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export</span>
          </button>
          <button
            onClick={clearChat}
            title="Clear history"
            className="text-xs bg-purple-900/40 hover:bg-purple-700/40 text-purple-300/80 hover:text-purple-100 px-2.5 py-1.5 rounded-xl transition-all duration-200 border border-purple-500/30 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-gradient-to-b from-transparent via-[#10061e]/40 to-[#140824]/60">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} className={`msg-animate flex flex-col ${isUser ? "items-end" : "items-start"}`}>
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[11px] font-semibold text-purple-300/70">
                  {isUser ? "You" : "CODTECH Bot"}
                </span>
                <span className="text-[10px] text-purple-400/50">• {msg.time}</span>
              </div>

              <div
                className={`max-w-[85%] px-4.5 py-3 text-[0.91rem] leading-relaxed shadow-lg ${
                  isUser
                    ? "bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 text-white rounded-3xl rounded-tr-md shadow-purple-900/50 font-medium"
                    : "bg-[#23113d]/85 border border-purple-500/25 text-purple-100 rounded-3xl rounded-tl-md backdrop-blur-md chat-prose shadow-black/40"
                }`}
                dangerouslySetInnerHTML={{
                  __html: isUser ? msg.text : marked.parse(msg.text)
                }}
              />
            </div>
          );
        })}

        {/* Purple Typing Indicator */}
        {isTyping && (
          <div className="flex items-center space-x-2 bg-[#23113d]/70 border border-purple-500/25 w-fit px-4 py-2.5 rounded-2xl">
            <span className="text-xs text-purple-300/80 font-medium">Assistant typing</span>
            <div className="flex space-x-1.5">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-fuchsia-300 rounded-full animate-bounce [animation-delay:0.3s]"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="bg-[#120722]/80 border-t border-purple-500/20 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-purple-400 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap pl-1">
          Suggestions:
        </span>
        {[
          "Task submission guidelines",
          "Submission code format",
          "How to reset password?",
          "Internship certificate",
          "Contact mentor"
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(prompt)}
            className="bg-purple-950/40 hover:bg-purple-800/40 hover:border-purple-400/50 text-purple-200 hover:text-white border border-purple-500/30 rounded-full px-3.5 py-1 whitespace-nowrap transition-all duration-200 active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3.5 bg-[#120722]/90 backdrop-blur-md border-t border-purple-500/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your project or tasks..."
              className="w-full bg-[#0e051c] border border-purple-500/30 text-white placeholder-purple-400/40 rounded-2xl pl-4.5 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/35 transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={!isConnected || !input.trim()}
            className="bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 disabled:opacity-30 disabled:pointer-events-none text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 shadow-lg shadow-purple-900/40 active:scale-95 flex items-center gap-1.5"
          >
            <span>Send</span>
            <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<ChatbotApp />);