import React, { useState } from 'react';
import { MoreVertical, MessageCircle } from 'lucide-react';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  title: string;
  color: string;
  onRemove: () => void;
  onClick: () => void;
  onStartChat: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ title, color, onRemove, onClick, onStartChat }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to remove this project?')) {
      onRemove();
    }
    setShowOptions(false);
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.cardContent}>
        <div
          className={styles.circle}
          style={{ backgroundColor: color }}
        />
        <h3>{title}</h3>
      </div>
      <div className={styles.options}>
        <button
          className={styles.optionsButton}
          onClick={handleOptionsClick}
        >
          <MoreVertical size={20} />
        </button>
        {showOptions && (
          <div className={styles.optionsMenu}>
            <button onClick={(e) => {
              e.stopPropagation();
              onStartChat();
              setShowOptions(false);
            }}>
              <MessageCircle size={16} style={{ marginRight: '8px' }} />
              Start Chat
            </button>
            <button onClick={handleRemoveClick}>
              Remove Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
