import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">⚙️ Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Google Sheets Integration */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Google Sheets Integration</h3>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="mb-3">Your expense data is automatically synced with Google Sheets using Google Apps Script.</p>
                  <a 
                    href="https://docs.google.com/spreadsheets/d/1lRn0CSCBpGA_YTDF4-Zby-AToqqPj0MjvkrWNqvGwfk" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-secondary transition-colors duration-200"
                  >
                    📊 View Google Sheet
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* App Information */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ℹ️ App Information</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-medium">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Currency:</span>
                  <span className="font-medium">South African Rand (R)</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="font-medium">Google Sheets</span>
                </div>
                <div className="flex justify-between">
                  <span>Sync:</span>
                  <span className="font-medium">Real-time</span>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{message}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal; 