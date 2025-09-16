'use client';

import { useState, memo, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAppStore, useAuthStore } from '@/lib/store';
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Calendar,
  FileText,
  ClipboardList,
  Bus,
  Building2,
  ChevronDown,
  ChevronRight,
  Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { 
    icon: Home, 
    label: 'Home', 
    href: '/', 
    roles: ['admin'],
    adminHref: '/',
    teacherHref: '/teacher/dashboard',
    parentHref: '/parent/dashboard'
  },
  { 
    icon: Users, 
    label: 'Students', 
    href: '/students', 
    roles: ['admin', 'teacher'],
    subItems: [
      { label: 'All Students', href: '/students' },
      { label: 'Student Details', href: '/students/details' },
    ]
  },
  { 
    icon: GraduationCap, 
    label: 'Teachers', 
    href: '/teachers', 
    roles: ['admin'],
    subItems: [
      { label: 'All Teachers', href: '/teachers' },
      { label: 'Teacher Details', href: '/teachers/details' },
    ]
  },
  { icon: BookOpen, label: 'Library', href: '/library', roles: ['admin', 'teacher'] },
  { 
    icon: CreditCard, 
    label: 'Account', 
    href: '#', 
    roles: ['admin'],
    subItems: [
      { label: 'Fees Collection', href: '/account/fees' },
      { label: 'Expenses', href: '/account/expenses' },
    ]
  },
  { icon: ClipboardList, label: 'Class', href: '/class', roles: ['admin', 'teacher'] },
  { icon: FileText, label: 'Subject', href: '/subject', roles: ['admin', 'teacher'] },
  { icon: Calendar, label: 'Routine', href: '/routine', roles: ['admin', 'teacher', 'parent'] },
  { icon: Calendar, label: 'Attendance', href: '/attendance', roles: ['admin', 'teacher', 'parent'] },
  { 
    icon: FileText, 
    label: 'Exam', 
    href: '#', 
    roles: ['admin', 'teacher'],
    subItems: [
      { label: 'Exam Schedules', href: '/exam/schedules' },
      { label: 'Exam Grades', href: '/exam/grades' },
    ]
  },
  { icon: ClipboardList, label: 'Notice', href: '/notice', roles: ['admin', 'teacher', 'parent'] },
  { icon: Bus, label: 'Transport', href: '/transport', roles: ['admin'] },
  { icon: Building2, label: 'Hostel', href: '/hostel', roles: ['admin'] },
];

const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, isMobile, mobileMenuOpen, closeMobileMenu, setIsMobile } = useAppStore();
  const { user } = useAuthStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  const toggleExpanded = useCallback((label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  }, []);

  const filteredMenuItems = useMemo(() => menuItems.filter(item => 
    item.roles.includes(user?.role || 'admin')
  ), [user?.role]);

  const getHrefForRole = useCallback((item: any) => {
    if (item.adminHref && user?.role === 'admin') return item.adminHref;
    if (item.teacherHref && user?.role === 'teacher') return item.teacherHref;
    if (item.parentHref && user?.role === 'parent') return item.parentHref;
    return item.href;
  }, [user?.role]);

  // Determine if sidebar should be visible on mobile
  const isSidebarVisible = isMobile ? mobileMenuOpen : true;
  
  // Determine sidebar width classes
  const getSidebarClasses = () => {
    if (isMobile) {
      return mobileMenuOpen 
        ? 'translate-x-0 w-64 sm:w-72' 
        : '-translate-x-full w-64 sm:w-72';
    } else {
      return sidebarCollapsed 
        ? 'translate-x-0 w-16' 
        : 'translate-x-0 w-64 xl:w-72';
    }
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out',
        getSidebarClasses()
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-border bg-card">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              {(!sidebarCollapsed || isMobile) && (
                <span className="text-lg sm:text-xl font-bold text-card-foreground truncate">
                  TRACKLY
                </span>
              )}
            </div>
            
            {/* Close button for mobile */}
            {isMobile && mobileMenuOpen && (
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMobileMenu}
                className="p-1.5 lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 sm:py-4 bg-card">
            <ul className="space-y-1 px-2 sm:px-3">
              {filteredMenuItems.map((item) => (
                <li key={item.label}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          'w-full flex items-center justify-between px-2 sm:px-3 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-colors group',
                          pathname.startsWith(item.href) || expandedItems.includes(item.label)
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                        title={(sidebarCollapsed && !isMobile) ? item.label : undefined}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          {(!sidebarCollapsed || isMobile) && (
                            <span className="truncate text-sm sm:text-base">{item.label}</span>
                          )}
                        </div>
                        {(!sidebarCollapsed || isMobile) && (
                          <div className="flex-shrink-0 ml-2">
                            {expandedItems.includes(item.label) ? (
                              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                          </div>
                        )}
                      </button>
                      
                      {/* Submenu */}
                      {expandedItems.includes(item.label) && (!sidebarCollapsed || isMobile) && (
                        <ul className="mt-1 space-y-1 ml-4 sm:ml-6">
                          {item.subItems.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                onClick={closeMobileMenu}
                                className={cn(
                                  'block px-2 sm:px-3 py-2 text-sm rounded-lg transition-colors',
                                  pathname === subItem.href
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                              >
                                <span className="truncate text-xs sm:text-sm">
                                  {subItem.label}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={getHrefForRole(item)}
                      onClick={closeMobileMenu}
                      className={cn(
                        'flex items-center space-x-3 px-2 sm:px-3 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-colors group',
                        pathname === getHrefForRole(item)
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                      title={(sidebarCollapsed && !isMobile) ? item.label : undefined}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      {(!sidebarCollapsed || isMobile) && (
                        <span className="truncate text-sm sm:text-base">{item.label}</span>
                      )}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Settings at bottom */}
          <div className="p-2 sm:p-3 border-t border-border bg-card">
            <Link
              href="/settings"
              onClick={closeMobileMenu}
              className={cn(
                'flex items-center space-x-3 px-2 sm:px-3 py-2.5 sm:py-3 text-sm font-medium rounded-lg transition-colors',
                pathname === '/settings'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-card-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              title={(sidebarCollapsed && !isMobile) ? 'Settings' : undefined}
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              {(!sidebarCollapsed || isMobile) && (
                <span className="truncate text-sm sm:text-base">Settings</span>
              )}
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
});

export default Sidebar;