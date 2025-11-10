import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';
import api from '../../services/api';
import { Student, Fee, FeeStatus, FeeStructure } from '../../types';
import { toastService } from '../../utils/toastService';

const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);

const CollectFeePage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [fees, setFees] = useState<Fee[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedFeeIds, setSelectedFeeIds] = useState<Set<number>>(new Set());
  
  const [paymentData, setPaymentData] = useState({
    amount: '',
    method: 'Cash' as 'Cash' | 'Bank' | 'Card',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const fetchData = async () => {
    setIsLoading(true);
    const [studentsData, feesData, feeStructuresData] = await Promise.all([
        api.getData('students'),
        api.getData('fees'),
        api.getData('feeStructures')
    ]);
    setStudents(studentsData);
    setFees(feesData);
    setFeeStructures(feeStructuresData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim() || selectedStudent) return [];
    return students.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5);
  }, [searchTerm, students, selectedStudent]);

  const dueFees = useMemo(() => {
    if (!selectedStudent) return [];
    return fees.filter(f =>
      f.studentId === selectedStudent.id &&
      (f.status === FeeStatus.Unpaid || f.status === FeeStatus.Due)
    );
  }, [selectedStudent, fees]);
  
  const selectedFees = useMemo(() => {
    return dueFees.filter(fee => selectedFeeIds.has(fee.id));
  }, [dueFees, selectedFeeIds]);

  const totalDue = useMemo(() => {
    if (selectedFeeIds.size > 0) {
      return selectedFees.reduce((sum, fee) => sum + fee.amount, 0);
    }
    return dueFees.reduce((sum, fee) => sum + fee.amount, 0);
  }, [dueFees, selectedFees, selectedFeeIds]);

  const handleSelectStudent = async (student: Student) => {
    setSelectedStudent(student);
    setSearchTerm(student.name);
    setSelectedFeeIds(new Set());
    
    // Auto-generate fees for the current month if they don't exist
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const studentFeesForMonth = fees.filter(f => f.studentId === student.id && f.month === currentMonth);
    
    const newFeesToGenerate: Fee[] = [];
    let nextFeeId = Math.max(0, ...fees.map(f => f.id)) + 1;

    feeStructures.forEach(structure => {
        const feeExists = studentFeesForMonth.some(f => f.type === structure.name);
        if (!feeExists) {
            newFeesToGenerate.push({
                id: nextFeeId++,
                studentId: student.id,
                studentName: student.name,
                amount: structure.amount,
                month: currentMonth,
                status: FeeStatus.Unpaid,
                dueDate: new Date(new Date().getFullYear(), new Date().getMonth(), 10).toISOString().split('T')[0],
                type: structure.name,
            });
        }
    });

    if (newFeesToGenerate.length > 0) {
        const updatedFees = [...fees, ...newFeesToGenerate];
        await api.setData('fees', updatedFees);
        setFees(updatedFees);
    }
  };

  const handlePaymentDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({ ...prev, [name]: value }));
  };

  const processPayment = async () => {
    if (!selectedStudent || !paymentData.amount) return;

    let remainingToPay = parseFloat(paymentData.amount);
    const feesToProcess = selectedFeeIds.size > 0 ? selectedFees : dueFees;

    const updatedFees = fees.map(fee => {
      const isFeeToBeProcessed = feesToProcess.some(dueFee => dueFee.id === fee.id);
      if (isFeeToBeProcessed && remainingToPay > 0) {
        if (remainingToPay >= fee.amount) {
          remainingToPay -= fee.amount;
          return {
              ...fee,
              status: FeeStatus.Paid,
              paidDate: paymentData.date,
              paymentMethod: paymentData.method,
              notes: paymentData.notes,
          };
        }
      }
      return fee;
    });

    await api.setData('fees', updatedFees);
    setFees(updatedFees);
    toastService.show(`Payment of $${paymentData.amount} for ${selectedStudent.name} recorded!`);
    setSelectedStudent(null);
    setSearchTerm('');
    setPaymentData({ amount: '', method: 'Cash', date: new Date().toISOString().split('T')[0], notes: '' });
    setSelectedFeeIds(new Set());
  };
  
  const handleSelectFee = (feeId: number) => {
    setSelectedFeeIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(feeId)) {
            newSet.delete(feeId);
        } else {
            newSet.add(feeId);
        }
        return newSet;
    });
  };

  const numericCollectedAmount = parseFloat(paymentData.amount) || 0;
  const remainingDue = totalDue - numericCollectedAmount;

  return (
    <div>
        <Link to="/fees" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Fee Management
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Collect Student Fees</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Card>
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Find Student</h2>
                    <div className="relative">
                        <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by Name or ID..."
                        className="w-full px-3 py-2 text-gray-900 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                        {searchResults.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
                            {searchResults.map(student => (
                            <li key={student.id} onClick={() => handleSelectStudent(student)} className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-600 last:border-b-0">
                                <p className="font-medium">{student.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{student.studentId}</p>
                            </li>
                            ))}
                        </ul>
                        )}
                    </div>
                </Card>
            </div>

            <div className="lg:col-span-2">
                <Card>
                    {!selectedStudent ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 dark:text-gray-400">{isLoading ? 'Loading data...' : 'Search for a student to begin collecting fees.'}</p>
                        </div>
                    ) : (
                        <div>
                             <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{selectedStudent.name}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{selectedStudent.studentId} | Class {selectedStudent.class}-{selectedStudent.section}</p>
                                </div>
                                <button onClick={() => { setSelectedStudent(null); setSearchTerm(''); }} className="text-sm text-primary-600 hover:underline">Clear</button>
                            </div>
                            
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Outstanding Dues</h3>
                                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {dueFees.length > 0 ? dueFees.map(fee => (
                                        <div key={fee.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`fee-${fee.id}`}
                                                    checked={selectedFeeIds.has(fee.id)}
                                                    onChange={() => handleSelectFee(fee.id)}
                                                    className="w-4 h-4 mr-3 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                                                />
                                                <label htmlFor={`fee-${fee.id}`}>{fee.type} - {fee.month}</label>
                                            </div>
                                            <span className="font-medium">${fee.amount.toFixed(2)}</span>
                                        </div>
                                    )) : <p className="text-sm text-gray-500 dark:text-gray-400">No outstanding dues.</p>}
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t dark:border-gray-600">
                                    <span>{selectedFeeIds.size > 0 ? 'Selected Due:' : 'Total Due:'}</span>
                                    <span>${totalDue.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t dark:border-gray-600">
                               <div>
                                    <label htmlFor="amount" className="block text-sm font-medium">Amount Received</label>
                                    <input type="number" name="amount" value={paymentData.amount} onChange={handlePaymentDataChange} className="w-full mt-1 input-field" placeholder="0.00"/>
                               </div>
                               <div>
                                    <label htmlFor="method" className="block text-sm font-medium">Payment Method</label>
                                    <select name="method" value={paymentData.method} onChange={handlePaymentDataChange} className="w-full mt-1 input-field">
                                        <option>Cash</option>
                                        <option>Bank</option>
                                        <option>Card</option>
                                    </select>
                               </div>
                               <div>
                                    <label htmlFor="date" className="block text-sm font-medium">Payment Date</label>
                                    <input type="date" name="date" value={paymentData.date} onChange={handlePaymentDataChange} className="w-full mt-1 input-field"/>
                               </div>
                               <div>
                                    <label htmlFor="notes" className="block text-sm font-medium">Notes (Optional)</label>
                                    <input name="notes" value={paymentData.notes} onChange={handlePaymentDataChange} className="w-full mt-1 input-field" placeholder="e.g., Late fee waived"/>
                               </div>
                            </div>
                            
                             <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg space-y-2 text-sm">
                                {remainingDue >= 0 ? (
                                   <div className="flex justify-between font-medium text-red-600 dark:text-red-400">
                                        <span>Remaining Due:</span>
                                        <span>${remainingDue.toFixed(2)}</span>
                                   </div>
                                ) : (
                                    <>
                                    <div className="flex justify-between font-medium text-green-600 dark:text-green-400">
                                        <span>Advance Payment:</span>
                                        <span>${Math.abs(remainingDue).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                        <span>Remaining Due:</span>
                                        <span>$0.00</span>
                                   </div>
                                   </>
                                )}
                            </div>

                             <div className="mt-6 text-right">
                                <button onClick={processPayment} disabled={numericCollectedAmount <= 0} className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400">
                                    Record Payment
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    </div>
  );
};

export default CollectFeePage;
