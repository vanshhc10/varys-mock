import {
  MessageCircle,
  Lock,
  Lightbulb,
  Clock,
  Settings,
  User,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  LucideIcon
} from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import VarysIcon from './VarysIcon'
import './Sidebar.css'

interface Project {
  id: string;
  title: string;
  color: string;
}

interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  active?: boolean
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  activeSection: string
  onSectionChange: (section: string) => void
  projects: Project[]
  onProjectSelect?: (projectId: string) => void
  onStartProjectChat?: (project: Project) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggle,
  activeSection,
  onSectionChange,
  projects,
  onProjectSelect,
  onStartProjectChat
}) => {
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = 'default';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const navItems: NavItem[] = [
    { id: 'chat', label: 'Chat', icon: MessageCircle, active: activeSection === 'chat' },
    { id: 'crypt', label: 'Crypt', icon: Lock, active: activeSection === 'crypt' },
    { id: 'projects', label: 'Projects', icon: Lightbulb, active: activeSection === 'projects' },
    { id: 'history', label: 'History', icon: Clock, active: activeSection === 'history' },
  ]
  const bottomNavItems: NavItem[] = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  const handleProjectClick = (projectId: string) => {
    onProjectSelect?.(projectId);
    onSectionChange('projects');
  };

  return (
    <div
      ref={sidebarRef}
      className={`sidebar ${collapsed ? 'collapsed' : ''}`}
      onClick={collapsed ? onToggle : undefined}
      style={!collapsed ? { width: sidebarWidth } : undefined}
    >
      <div className="resize-handle"
        onMouseDown={(e) => {
          e.preventDefault();
          setIsResizing(true);
          document.body.style.cursor = 'ew-resize';
        }}
      />
      <div className="sidebar-header">
        <div className="header-left">
          {!collapsed && (
            <div className="varys-logo">
              <VarysIcon size={28} />
            </div>
          )}
          <div className="sidebar-collapse" onClick={onToggle}>
            {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <div key={item.id}>
            <div
              className={`nav-item ${item.active ? 'active' : ''}`}
              onClick={() => {
                onSectionChange(item.id);
              }}
            >
              {item.id === 'projects' ? (
                <>
                  <div className="projects-icon">
                    <item.icon size={20} />
                  </div>
                  <ChevronDown
                    size={20}
                    className={`projects-arrow ${projectsExpanded ? 'expanded' : ''}`}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setProjectsExpanded(!projectsExpanded);
                    }}
                  />
                </>
              ) : (
                <item.icon size={20} />
              )}
              {!collapsed && (
                <span>
                  {item.label}
                </span>
              )}
            </div>
            {!collapsed && item.id === 'projects' && projectsExpanded && (
              <div className="projects-submenu">
                {projects.map(project => (
                  <div
                    key={project.id}
                    className="project-item"
                  >
                    <div
                      className="project-item-content"
                      onClick={() => {
                        onStartProjectChat?.(project);
                        onSectionChange('chat');
                      }}
                    >
                      <div
                        className="project-circle"
                        style={{ backgroundColor: project.color }}
                      />
                      <span>{project.title}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`project-toggle`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project.id);
                      }}
                    />
                  </div>
                ))}
                <div className="project-item see-all">
                  <span>See all</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>
      <nav className="sidebar-nav bottom">
        {bottomNavItems.map((item) => (
          <div key={item.id} className="nav-item">
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
