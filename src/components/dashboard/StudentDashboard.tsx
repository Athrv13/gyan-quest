
import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, User, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const { state } = useData();
  const { user } = useAuth();

  // Find student data
  const student = state.students.find(s => s.email === user?.email);
  const studentGrades = state.grades.filter(g => g.studentId === student?.id);
  const studentAttendance = state.attendance.filter(a => a.studentId === student?.id);
  const studentClasses = state.classes.filter(c => 
    c.enrolledStudents.includes(student?.id || '')
  );

  const averageGrade = studentGrades.length > 0 
    ? Math.round(studentGrades.reduce((acc, grade) => acc + (grade.score / grade.maxScore * 100), 0) / studentGrades.length)
    : 0;

  const attendanceRate = studentAttendance.length > 0
    ? Math.round((studentAttendance.filter(a => a.status === 'present').length / studentAttendance.length) * 100)
    : 0;

  const stats = [
    {
      title: 'Enrolled Classes',
      value: studentClasses.length,
      description: 'Active enrollments',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Average Grade',
      value: `${averageGrade}%`,
      description: 'Overall performance',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceRate}%`,
      description: 'Class attendance',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Current Grade',
      value: student?.grade || 'N/A',
      description: 'Academic year',
      icon: User,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Student Dashboard</h2>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {student?.name}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-full`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Student Info and Classes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Your student profile details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  className="h-16 w-16 rounded-full"
                  src={student?.avatar}
                  alt={student?.name}
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{student?.name}</h3>
                  <p className="text-sm text-gray-500">{student?.email}</p>
                  <p className="text-sm text-gray-500">Grade {student?.grade}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Phone:</span>
                  <span className="text-sm text-gray-900">{student?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date of Birth:</span>
                  <span className="text-sm text-gray-900">{student?.dateOfBirth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Address:</span>
                  <span className="text-sm text-gray-900">{student?.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Parent:</span>
                  <span className="text-sm text-gray-900">{student?.parentName}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Classes */}
        <Card>
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>
              Your current class schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentClasses.map((cls) => {
                const teacher = state.teachers.find(t => t.id === cls.teacherId);
                return (
                  <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{cls.name}</h3>
                        <p className="text-sm text-gray-500">{cls.subject}</p>
                        <p className="text-sm text-gray-500">{cls.schedule}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{teacher?.name}</p>
                        <p className="text-xs text-gray-500">{cls.room}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Grades</CardTitle>
          <CardDescription>
            Your latest academic performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentGrades.map((grade) => {
              const cls = state.classes.find(c => c.id === grade.classId);
              const percentage = Math.round((grade.score / grade.maxScore) * 100);
              return (
                <div key={grade.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {cls?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {grade.type} - {grade.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {grade.score}/{grade.maxScore}
                    </p>
                    <p className={`text-xs ${percentage >= 90 ? 'text-green-600' : percentage >= 80 ? 'text-blue-600' : percentage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {percentage}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
