import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { appState } from '../../data/appState';
import { AcademicSession } from '../../types';
import ConfirmationModal from '../ui/ConfirmationModal';
import { toastService } from '../../utils/toastService';

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
);

interface AcademicSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AcademicSessionModal: React.FC<AcademicSessionModalProps> = ({ isOpen, onClose }) => {
    const [sessions, setSessions] = useState<AcademicSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingSession, setEditingSession] = useState<AcademicSession | null>(null);
    const [sessionToDelete, setSessionToDelete] = useState<AcademicSession | null>(null);
    const [formState, setFormState] = useState({ name: '', startDate: '', endDate: '' });

    const fetchSessions = async () => {
        setIsLoading(true);
        const data = await api.getData('academicSessions');
        setSessions(data);
        appState.academicSessions = data; // Keep in-memory appState in sync
        setIsLoading(false);
    };

    useEffect(() => {
        if(isOpen) {
            fetchSessions();
        }
    }, [isOpen]);

    useEffect(() => {
        if (editingSession) {
            setFormState({
                name: editingSession.name,
                startDate: editingSession.startDate,
                endDate: editingSession.endDate,
            });
        } else {
            setFormState({ name: '', startDate: '', endDate: '' });
        }
    }, [editingSession]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        let updatedSessions;
        if (editingSession) {
            updatedSessions = sessions.map(s => s.id === editingSession.id ? { ...s, ...formState } : s);
            toastService.show('Session updated successfully!');
        } else {
            const newSession: AcademicSession = {
                id: Math.max(0, ...sessions.map(s => s.id)) + 1,
                ...formState,
                isActive: sessions.length === 0,
            };
            updatedSessions = [newSession, ...sessions];
            toastService.show('New session created successfully!');
        }
        await api.setData('academicSessions', updatedSessions);
        await fetchSessions();
        setEditingSession(null);
    };

    const handleSetActive = async (sessionId: number) => {
        const updatedSessions = sessions.map(s => ({ ...s, isActive: s.id === sessionId }));
        await api.setData('academicSessions', updatedSessions);
        await fetchSessions();
        toastService.show(`Session "${updatedSessions.find(s=>s.isActive)?.name}" is now active.`);
    };

    const handleDelete = async () => {
        if (!sessionToDelete) return;
        const updatedSessions = sessions.filter(s => s.id !== sessionToDelete.id);
        await api.setData('academicSessions', updatedSessions);
        await fetchSessions();
        setSessionToDelete(null);
        toastService.show('Session deleted successfully!');
    };

    const handleCancelEdit = () => {
        setEditingSession(null);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
                <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Academic Sessions</h2>
                    
                    <div className="max-h-60 overflow-y-auto pr-2 space-y-2 mb-6">
                        {isLoading ? <p>Loading...</p> : sessions.map(session => (
                            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{session.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">({session.startDate} to {session.endDate})</span>
                                    {session.isActive && <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900 px-2 py-0.5 rounded-full">Active</span>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {!session.isActive && <button onClick={() => handleSetActive(session.id)} className="text-xs font-semibold text-primary-600 hover:underline">Set Active</button>}
                                    <button onClick={() => setEditingSession(session)} className="p-1 text-gray-500 hover:text-primary-600"><EditIcon className="w-4 h-4" /></button>
                                    <button onClick={() => setSessionToDelete(session)} className="p-1 text-gray-500 hover:text-red-600"><TrashIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSave} className="p-4 border-t dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{editingSession ? 'Edit Session' : 'Add New Session'}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <input name="name" value={formState.name} onChange={handleFormChange} placeholder="Session Name (e.g., 2024-2025)" required className="input-field" />
                            <input name="startDate" type="date" value={formState.startDate} onChange={handleFormChange} required className="input-field" />
                            <input name="endDate" type="date" value={formState.endDate} onChange={handleFormChange} required className="input-field" />
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            {editingSession && <button type="button" onClick={handleCancelEdit} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Cancel</button>}
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">{editingSession ? 'Update' : 'Save'}</button>
                        </div>
                    </form>

                    <div className="flex justify-end mt-4 border-t dark:border-gray-700 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500">Close</button>
                    </div>
                </div>
            </div>
            {sessionToDelete && (
                <ConfirmationModal
                    isOpen={!!sessionToDelete}
                    onClose={() => setSessionToDelete(null)}
                    onConfirm={handleDelete}
                    title="Delete Session"
                    message={`Are you sure you want to delete the session "${sessionToDelete.name}"?`}
                />
            )}
        </>
    );
};

export default AcademicSessionModal;
