
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, FileText, Clock } from 'lucide-react';
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
  ).slice(0, 5);

  const stats = [
    {
      title: 'My Classes',
      value: teacherClasses.length,
      description: 'Active classes',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Students',
      value: totalStudents,
      description: 'Enrolled students',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Grades Recorded',
      value: recentGrades.length,
      description: 'Total grades',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Experience',
      value: `${teacher?.experience || 0} yrs`,
      description: 'Teaching experience',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h2>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {teacher?.name}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="grades">Record Grades</TabsTrigger>
          <TabsTrigger value="attendance">Take Attendance</TabsTrigger>
          <TabsTrigger value="students">View Students</TabsTrigger>
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

          {/* My Classes and Recent Grades */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* My Classes */}
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>
                  Classes you're currently teaching
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherClasses.map((cls) => (
                    <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{cls.name}</h3>
                          <p className="text-sm text-gray-500">{cls.subject} - Grade {cls.grade}</p>
                          <p className="text-sm text-gray-500">{cls.schedule}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{cls.enrolledStudents.length} students</p>
                          <p className="text-xs text-gray-500">{cls.room}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Grades */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>
                  Recently recorded student grades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGrades.map((grade) => {
                    const student = state.students.find(s => s.id === grade.studentId);
                    const cls = state.classes.find(c => c.id === grade.classId);
                    return (
                      <div key={grade.id} className="flex items-center justify-between">
                        <div>
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
                          <p className="text-xs text-gray-500">
                            {grade.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
              <CardTitle>My Students</CardTitle>
              <CardDescription>
                Students enrolled in your classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherClasses.map((cls) => {
                  const enrolledStudents = state.students.filter(s => cls.enrolledStudents.includes(s.id));
                  return (
                    <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">{cls.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {enrolledStudents.map((student) => {
                          const studentGrades = state.grades.filter(g => g.studentId === student.id && g.classId === cls.id);
                          const avgGrade = studentGrades.length > 0 
                            ? Math.round(studentGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 100), 0) / studentGrades.length)
                            : 'No grades';
                          
                          return (
                            <div key={student.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                              <img src={student.avatar} alt={student.name} className="w-8 h-8 rounded-full" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{student.name}</p>
                                <p className="text-xs text-gray-500">Grade {student.grade}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-600">{avgGrade}%</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
