'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    leads: 0,
    tasks: 0,
    invoices: 0,
    activeProjects: 0,
    completedTasks: 0
  });

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch statistics
      const statsRes = await fetch('http://localhost:3001/api/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch projects
      const projectsRes = await fetch('http://localhost:3001/api/projects');
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.data || []);
      }

      // Fetch tasks
      const tasksRes = await fetch('http://localhost:3001/api/tasks');
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Active Projects',
      value: stats.activeProjects || 0,
      total: stats.projects || 0,
      icon: '📊',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'New Leads',
      value: stats.leads || 0,
      total: null,
      icon: '👥',
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending Tasks',
      value: stats.tasks - stats.completedTasks,
      total: stats.tasks || 0,
      icon: '✅',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Open Invoices',
      value: stats.invoices || 0,
      total: null,
      icon: '💰',
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ];

  const getTaskStatus = (status) => {
    const statusConfig = {
      TODO: { color: 'bg-gray-100 text-gray-800', label: 'To Do' },
      IN_PROGRESS: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' }
    };
    return statusConfig[status] || statusConfig.TODO;
  };

  const getProjectStatus = (status) => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Active' },
      PLANNING: { color: 'bg-blue-100 text-blue-800', label: 'Planning' },
      COMPLETED: { color: 'bg-gray-100 text-gray-800', label: 'Completed' }
    };
    return statusConfig[status] || statusConfig.PLANNING;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">RB</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </Link>
            </div>
            <nav className="flex space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Projects</button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Leads</button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Tasks</button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Invoices</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-4">
                <div className={`${card.lightColor} p-3 rounded-lg`}>
                  <span className="text-2xl">{card.icon}</span>
                </div>
                {card.total !== null && (
                  <span className="text-sm text-gray-500">
                    of {card.total}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor}`}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            </div>
            <div className="p-6">
              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div>
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-600">{project.clientName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Event: {project.eventDate || 'TBD'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getProjectStatus(project.status).color}`}>
                          {getProjectStatus(project.status).label}
                        </span>
                        {project.budget && (
                          <span className="text-sm text-gray-600">
                            ${project.budget.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No projects yet</p>
                  <button 
                    onClick={() => alert('Create project functionality coming soon!')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create First Project
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
            </div>
            <div className="p-6">
              {tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div>
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Due: {task.dueDate || 'No due date'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getTaskStatus(task.status).color}`}>
                          {getTaskStatus(task.status).label}
                        </span>
                        {task.priority && (
                          <span className={`text-xs ${
                            task.priority === 'HIGH' ? 'text-red-600' :
                            task.priority === 'MEDIUM' ? 'text-yellow-600' :
                            'text-gray-600'
                          }`}>
                            {task.priority} Priority
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No tasks yet</p>
                  <button 
                    onClick={() => alert('Create task functionality coming soon!')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create First Task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition text-center">
              <span className="text-2xl mb-2 block">➕</span>
              <span className="text-sm text-gray-700">New Project</span>
            </button>
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-center">
              <span className="text-2xl mb-2 block">👤</span>
              <span className="text-sm text-gray-700">Add Lead</span>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-center">
              <span className="text-2xl mb-2 block">📝</span>
              <span className="text-sm text-gray-700">Create Task</span>
            </button>
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition text-center">
              <span className="text-2xl mb-2 block">📄</span>
              <span className="text-sm text-gray-700">New Invoice</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
