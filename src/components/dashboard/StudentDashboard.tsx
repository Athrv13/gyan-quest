
import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, BookOpen, FileText, Clock, MessageSquare } from 'lucide-react';

const StudentDashboard = () => {
  const { state } = useData();
  const { user } = useAuth();

  const student = state.students.find(s => s.email === user?.email);
  const studentGrades = state.grades.filter(g => g.studentId === student?.id);
  const studentAttendance = state.attendance.filter(a => a.studentId === student?.id);
  const enrolledClasses = state.classes.filter(c => c.enrolledStudents.includes(student?.id || ''));
  const studentQueries = state.studentQueries.filter(q => q.studentId === student?.id);

  const calculateGPA = () => {
    if (studentGrades.length === 0) return { gpa: 0, percentage: 0 };
    const totalPercentage = studentGrades.reduce((acc, grade) => acc + (grade.score / grade.maxScore * 100), 0);
    const percentage = Math.round(totalPercentage / studentGrades.length);
    const gpa = (percentage / 25).toFixed(1);
    return { gpa: parseFloat(gpa), percentage };
  };

  const getAttendanceRate = () => {
    if (studentAttendance.length === 0) return 0;
    const presentCount = studentAttendance.filter(a => a.status === 'present').length;
    return Math.round((presentCount / studentAttendance.length) * 100);
  };

  const gpaData = calculateGPA();
  const attendanceRate = getAttendanceRate();

  const stats = [
    {
      title: 'My Classes',
      value: enrolledClasses.length,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'My Grades',
      value: studentGrades.length,
      icon: FileText,
      color: 'text-green-600',
    },
    {
      title: 'GPA',
      value: gpaData.gpa,
      icon: BookOpen,
      color: 'text-purple-600',
    },
    {
      title: 'Attendance',
      value: `${attendanceRate}%`,
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {student?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Academic Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Grade</span>
                <span className="font-medium">{gpaData.percentage}%</span>
              </div>
              <Progress value={gpaData.percentage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Attendance Rate</span>
                <span className="font-medium">{attendanceRate}%</span>
              </div>
              <Progress value={attendanceRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enrolledClasses.map((cls) => {
                const teacher = state.teachers.find(t => t.id === cls.teacherId);
                return (
                  <div key={cls.id} className="p-3 border rounded">
                    <div className="font-medium text-sm">{cls.name}</div>
                    <div className="text-xs text-gray-500">{cls.subject} • {teacher?.name}</div>
                    <div className="text-xs text-gray-500">{cls.schedule}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentGrades.slice(-5).map((grade) => {
                const cls = state.classes.find(c => c.id === grade.classId);
                const percentage = Math.round((grade.score / grade.maxScore) * 100);
                return (
                  <div key={grade.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium text-sm">{cls?.name}</div>
                      <div className="text-xs text-gray-500">{grade.type} • {grade.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm">{grade.score}/{grade.maxScore}</div>
                      <div className="text-xs text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>My Queries</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {studentQueries.slice(-3).map((query) => {
                const cls = state.classes.find(c => c.id === query.classId);
                const teacher = state.teachers.find(t => t.id === query.teacherId);
                return (
                  <div key={query.id} className="p-3 border rounded">
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-sm">{cls?.name}</div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        query.status === 'answered' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {query.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">To: {teacher?.name}</div>
                    <p className="text-sm text-gray-600 truncate">{query.message}</p>
                  </div>
                );
              })}
              {studentQueries.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No queries yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
