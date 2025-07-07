
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, FileText, Clock, BookOpen, Award, TrendingUp } from 'lucide-react';
import GradeForm from '../grades/GradeForm';
import AttendanceForm from '../attendance/AttendanceForm';

const TeacherDashboard = () => {
  const { state } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Find teacher data
  const teacher = state.teachers.find(t => t.email === user?.email);
  const teacherClasses = state.classes.filter(c => c.teacherId === teacher?.id);
  const totalStudents = teacherClasses.reduce((acc, cls) => acc + cls.enrolledStudents.length, 0);
  const recentGrades = state.grades.filter(g => 
    teacherClasses.some(c => c.id === g.classId)
  ).slice(-10);

  // Calculate attendance statistics
  const todayAttendance = state.attendance.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today && teacherClasses.some(c => c.id === a.classId);
  });

  const stats = [
    {
      title: 'My Classes',
      value: teacherClasses.length,
      description: 'Active classes teaching',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Students',
      value: totalStudents,
      description: 'Students under guidance',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Grades This Month',
      value: recentGrades.length,
      description: 'Assessments recorded',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Today\'s Attendance',
      value: todayAttendance.length,
      description: 'Records taken today',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  // Get all students taught by this teacher with their performance
  const getAllMyStudents = () => {
    const studentMap = new Map();
    
    teacherClasses.forEach(cls => {
      cls.enrolledStudents.forEach(studentId => {
        const student = state.students.find(s => s.id === studentId);
        if (student && !studentMap.has(studentId)) {
          const studentGrades = state.grades.filter(g => 
            g.studentId === studentId && teacherClasses.some(c => c.id === g.classId)
          );
          const avgGrade = studentGrades.length > 0 
            ? Math.round(studentGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 100), 0) / studentGrades.length)
            : null;
          
          const attendanceRecords = state.attendance.filter(a => 
            a.studentId === studentId && teacherClasses.some(c => c.id === a.classId)
          );
          const attendanceRate = attendanceRecords.length > 0
            ? Math.round((attendanceRecords.filter(a => a.status === 'present').length / attendanceRecords.length) * 100)
            : null;

          studentMap.set(studentId, {
            ...student,
            avgGrade,
            attendanceRate,
            totalGrades: studentGrades.length,
            classes: teacherClasses.filter(c => c.enrolledStudents.includes(studentId)).map(c => c.name)
          });
        }
      });
    });
    
    return Array.from(studentMap.values());
  };

  const myStudents = getAllMyStudents();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h2>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {teacher?.name} - {teacher?.subject} Department
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Record Grades</TabsTrigger>
          <TabsTrigger value="attendance">Take Attendance</TabsTrigger>
          <TabsTrigger value="students">My Students</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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

          {/* My Classes and Recent Activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>My Classes</span>
                </CardTitle>
                <CardDescription>
                  Classes you're currently teaching
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherClasses.map((cls) => (
                    <div key={cls.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{cls.name}</h3>
                          <p className="text-sm text-gray-500">{cls.subject} - Grade {cls.grade}</p>
                          <p className="text-sm text-gray-500">{cls.schedule}</p>
                          <p className="text-xs text-gray-400">{cls.room}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{cls.enrolledStudents.length} students</Badge>
                          <p className="text-xs text-gray-500 mt-1">Capacity: {cls.capacity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {teacherClasses.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No classes assigned yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recent Grades</span>
                </CardTitle>
                <CardDescription>
                  Latest assessments you've recorded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGrades.slice(0, 5).map((grade) => {
                    const student = state.students.find(s => s.id === grade.studentId);
                    const cls = state.classes.find(c => c.id === grade.classId);
                    const percentage = Math.round((grade.score / grade.maxScore) * 100);
                    return (
                      <div key={grade.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {student?.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {cls?.name} - {grade.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {grade.score}/{grade.maxScore}
                          </p>
                          <Badge className={
                            percentage >= 90 ? 'bg-green-100 text-green-800' :
                            percentage >= 80 ? 'bg-blue-100 text-blue-800' :
                            percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {percentage}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  {recentGrades.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No grades recorded yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grades">
          <GradeForm />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceForm />
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>My Students ({myStudents.length})</span>
              </CardTitle>
              <CardDescription>
                Students enrolled in your classes with performance overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myStudents.map((student) => (
                  <div key={student.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-500">Grade {student.grade}</p>
                          <p className="text-xs text-gray-400">
                            Classes: {student.classes.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="flex space-x-4">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Avg Grade</p>
                            <Badge className={
                              !student.avgGrade ? 'bg-gray-100 text-gray-800' :
                              student.avgGrade >= 90 ? 'bg-green-100 text-green-800' :
                              student.avgGrade >= 80 ? 'bg-blue-100 text-blue-800' :
                              student.avgGrade >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {student.avgGrade ? `${student.avgGrade}%` : 'No grades'}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Attendance</p>
                            <Badge className={
                              !student.attendanceRate ? 'bg-gray-100 text-gray-800' :
                              student.attendanceRate >= 90 ? 'bg-green-100 text-green-800' :
                              student.attendanceRate >= 80 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {student.attendanceRate ? `${student.attendanceRate}%` : 'No data'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">
                          {student.totalGrades} grades recorded
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {myStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No students assigned to your classes yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
