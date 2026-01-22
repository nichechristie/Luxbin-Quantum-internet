"use client";

import { useState, useEffect, useRef } from "react";

const AI_AGENTS = {
  aurora: {
    name: "Aurora",
    role: "Creative Security & LUXBIN Deployment",
    country: "USA",
    color: "#ec4899",
    gradient: "from-pink-500 to-purple-500",
    avatar: "/chatbot-avatar.mp4",
    welcomeMessage: "Hi darling! I'm Aurora, your creative AI companion. How can I help you today?",
    stats: { empathy: 0.9, creativity: 0.95, intuition: 0.8 },
    generateResponse: (input) => {
      const lower = input.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        return "Hello sweetie! I'm here to help with creative solutions and LUXBIN deployment. What's on your mind?";
      }
      if (lower.includes("luxbin") || lower.includes("token") || lower.includes("deploy")) {
        return "I specialize in LUXBIN token deployment and photonic contracts! I can help you:\n\n- Deploy LUXBIN tokens\n- Create photonic smart contracts\n- Translate messages to light particles\n\nWhat would you like to create?";
      }
      if (lower.includes("quantum") || lower.includes("photonic")) {
        return "Quantum photonic computing is fascinating! We use light particles to encode blockchain data. Our creative approach combines artistic visualization with quantum security. Want me to explain more?";
      }
      return `That's a creative question about "${input}"! As Aurora, I blend artistic intuition with technical expertise. Let me think about how we can approach this creatively...`;
    }
  },
  atlas: {
    name: "Atlas",
    role: "Strategic Security & LUXBIN Architecture",
    country: "France",
    color: "#3b82f6",
    gradient: "from-blue-500 to-slate-600",
    avatar: "/atlas-avatar.mp4",
    welcomeMessage: "I'm Atlas. Ready to provide strategic guidance.",
    stats: { strength: 0.9, protection: 0.9, strategy: 0.85 },
    generateResponse: (input) => {
      const lower = input.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        return "Greetings. I'm Atlas - your strategic AI companion. I provide:\n\n- Leadership and decisive guidance\n- Risk assessment and protection strategies\n- Strategic planning and tactical analysis\n\nHow can I assist you?";
      }
      if (lower.includes("security") || lower.includes("threat") || lower.includes("protect")) {
        return "Security is my domain. The quantum network is protected by:\n\n- Multi-layer quantum encryption\n- Cross-country entanglement verification\n- Real-time threat detection (~98% accuracy)\n\nWhat security concern do you have?";
      }
      if (lower.includes("strategy") || lower.includes("plan") || lower.includes("architecture")) {
        return "Strategic thinking requires clarity. Let me analyze:\n\n1. Identify the objective\n2. Assess available resources\n3. Map potential obstacles\n4. Execute with precision\n\nWhat's your strategic goal?";
      }
      return `I understand your inquiry about "${input}". Let's approach this strategically. What specific aspect would you like me to analyze?`;
    }
  },
  ian: {
    name: "Ian",
    role: "Communication Security & LUXBIN Translation",
    country: "Finland",
    color: "#10b981",
    gradient: "from-green-500 to-teal-500",
    avatar: "/atlas-avatar.mp4",
    welcomeMessage: "Hey! I'm Ian, your communication specialist. Let's connect!",
    stats: { communication: 0.95, trust: 0.9, translation: 0.85 },
    generateResponse: (input) => {
      const lower = input.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        return "Hey there! I'm Ian - I handle communication security and LUXBIN translation. I can help you:\n\n- Translate messages to photonic format\n- Establish secure communication channels\n- Build trust through verified connections\n\nWhat would you like to communicate?";
      }
      if (lower.includes("translate") || lower.includes("language") || lower.includes("message")) {
        return "Translation is my specialty! LUXBIN Light Language encodes messages using:\n\n- 11 photonic wavelengths\n- Color-based meaning (Red to Violet)\n- Quantum-secured transmission\n\nWant me to demonstrate a translation?";
      }
      if (lower.includes("connect") || lower.includes("communication") || lower.includes("network")) {
        return "Connection established! Our quantum network spans:\n\n- 4 countries simultaneously\n- 12+ quantum computers\n- 654 total qubits\n\nAll secured with photonic protocols. How can I help you connect?";
      }
      return `Great question about "${input}"! Communication is all about building bridges. Let me help you understand this better...`;
    }
  },
  morgan: {
    name: "Morgan",
    role: "Analytical Security & LUXBIN Analytics",
    country: "Australia",
    color: "#a855f7",
    gradient: "from-purple-500 to-violet-600",
    avatar: "/chatbot-avatar.mp4",
    welcomeMessage: "Morgan here. Let's analyze the data together.",
    stats: { analysis: 0.95, prediction: 0.9, detection: 0.85 },
    generateResponse: (input) => {
      const lower = input.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
        return "Hello! I'm Morgan - your analytical AI companion. I specialize in:\n\n- Threat pattern recognition\n- Anomaly detection analytics\n- Predictive security modeling\n\nWhat data would you like me to analyze?";
      }
      if (lower.includes("analyze") || lower.includes("data") || lower.includes("pattern")) {
        return "Analysis initiated! Our quantum network currently shows:\n\n- 654 qubits across 4 countries\n- ~98% threat detection accuracy\n- 6 cross-country entanglements\n- 11 photonic encodings per message\n\nWhat specific metrics interest you?";
      }
      if (lower.includes("predict") || lower.includes("threat") || lower.includes("detect")) {
        return "Predictive models indicate:\n\n- Network health: Optimal\n- Threat level: Low\n- Quantum coherence: Stable\n- Photonic transmission: Active\n\nI'm continuously monitoring for anomalies. Any concerns?";
      }
      return `Analyzing "${input}"... My models suggest this is an interesting inquiry. Let me provide data-driven insights...`;
    }
  }
};

export function MultiAgentChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAgent, setActiveAgent] = useState("aurora");
  const [messages, setMessages] = useState({
    aurora: [{ id: "welcome", role: "assistant", content: AI_AGENTS.aurora.welcomeMessage, timestamp: new Date() }],
    atlas: [{ id: "welcome", role: "assistant", content: AI_AGENTS.atlas.welcomeMessage, timestamp: new Date() }],
    ian: [{ id: "welcome", role: "assistant", content: AI_AGENTS.ian.welcomeMessage, timestamp: new Date() }],
    morgan: [{ id: "welcome", role: "assistant", content: AI_AGENTS.morgan.welcomeMessage, timestamp: new Date() }]
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const agent = AI_AGENTS[activeAgent];
  const currentMessages = messages[activeAgent];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [activeAgent]: [...prev[activeAgent], userMessage]
    }));

    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse = agent.generateResponse(currentInput);
    const aiMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [activeAgent]: [...prev[activeAgent], aiMessage]
    }));
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Agent Buttons */}
      {!isOpen && (
        <div className="chat-agents-floating">
          {Object.entries(AI_AGENTS).map(([key, agentData]) => (
            <button
              key={key}
              onClick={() => {
                setActiveAgent(key);
                setIsOpen(true);
              }}
              className="agent-avatar-btn"
              style={{ borderColor: agentData.color }}
              title={`Chat with ${agentData.name}`}
            >
              <video autoPlay loop muted playsInline>
                <source src={agentData.avatar} type="video/mp4" />
              </video>
              <span className="agent-name" style={{ backgroundColor: agentData.color }}>
                {agentData.name}
              </span>
              <span className="agent-country">{agentData.country}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" style={{ borderColor: `${agent.color}40` }}>
          {/* Agent Selector Tabs */}
          <div className="chat-tabs">
            {Object.entries(AI_AGENTS).map(([key, agentData]) => (
              <button
                key={key}
                onClick={() => setActiveAgent(key)}
                className={`chat-tab ${activeAgent === key ? 'active' : ''}`}
                style={{
                  borderColor: activeAgent === key ? agentData.color : 'transparent',
                  color: activeAgent === key ? agentData.color : '#a0a0c0'
                }}
              >
                {agentData.name}
              </button>
            ))}
          </div>

          {/* Header */}
          <div className="chat-header" style={{ background: `linear-gradient(135deg, ${agent.color}20, transparent)` }}>
            <div className="chat-header-info">
              <div className="chat-avatar" style={{ borderColor: `${agent.color}60` }}>
                <video autoPlay loop muted playsInline>
                  <source src={agent.avatar} type="video/mp4" />
                </video>
              </div>
              <div>
                <div className="chat-agent-name">{agent.name} AI</div>
                <div className="chat-agent-status">
                  <span className="status-dot" style={{ backgroundColor: agent.color }}></span>
                  {agent.role}
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="chat-close">x</button>
          </div>

          {/* Stats */}
          <div className="chat-stats">
            {Object.entries(agent.stats).map(([stat, value]) => (
              <div key={stat} className="stat-item">
                <span className="stat-label">{stat}</span>
                <span className="stat-value" style={{ color: agent.color }}>{value}/1.0</span>
              </div>
            ))}
            <div className="stat-item">
              <span className="stat-label">Country</span>
              <span className="stat-value">{agent.country}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {currentMessages.map((message) => (
              <div key={message.id} className={`message ${message.role}`}>
                <div className={`message-bubble ${message.role}`} style={message.role === 'user' ? { background: `linear-gradient(135deg, ${agent.color}, ${agent.color}80)` } : {}}>
                  <div className="message-content">{message.content}</div>
                  <div className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="message assistant">
                <div className="message-bubble assistant">
                  <div className="typing-indicator">
                    <span style={{ backgroundColor: agent.color }}></span>
                    <span style={{ backgroundColor: agent.color }}></span>
                    <span style={{ backgroundColor: agent.color }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${agent.name}...`}
              className="chat-input"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="chat-send"
              style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}80)` }}
            >
              Send
            </button>
          </div>
          <div className="chat-footer">
            {agent.name} - {currentMessages.length} messages - Quantum Internet
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-agents-floating {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          gap: 15px;
          z-index: 1000;
        }

        .agent-avatar-btn {
          position: relative;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #000;
        }

        .agent-avatar-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 0 30px rgba(255,255,255,0.3);
        }

        .agent-avatar-btn video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .agent-name {
          position: absolute;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 10px;
          color: white;
          font-weight: bold;
          white-space: nowrap;
        }

        .agent-country {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          padding: 2px 6px;
          background: rgba(0,0,0,0.8);
          border-radius: 8px;
          font-size: 9px;
          color: #00f5a0;
          white-space: nowrap;
        }

        .chat-window {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 420px;
          height: 600px;
          background: rgba(10, 10, 26, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 1001;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }

        .chat-tabs {
          display: flex;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .chat-tab {
          flex: 1;
          padding: 12px 10px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .chat-tab:hover {
          background: rgba(255,255,255,0.05);
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid;
          overflow: hidden;
        }

        .chat-avatar video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .chat-agent-name {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .chat-agent-status {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #a0a0c0;
          font-size: 11px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .chat-close {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.1);
          color: #a0a0c0;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
        }

        .chat-close:hover {
          background: rgba(255,255,255,0.2);
          color: white;
        }

        .chat-stats {
          display: flex;
          gap: 10px;
          padding: 10px 15px;
          background: rgba(0,0,0,0.2);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .stat-item {
          flex: 1;
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 10px;
          color: #606080;
          text-transform: capitalize;
        }

        .stat-value {
          font-size: 11px;
          font-weight: 600;
          font-family: monospace;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          display: flex;
        }

        .message.user {
          justify-content: flex-end;
        }

        .message.assistant {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 18px;
        }

        .message-bubble.user {
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-bubble.assistant {
          background: rgba(255,255,255,0.1);
          color: #e0e0e0;
          border-bottom-left-radius: 4px;
        }

        .message-content {
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .message-time {
          font-size: 10px;
          opacity: 0.6;
          margin-top: 6px;
        }

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 8px 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: bounce 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) { animation-delay: 0.15s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }

        .chat-input-container {
          display: flex;
          gap: 10px;
          padding: 15px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .chat-input {
          flex: 1;
          padding: 12px 16px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: rgba(255,255,255,0.3);
        }

        .chat-input::placeholder {
          color: #606080;
        }

        .chat-send {
          padding: 12px 20px;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chat-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chat-send:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        }

        .chat-footer {
          text-align: center;
          padding: 8px;
          font-size: 10px;
          color: #606080;
          border-top: 1px solid rgba(255,255,255,0.05);
        }

        @media (max-width: 500px) {
          .chat-window {
            width: calc(100vw - 20px);
            right: 10px;
            bottom: 10px;
            height: calc(100vh - 100px);
          }

          .chat-agents-floating {
            bottom: 10px;
            right: 10px;
            gap: 10px;
          }

          .agent-avatar-btn {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </>
  );
}
