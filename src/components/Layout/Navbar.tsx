import React from 'react';
import { LayoutDashboard, User, ShieldCheck, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { UserRole } from '../../types';

interface NavbarProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar = ({ role, onRoleChange, isDarkMode, toggleDarkMode }: NavbarProps) => {
  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              FinTrack
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Gous Patan</span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{role}</span>
              </div>
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                  {role === 'Admin' ? <ShieldCheck className="w-5 h-5 text-zinc-600" /> : <User className="w-5 h-5 text-zinc-600" />}
                </div>
              </div>
              <Select 
                className="w-32 h-9 text-xs"
                options={[
                  { label: 'Viewer', value: 'Viewer' },
                  { label: 'Admin', value: 'Admin' },
                ]}
                value={role}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
