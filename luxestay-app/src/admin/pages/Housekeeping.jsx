// Housekeeping Tasks Page
// Manage cleaning assignments and tasks

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    FiPlus,
    FiCheckSquare,
    FiClock,
    FiUser,
    FiAlertCircle,
    FiFilter,
    FiMoreHorizontal,
    FiTrash2
} from 'react-icons/fi';
import { Button, Card, Spinner, Input } from '../../shared/components/ui';
import { getHousekeepingTasks, updateTaskStatus, deleteTask } from '../../firebase/services/housekeepingService';
import toast from 'react-hot-toast';
import './Housekeeping.css';

const Housekeeping = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const res = await getHousekeepingTasks();
            if (res.success) {
                setTasks(res.data);
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        const res = await updateTaskStatus(taskId, newStatus);
        if (res.success) {
            toast.success(`Task marked as ${newStatus}`);
            loadTasks();
        } else {
            toast.error('Failed to update task');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this task?')) {
            const res = await deleteTask(id);
            if (res.success) {
                toast.success('Task deleted');
                loadTasks();
            }
        }
    };

    const filteredTasks = tasks.filter(t =>
        filter === 'all' || t.status === filter
    );

    const getPriorityColor = (priority) => {
        return priority === 'High' ? 'text-red-500' : 'text-gray-500';
    };

    return (
        <div className="housekeeping-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Housekeeping Tasks</h1>
                    <p className="page-subtitle">Manage cleaning schedule</p>
                </div>
                <Link to="/admin/housekeeping/create">
                    <Button icon={<FiPlus />} variant="primary">
                        New Task
                    </Button>
                </Link>
            </div>

            <Card className="tasks-card">
                <div className="tasks-filter">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >All</button>
                    <button
                        className={`filter-tab ${filter === 'Pending' ? 'active' : ''}`}
                        onClick={() => setFilter('Pending')}
                    >Pending</button>
                    <button
                        className={`filter-tab ${filter === 'In Progress' ? 'active' : ''}`}
                        onClick={() => setFilter('In Progress')}
                    >In Progress</button>
                    <button
                        className={`filter-tab ${filter === 'Completed' ? 'active' : ''}`}
                        onClick={() => setFilter('Completed')}
                    >Completed</button>
                </div>

                {loading ? (
                    <div className="p-8 flex justify-center"><Spinner /></div>
                ) : (
                    <div className="table-responsive">
                        <table className="tasks-table">
                            <thead>
                                <tr>
                                    <th>Room</th>
                                    <th>Type</th>
                                    <th>Assigned To</th>
                                    <th>Priority</th>
                                    <th>Due</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.length > 0 ? filteredTasks.map(task => (
                                    <tr key={task.id}>
                                        <td className="font-bold">{task.roomNumber}</td>
                                        <td>{task.type}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                                    {task.assignedTo ? task.assignedTo.charAt(0) : '?'}
                                                </div>
                                                <span className="text-sm">{task.assignedTo || 'Unassigned'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`text-sm ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </td>
                                        <td className="text-sm text-gray-500">
                                            {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions-cell">
                                                {task.status !== 'Completed' && (
                                                    <button
                                                        className="icon-btn-sm success"
                                                        title="Mark Complete"
                                                        onClick={() => handleStatusUpdate(task.id, 'Completed')}
                                                    >
                                                        <FiCheckSquare />
                                                    </button>
                                                )}
                                                <button
                                                    className="icon-btn-sm delete"
                                                    onClick={() => handleDelete(task.id)}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-400">
                                            No tasks found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Housekeeping;
