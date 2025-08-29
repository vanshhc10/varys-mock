import { useState, KeyboardEvent, ChangeEvent } from 'react'
import { ArrowUp, Paperclip, MoreVertical, Star, Pencil, Trash2 } from 'lucide-react'
import './ChatArea.css'
import './ProjectChat.css'

interface Project {
  id: string
  title: string
  color: string
}

interface ProjectChatProps {
  project: Project
  onClose?: () => void
  onDelete?: (id: string) => void
  onEdit?: (project: Project) => void
}

const ProjectChat: React.FC<ProjectChatProps> = ({
  project,
  onClose,
  onDelete,
  onEdit
}) => {
  const [message, setMessage] = useState<string>('')
  const [showOptions, setShowOptions] = useState(false)
  const [isStarred, setIsStarred] = useState(false)

  const handleSendMessage = (): void => {
    if (message.trim()) {
      // Handle sending message here with project context
      console.log('Sending message for project:', project.id, message)
      setMessage('')
    }
  }

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

  const handleAttachFile = (): void => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '*/*'
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const file = target.files[0]
        console.log('File attached for project:', project.id, file.name, file.size, file.type)
      }
    }
    input.click()
  }

  return (
    <div className="project-chat">
      <div className="chat-header-minimal">
        <div className="header-container">
          <button className="back-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All projects
          </button>
          <div className="project-header">
            <div className="project-info" style={{ borderLeftColor: project.color }}>
              <div className="info-container">
                <h1 className="chat-title">{project.title}</h1>
                <span className="project-type">Code</span>
              </div>
              <div className="title-actions">
                <button
                  className={`action-btn star-btn ${isStarred ? 'starred' : ''}`}
                  onClick={() => setIsStarred(!isStarred)}
                  title={isStarred ? "Unstar project" : "Star project"}
                >
                  <Star size={20} />
                </button>
                <div className="options-container">
                  <button
                    className="action-btn"
                    onClick={() => setShowOptions(!showOptions)}
                    title="More options"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showOptions && (
                    <div className="options-menu">
                      <button onClick={() => {
                        onEdit?.(project);
                        setShowOptions(false);
                      }}>
                        <Pencil size={16} />
                        Edit details
                      </button>
                      <button
                        className="delete-option"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this project?')) {
                            onDelete?.(project.id);
                          }
                          setShowOptions(false);
                        }}
                      >
                        <Trash2 size={16} />
                        Delete project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="chat-content">
        <div className="welcome-message">
          <div className="message-logo">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <span className="message-text">Start a chat to keep conversations organized and re-use project knowledge.</span>
        </div>
      </div>

      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <textarea
            className="chat-input"
            placeholder={`Ask anything about ${project.title}`}
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
            <button
              className="send-btn"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              title="Send message"
              style={{ backgroundColor: message.trim() ? project.color : undefined }}
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectChat
