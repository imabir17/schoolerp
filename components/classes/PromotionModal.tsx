
import React, { useState } from 'react';
import { Student, ClassInfo } from '../../types';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPromote: (targetClassId: number, promotionData: { studentId: number; newRoll: number }[]) => void;
  studentsToPromote: Student[];
  allClasses: ClassInfo[];
  currentClassId: number;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ isOpen, onClose, onPromote, studentsToPromote, allClasses, currentClassId }) => {
  const [targetClassId, setTargetClassId] = useState<string>('');
  const [newRolls, setNewRolls] = useState<Record<number, string>>({});
  const [error, setError] = useState('');

  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTargetClassId('');
      setNewRolls({});
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRollChange = (studentId: number, roll: string) => {
    setNewRolls(prev => ({ ...prev, [studentId]: roll }));
  };

  const handleSubmit = () => {
    if (!targetClassId) {
      setError('Please select a target class.');
      return;
    }
    const missingRolls = studentsToPromote.some(s => !newRolls[s.id] || newRolls[s.id].trim() === '');
    if (missingRolls) {
      setError('Please enter a new roll number for every student.');
      return;
    }

    const promotionData = studentsToPromote.map(student => ({
      studentId: student.id,
      newRoll: parseInt(newRolls[student.id], 10),
    }));

    onPromote(parseInt(targetClassId, 10), promotionData);
    onClose();
  };

  const availableClasses = allClasses.filter(c => c.id !== currentClassId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
        <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Promote Students</h2>
            <div className="mb-4">
                <label htmlFor="targetClass" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Promote to Class</label>
                <select 
                    id="targetClass" 
                    value={targetClassId} 
                    onChange={(e) => setTargetClassId(e.target.value)}
                    className="w-full md:w-1/2 px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="" disabled>Select target class...</option>
                    {availableClasses.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                </select>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Enter new roll numbers for the selected students:</p>
            <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-3">
                {studentsToPromote.map(student => (
                    <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded dark:bg-gray-700">
                        <span className="text-gray-800 dark:text-gray-200">{student.name}</span>
                        <input 
                            type="number" 
                            placeholder="New Roll"
                            value={newRolls[student.id] || ''}
                            onChange={(e) => handleRollChange(student.id, e.target.value)}
                            className="w-24 px-2 py-1 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        />
                    </div>
                ))}
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <div className="flex justify-end mt-6 space-x-3 border-t dark:border-gray-600 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none">Cancel</button>
                <button type="button" onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none">Confirm Promotion</button>
            </div>
        </div>
    </div>
  );
};

export default PromotionModal;
