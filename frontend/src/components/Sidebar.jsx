import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    ClipboardList,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import './Sidebar.css';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/students', icon: Users, label: 'Students' },
        { path: '/courses', icon: BookOpen, label: 'Courses' },
        { path: '/enrollments', icon: ClipboardList, label: 'Enrollments' },
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img
                        src="/educonnect-logo.png"
                        alt="EduConnect Logo"
                        className="logo-image"
                    />
                    {!isCollapsed && <span className="logo-text">EduConnect</span>}
                </div>
                <button
                    className="sidebar-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            title={isCollapsed ? item.label : ''}
                        >
                            <Icon size={20} className="nav-icon" />
                            {!isCollapsed && <span className="nav-label">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <ThemeToggle collapsed={isCollapsed} />
            </div>
        </aside>
    );
};

export default Sidebar;
