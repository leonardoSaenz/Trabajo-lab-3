import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

export function AIChatWidget({ isOpen, onToggle, onNewMessage }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asistente de ventas con IA. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://arbolto.app.n8n.cloud/webhook/01304292-f099-4232-b7d2-8147e9dff548',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed }),
        }
      );

      let botReply = 'Lo siento, no pude procesar tu solicitud.';

      if (response.ok) {
        const data = await response.json();
        // N8N webhooks can return data in various formats; try common patterns
        if (typeof data === 'string') {
          botReply = data;
        } else if (data.output) {
          botReply = data.output;
        } else if (data.message) {
          botReply = data.message;
        } else if (data.response) {
          botReply = data.response;
        } else if (data.text) {
          botReply = data.text;
        } else if (Array.isArray(data) && data.length > 0) {
          const first = data[0];
          botReply = first.output || first.message || first.response || first.text || JSON.stringify(first);
        } else {
          botReply = JSON.stringify(data);
        }
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: botReply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // Trigger notification if chat is closed
      if (!isOpen) {
        onNewMessage(true);
      }
    } catch (error) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '⚠️ Error de conexión. Por favor, inténtalo de nuevo más tarde.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('es', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="chat-fab"
        className={`chat-fab ${isOpen ? 'chat-fab--hidden' : ''}`}
        onClick={() => {
          onToggle(true);
          onNewMessage(false);
        }}
        aria-label="Abrir chat con IA"
      >
        <span className="chat-fab__pulse" />
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div className={`chat-window ${isOpen ? 'chat-window--open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header__info">
            <div className="chat-header__avatar">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="chat-header__title">AI Sales Assistant</h3>
              <span className="chat-header__status">
                <span className="chat-header__dot" />
                En línea
              </span>
            </div>
          </div>
          <button
            id="chat-close-btn"
            className="chat-close-btn"
            onClick={() => onToggle(false)}
            aria-label="Cerrar chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages" id="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${
                msg.role === 'user' ? 'chat-bubble--user' : 'chat-bubble--assistant'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="chat-bubble__avatar">
                  <Bot size={14} />
                </div>
              )}
              <div className="chat-bubble__content">
                <p>{msg.content}</p>
                <span className="chat-bubble__time">{formatTime(msg.timestamp)}</span>
              </div>
              {msg.role === 'user' && (
                <div className="chat-bubble__avatar chat-bubble__avatar--user">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="chat-bubble chat-bubble--assistant">
              <div className="chat-bubble__avatar">
                <Bot size={14} />
              </div>
              <div className="chat-bubble__content chat-bubble__typing">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <input
            ref={inputRef}
            id="chat-input"
            className="chat-input"
            type="text"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            id="chat-send-btn"
            className="chat-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            aria-label="Enviar mensaje"
          >
            {isLoading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </>
  );
}
