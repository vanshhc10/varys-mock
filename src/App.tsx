import { useState } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import Crypt from './components/Crypt'
import { Projects } from './pages/Projects/Projects'
import { ProjectSidebar } from './components/ProjectSidebar/ProjectSidebar'
import ProjectChat from './components/ProjectChat'
import './App.css'

interface Project {
  id: string;
  title: string;
  color: string;
}

function App(): JSX.Element {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false)
  const [activeSection, setActiveSection] = useState<string>('chat')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: 'New Project', color: '#FF5555' },
    { id: '2', title: 'New Project', color: '#50FA7B' },
    { id: '3', title: 'New Project (clone)', color: '#BD93F9' },
    { id: '4', title: 'New Project', color: '#FFB86C' },
    { id: '5', title: 'New Project', color: '#8BE9FD' },
  ]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'crypt':
        return <Crypt />
      case 'projects':
        return (
          <Projects
            projects={projects}
            selectedProject={selectedProject}
            onProjectSelect={handleProjectSelect}
            onProjectRemove={handleRemoveProject}
            onStartChat={(project) => {
              setActiveProject(project);
              setActiveSection('chat');
            }}
            onProjectUpdate={(updatedProject) => {
              setProjects(projects.map(p =>
                p.id === updatedProject.id ? updatedProject : p
              ));
              if (selectedProject?.id === updatedProject.id) {
                setSelectedProject(updatedProject);
              }
            }}
          />
        )
      case 'chat':
      default:
        return activeProject ? (
          <ProjectChat
            project={activeProject}
            sidebarCollapsed={sidebarCollapsed}
            onClose={() => setActiveProject(null)}
          />
        ) : (
          <ChatArea sidebarCollapsed={sidebarCollapsed} />
        )
    }
  }

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  const handleProjectSelect = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setSelectedProject(project);
    }
  };

  return (
    <div className="app">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          // Close project sidebar when navigating away from projects section
          if (section !== 'projects') {
            setSelectedProject(null);
          }
        }}
        projects={projects}
        onProjectSelect={handleProjectSelect}
        onStartProjectChat={(project) => {
          setActiveProject(project);
          setActiveSection('chat');
        }}
      />
      {selectedProject && (
        <ProjectSidebar
          projectTitle={selectedProject.title}
          projectColor={selectedProject.color}
          onClose={() => setSelectedProject(null)}
          onColorChange={(color) => {
            setProjects(projects.map(p =>
              p.id === selectedProject.id ? { ...p, color } : p
            ));
            setSelectedProject({ ...selectedProject, color });
          }}
          onRename={(newName) => {
            setProjects(projects.map(p =>
              p.id === selectedProject.id ? { ...p, title: newName } : p
            ));
            setSelectedProject({ ...selectedProject, title: newName });
          }}
          onRemove={() => {
            handleRemoveProject(selectedProject.id);
            setSelectedProject(null);
          }}
        />
      )}
      <div className="main-content">
        {renderActiveSection()}
      </div>
    </div>
  )
}

export default App
