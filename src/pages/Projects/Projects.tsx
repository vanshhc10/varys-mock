import React from 'react';
import { ProjectCard } from '../../components/ProjectCard/ProjectCard';
import styles from './Projects.module.css';

interface Project {
  id: string;
  title: string;
  color: string;
}

interface ProjectsProps {
  projects: Project[];
  selectedProject: Project | null;
  onProjectSelect: (id: string) => void;
  onProjectRemove: (id: string) => void;
  onProjectUpdate: (project: Project) => void;
  onStartChat: (project: Project) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  selectedProject,
  onProjectSelect,
  onProjectRemove,
  onProjectUpdate,
  onStartChat,
}) => {

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Projects</h1>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search Ctrl+K"
              />
            </div>
            <button className={styles.createButton}>+ Create project</button>
          </div>
        </div>
        <div className={styles.grid}>
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              title={project.title}
              color={project.color}
              onRemove={() => onProjectRemove(project.id)}
              onClick={() => {
                onProjectSelect(project.id);
                onStartChat(project);
              }}
              onStartChat={() => onStartChat(project)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
