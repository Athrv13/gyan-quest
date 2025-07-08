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
import StudentQueries from "./components/students/StudentQueries";
import TeacherList from "./components/teachers/TeacherList";
import TeacherStudentList from "./components/teachers/TeacherStudentList";
import ClassList from "./components/classes/ClassList";
import GradeList from "./components/grades/GradeList";
import AttendanceList from "./components/attendance/AttendanceList";
import TeacherQueries from "./components/teachers/TeacherQueries";

const queryClient = new QueryClient();

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
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route path="dashboard" element={<DashboardRouter />} />
                <Route path="students" element={<StudentsRouter />} />
                <Route path="teachers" element={
                  <ProtectedRoute requiredRole="admin">
                    <TeacherList />
                  </ProtectedRoute>
                } />
                <Route path="classes" element={<ClassList />} />
                <Route path="grades" element={<GradeList />} />
                <Route path="attendance" element={<AttendanceList />} />
                <Route path="queries" element={<QueriesRouter />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

const DashboardRouter = () => {
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

const StudentsRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <StudentList />;
    case 'teacher':
      return <TeacherStudentList />;
    case 'student':
      return <StudentQueries />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const QueriesRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'teacher':
      return <TeacherQueries />;
    case 'student':
      return <StudentQueries />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default App;
