import { useState, KeyboardEvent, ChangeEvent, useEffect, useRef } from 'react'
import { Paperclip, Plus, ArrowUp, Copy, Check, Pause } from 'lucide-react'
import VarysIcon from './VarysIcon'
import './ChatArea.css'

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isComplete?: boolean;
}

interface ChatAreaProps {
  sidebarCollapsed: boolean
}

const ChatArea: React.FC<ChatAreaProps> = ({
  sidebarCollapsed
}) => {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [welcomeMessage, setWelcomeMessage] = useState<string>('')
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const abortController = useRef<AbortController | null>(null)
  const chatContentRef = useRef<HTMLDivElement>(null)

  const handleCopyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hour = new Date().getHours()

      if (hour >= 5 && hour < 12) {
        return 'Good morning! How can I help you today?'
      } else if (hour >= 12 && hour < 17) {
        return 'Good afternoon! What would you like to know?'
      } else if (hour >= 17 && hour < 22) {
        return 'Good evening! How may I assist you?'
      } else {
        return 'Hello! What can I help you with today?'
      }
    }

    setWelcomeMessage(getTimeBasedGreeting())
  }, [])

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    const userMessage: Message = {
      role: 'user',
      content: message.trim(),
      isComplete: true
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);
    
    // Scroll to show the newest message
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }

    try {
      // Create new abort controller for this request
      abortController.current = new AbortController();

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
        signal: abortController.current.signal
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let assistantMessage: Message = {
        role: 'assistant',
        content: '',
        isComplete: false
      };
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          assistantMessage.isComplete = true;
          setMessages(prev => [
            ...prev.slice(0, -1),
            { ...assistantMessage }
          ]);
          break;
        }

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        assistantMessage.content += chunk;

        // Update the last message with the new content
        setMessages(prev => [
          ...prev.slice(0, -1),
          { ...assistantMessage }
        ]);
      }

    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.'
        }]);
      }
    } finally {
      abortController.current = null;
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMessage(e.target.value)
    // Auto-resize the textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const handleNewChat = (): void => {
    setMessages([]);
    setMessage('');
    if (abortController.current) {
      abortController.current.abort();
    }
  }

  const handleAttachFile = (): void => {
    // Handle file attachment
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '*/*' // Accept all file types
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const file = target.files[0]
        console.log('File attached:', file.name, file.size, file.type)
        // Add file handling logic here
      }
    }
    input.click()
  }

  return (
    <div className={`chat-area ${sidebarCollapsed ? 'expanded' : ''}`}>
      <div className="chat-header-minimal">
        <div className="header-content">
          <h1 className="chat-title">Varys</h1>
          <button className="new-chat-btn" onClick={handleNewChat} title="New Chat">
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="chat-content" ref={chatContentRef}>
        {messages.length === 0 ? (
          <div className="welcome-message">
            <div className="message-logo">
              <VarysIcon size={32} />
            </div>
            <span className="message-text">{welcomeMessage}</span>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              {msg.role === 'assistant' ? (
                <>
                  <div className="message-container">
                    <div className="message-logo">
                      <VarysIcon size={24} />
                    </div>
                    <div>
                      {!msg.content && !msg.isComplete ? (
                        <div className="typing-indicator">●●●</div>
                      ) : (
                        <>
                          <div className="message-content">{msg.content}</div>
                          {msg.isComplete && (
                            <div className="message-footer">
                              <button
                                className="copy-button"
                                onClick={() => handleCopyToClipboard(msg.content, index)}
                                title="Copy to clipboard"
                              >
                                {copiedIndex === index ? (
                                  <>
                                    <Check size={16} />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <Copy size={16} />
                                    Copy
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="message-content">{msg.content}</div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            placeholder="Ask anything"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            rows={1}
          />
          <div className="input-actions">
            <div className="action-buttons">
              <button className="attach-btn" title="Attach file" onClick={handleAttachFile}>
                <Paperclip size={16} />
              </button>
              <button className="vault-btn" title="Vault">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </button>
            </div>
            {isProcessing ? (
              <button
                className="send-btn abort"
                onClick={() => {
                  if (abortController.current) {
                    abortController.current.abort();
                    setIsProcessing(false);
                  }
                }}
                title="Stop generating"
              >
                <Pause size={16} />
              </button>
            ) : (
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!message.trim()}
                title="Send message"
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatArea