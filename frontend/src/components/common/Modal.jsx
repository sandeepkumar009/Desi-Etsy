import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Component: Reusable animated modal with backdrop and optional title
const Modal = ({ isOpen, onClose, title, children }) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: '-50px', opacity: 0 },
    visible: { y: '0', opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { y: '50px', opacity: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Close modal on backdrop click
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <div className="flex justify-between items-center mb-4">
              {title && (
                <h2 className="text-2xl font-brand font-bold text-desi-primary">
                  {title}
                </h2>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
