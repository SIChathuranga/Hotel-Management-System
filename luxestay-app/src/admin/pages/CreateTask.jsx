// Create Housekeeping Task Page

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiSave, FiX, FiClipboard } from 'react-icons/fi';
import { Button, Input, Card, Spinner } from '../../shared/components/ui';
import { createTask } from '../../firebase/services/housekeepingService';
import { getRooms } from '../../firebase/services/roomService';
import { getStaff } from '../../firebase/services/staffService';
import toast from 'react-hot-toast';
import './CreateTask.css';

const CreateTask = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            priority: 'Normal',
            type: 'Cleaning',
            status: 'Pending'
        }
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [roomsRes, staffRes] = await Promise.all([
                getRooms(),
                getStaff()
            ]);

            if (roomsRes.success) setRooms(roomsRes.data);
            if (staffRes.success) {
                // Filter only staff relevant to housekeeping/maintenance if needed
                // For now show all
                setStaffList(staffRes.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setInitialLoading(false);
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Enrich data with names
            const selectedRoom = rooms.find(r => r.id === data.roomId);
            const selectedStaff = staffList.find(s => s.id === data.assignedToId);

            const taskData = {
                ...data,
                roomNumber: selectedRoom ? selectedRoom.number : 'Unknown',
                assignedTo: selectedStaff ? selectedStaff.fullName : 'Unassigned',
                dueDate: new Date(data.dueDate).toISOString()
            };

            const res = await createTask(taskData);
            if (res.success) {
                toast.success('Task created successfully');
                navigate('/admin/housekeeping');
            } else {
                toast.error('Failed to create task');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div className="loading-container"><Spinner /></div>;

    return (
        <div className="create-task-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">New Task</h1>
                    <p className="page-subtitle">Assign cleaning or maintenance work</p>
                </div>
                <div className="header-actions">
                    <Button variant="secondary" icon={<FiX />} onClick={() => navigate('/admin/housekeeping')}>
                        Cancel
                    </Button>
                    <Button variant="primary" icon={<FiSave />} onClick={handleSubmit(onSubmit)} loading={loading}>
                        Create Task
                    </Button>
                </div>
            </div>

            <div className="form-container">
                <Card title="Task Details" icon={<FiClipboard />}>
                    <form onSubmit={handleSubmit(onSubmit)} className="task-form">
                        <div className="row-2-col">
                            <div className="input-group">
                                <label>Target Room</label>
                                <select className="select-input" {...register('roomId', { required: 'Room is required' })}>
                                    <option value="">Select Room</option>
                                    {rooms.map(r => (
                                        <option key={r.id} value={r.id}>Room {r.number} ({r.type})</option>
                                    ))}
                                </select>
                                {errors.roomId && <span className="error-text">{errors.roomId.message}</span>}
                            </div>
                            <div className="input-group">
                                <label>Task Type</label>
                                <select className="select-input" {...register('type')}>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Deep Clean">Deep Clean</option>
                                    <option value="Inspection">Inspection</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>

                        <div className="row-2-col">
                            <div className="input-group">
                                <label>Priority</label>
                                <select className="select-input" {...register('priority')}>
                                    <option value="Low">Low</option>
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Urgent">Urgent</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Due By</label>
                                <Input
                                    type="datetime-local"
                                    {...register('dueDate', { required: 'Due date is required' })}
                                />
                                {errors.dueDate && <span className="error-text">{errors.dueDate.message}</span>}
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Assign To (Staff)</label>
                            <select className="select-input" {...register('assignedToId')}>
                                <option value="">Unassigned</option>
                                {staffList.map(s => (
                                    <option key={s.id} value={s.id}>{s.fullName} ({s.role})</option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group">
                            <label>Notes / Instructions</label>
                            <textarea
                                className="textarea-input"
                                rows="3"
                                placeholder="Specific instructions..."
                                {...register('notes')}
                            />
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateTask;
