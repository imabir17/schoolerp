
import React, { useState, useEffect } from 'react';
import { toastService } from '../../utils/toastService';

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const Toast: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleShowToast = (msg: string) => {
      setMessage(msg);
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000); // Hide after 3 seconds

      return () => clearTimeout(timer);
    };

    toastService.subscribe(handleShowToast);

    return () => {
      toastService.unsubscribe();
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
        className={`fixed top-5 right-5 z-[100] transition-all duration-300 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
    >
      <div className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800" role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
          <CheckCircleIcon className="w-5 h-5" />
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        <button 
          type="button" 
          className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" 
          aria-label="Close"
          onClick={() => setIsVisible(false)}
        >
          <span className="sr-only">Close</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
