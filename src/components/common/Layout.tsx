
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Home, 
  Users, 
  User, 
  Calendar, 
  FileText, 
  LogOut
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'teacher', 'student'] },
    { name: 'Students', href: '/students', icon: Users, roles: ['admin', 'teacher'] },
    { name: 'Teachers', href: '/teachers', icon: User, roles: ['admin'] },
    { name: 'Classes', href: '/classes', icon: Calendar, roles: ['admin', 'teacher'] },
    { name: 'Grades', href: '/grades', icon: FileText, roles: ['admin', 'teacher', 'student'] },
    { name: 'Attendance', href: '/attendance', icon: Calendar, roles: ['admin', 'teacher', 'student'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          navigation={filteredNavigation} 
          user={user} 
          onLogout={handleLogout}
          currentPath={location.pathname}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-sidebar-border" />
              <h1 className="text-2xl font-semibold text-gray-900 capitalize">
                {user?.role} Dashboard
              </h1>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = ({ navigation, user, onLogout, currentPath }) => {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          {state === "expanded" && (
            <span className="text-xl font-bold text-gray-900">Gyan Quest</span>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={currentPath === item.href}
                tooltip={item.name}
              >
                <button
                  onClick={() => window.location.href = item.href}
                  className="flex items-center gap-2 w-full"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          {state === "expanded" && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="h-8 w-8 p-0"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Layout;
