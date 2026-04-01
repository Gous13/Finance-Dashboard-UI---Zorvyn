import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-2 rounded-full mt-1",
            variant === 'danger' ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "bg-zinc-50 dark:bg-zinc-900/20 text-zinc-600 dark:text-zinc-400"
          )}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {message}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'} 
            className="flex-1" 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// Helper for cn since it might not be imported in this scope if I'm not careful
import { cn } from '../../lib/utils';
