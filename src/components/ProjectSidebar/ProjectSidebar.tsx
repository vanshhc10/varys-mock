import React, { useState, useEffect, useRef } from 'react';
import { FileText, ChevronLeft, MessageSquare, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import './ProjectSidebar.css';

interface ProjectSidebarProps {
  projectTitle: string;
  projectColor: string;
  onClose: () => void;
  onColorChange: (color: string) => void;
  onRename: (newName: string) => void;
  onRemove: () => void;
}

const colorOptions = [
  // Vibrant colors
  '#FF5555', '#50FA7B', '#BD93F9', '#FFB86C', '#8BE9FD',
  '#FF79C6', '#F1FA8C', '#6272A4', '#FF3366', '#00CC99',
  // Pastel colors
  '#FFB3B3', '#B3FFB3', '#B3B3FF', '#FFE6B3', '#B3E6FF',
  '#FFB3E6', '#E6FFB3', '#B3B3CC', '#FFB366', '#66FFB3',
  // Modern colors
  '#3498DB', '#2ECC71', '#E74C3C', '#F1C40F', '#9B59B6',
  '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#C0392B',
  // Subtle colors
  '#A8D8EA', '#AA96DA', '#FCBAD3', '#FFFFD2', '#95E1D3',
  '#D4A5A5', '#9DC8C8', '#58B19F', '#9AECDB', '#FD7272'
];

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  projectTitle,
  projectColor,
  onClose,
  onColorChange,
  onRename,
  onRemove
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'chats'>('files');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const colorPickerRef = useRef<HTMLDivElement>(null);
  const colorButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        colorPickerRef.current &&
        colorButtonRef.current &&
        !colorPickerRef.current.contains(event.target as Node) &&
        !colorButtonRef.current.contains(event.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="project-sidebar">
      <div className="project-sidebar-header">
        <div className="header-left">
          <div className="project-color-container">
            <div
              ref={colorButtonRef}
              className="project-color"
              style={{ backgroundColor: projectColor }}
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
              }}
            />
            {showColorPicker && (
              <div ref={colorPickerRef} className="color-picker">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    className="color-option"
                    style={{ backgroundColor: color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onColorChange(color);
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <h2>{projectTitle}</h2>
        </div>
        <div className="header-actions">
          <button className="action-button" onClick={onClose}>
            <ChevronLeft size={20} />
          </button>
          <div className="options-container">
            <button
              className="action-button"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical size={20} />
            </button>
            {showOptions && (
              <div className="options-menu">
                <button onClick={() => {
                  const newName = window.prompt('Enter new name:', projectTitle);
                  if (newName) {
                    onRename(newName);
                  }
                  setShowOptions(false);
                }}>
                  <Edit2 size={16} />
                  <span>Rename</span>
                </button>
                <button onClick={() => {
                  if (window.confirm('Are you sure you want to remove this project?')) {
                    onRemove();
                  }
                  setShowOptions(false);
                }}>
                  <Trash2 size={16} />
                  <span>Remove</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>      <div className="sidebar-content">
        <div className="instructions-card">
          <FileText size={20} />
          <span>Instructions</span>
        </div>

        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'files' ? 'active' : ''}`}
              onClick={() => setActiveTab('files')}
            >
              Files
            </button>
            <button
              className={`tab ${activeTab === 'chats' ? 'active' : ''}`}
              onClick={() => setActiveTab('chats')}
            >
              Chats
            </button>
          </div>

          {activeTab === 'files' ? (
            <div className="section-content">
              <div className="nav-item">
                <FileText size={18} />
                <span>Set up instructions for Grok i...</span>
              </div>
            </div>
          ) : (
            <div className="section-content">
              <div className="empty-state">
                <MessageSquare size={20} />
                <span>No conversations yet</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
