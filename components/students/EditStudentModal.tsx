import React, { useState, useEffect } from 'react';
import { Student } from '../../types';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (student: Student) => void;
  student: Student | null;
}

const InputField: React.FC<{ id: string; name?: string; label: string; type?: string; value: string | number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; placeholder?: string; }> = 
({ id, name, label, type = "text", value, onChange, required = true, placeholder = '' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <input type={type} id={id} name={name || id} value={value} onChange={onChange} required={required} className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder={placeholder}/>
    </div>
);


const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, onUpdate, student }) => {
    const [formData, setFormData] = useState<Partial<Student>>({});
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (student) {
            setFormData(student);
            setPhotoPreview(student.avatarUrl);
        }
    }, [student]);


    if (!isOpen || !student) return null;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({...prev, avatarUrl: reader.result as string}));
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate({
            ...student,
            ...formData,
            classRoll: Number(formData.classRoll),
            monthlyScholarship: Number(formData.monthlyScholarship) || 0,
        } as Student);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Student Details</h2>
                <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id="name" label="Full Name" value={formData.name || ''} onChange={handleChange} />
                        <InputField id="birthCertificateNo" label="Birth Certificate No." value={formData.birthCertificateNo || ''} onChange={handleChange} />
                        
                        <div className="md:col-span-2 border-t pt-4 mt-2 dark:border-gray-600">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Contact Information</h3>
                        </div>

                        <InputField id="parentName" label="Parent's Name" value={formData.parentName || ''} onChange={handleChange} />
                        <InputField id="parentPhone" label="Parent's Phone" type="tel" value={formData.parentPhone || ''} onChange={handleChange} />
                        <InputField id="guardianName" label="Guardian's Name" value={formData.guardianName || ''} onChange={handleChange} />
                        <InputField id="guardianPhone" label="Guardian's Phone" type="tel" value={formData.guardianPhone || ''} onChange={handleChange} />
                        
                        <div className="md:col-span-2 border-t pt-4 mt-2 dark:border-gray-600">
                             <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Academic Details</h3>
                        </div>

                        <div>
                            <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assign to Class</label>
                            <select id="class" name="class" value={formData.class || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                {Array.from({length: 12}, (_, i) => i + 1).map(c => <option key={c} value={c}>{`Class ${c}`}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="section" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Section</label>
                            <select id="section" name="section" value={formData.section || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                {['A', 'B', 'C', 'D'].map(s => <option key={s} value={s}>{`Section ${s}`}</option>)}
                            </select>
                        </div>
                        <InputField id="classRoll" label="Class Roll No." type="number" value={formData.classRoll || ''} onChange={handleChange} />
                        <InputField id="monthlyScholarship" name="monthlyScholarship" label="Monthly Scholarship ($)" type="number" value={formData.monthlyScholarship || ''} onChange={handleChange} required={false} placeholder="e.g., 50"/>


                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Student Photo</label>
                             <div className="mt-1 flex items-center space-x-4">
                                <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    {photoPreview ? 
                                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" /> :
                                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 20.993V24H0v-2.997A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    }
                                </span>
                                <label htmlFor="photo-upload-edit" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <span>Change</span>
                                    <input id="photo-upload-edit" name="photo-upload" type="file" className="sr-only" onChange={handlePhotoChange} accept="image/*"/>
                                </label>
                             </div>
                        </div>

                    </div>
                    <div className="flex justify-end mt-8 space-x-3 border-t dark:border-gray-600 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 focus:outline-none">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;