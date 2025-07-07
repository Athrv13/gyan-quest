import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/common/Layout";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import TeacherDashboard from "./components/dashboard/TeacherDashboard";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import StudentList from "./components/students/StudentList";
import TeacherList from "./components/teachers/TeacherList";

const queryClient = new QueryClient();

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
};

const DashboardContent = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="students" element={
                  <ProtectedRoute requiredRole="admin">
                    <StudentList />
                  </ProtectedRoute>
                } />
                <Route path="teachers" element={
                  <ProtectedRoute requiredRole="admin">
                    <TeacherList />
                  </ProtectedRoute>
                } />
                <Route path="classes" element={
                  <ProtectedRoute>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold">Class Management</h2>
                      <p className="text-gray-600 mt-2">Coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="grades" element={
                  <ProtectedRoute>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold">Grade Management</h2>
                      <p className="text-gray-600 mt-2">Coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="attendance" element={
                  <ProtectedRoute>
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold">Attendance Management</h2>
                      <p className="text-gray-600 mt-2">Coming soon...</p>
                    </div>
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
