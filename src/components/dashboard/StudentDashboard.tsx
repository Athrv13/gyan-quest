
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, FileText, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const { state } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Find student data
  const student = state.students.find(s => s.email === user?.email);
  const studentGrades = state.grades.filter(g => g.studentId === student?.id);
  const studentAttendance = state.attendance.filter(a => a.studentId === student?.id);
  const enrolledClasses = state.classes.filter(c => c.enrolledStudents.includes(student?.id || ''));

  const calculateGPA = () => {
    if (studentGrades.length === 0) return 'N/A';
    const totalPercentage = studentGrades.reduce((acc, grade) => acc + (grade.score / grade.maxScore * 100), 0);
    const avgPercentage = totalPercentage / studentGrades.length;
    return (avgPercentage / 25).toFixed(2); // Convert to 4.0 scale
  };

  const getAttendanceRate = () => {
    if (studentAttendance.length === 0) return 'N/A';
    const presentCount = studentAttendance.filter(a => a.status === 'present').length;
    return Math.round((presentCount / studentAttendance.length) * 100);
  };

  const stats = [
    {
      title: 'My Classes',
      value: enrolledClasses.length,
      description: 'Enrolled classes',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Current GPA',
      value: calculateGPA(),
      description: 'Grade point average',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Grades',
      value: studentGrades.length,
      description: 'Recorded grades',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Attendance Rate',
      value: `${getAttendanceRate()}%`,
      description: 'Class attendance',
      icon: Clock,
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="grades">My Grades</TabsTrigger>
          <TabsTrigger value="attendance">My Attendance</TabsTrigger>
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

          {/* Recent Grades and Upcoming Classes */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
                <CardDescription>
                  Your latest test scores and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentGrades.slice(-5).map((grade) => {
                    const cls = state.classes.find(c => c.id === grade.classId);
                    const percentage = Math.round((grade.score / grade.maxScore) * 100);
                    return (
                      <div key={grade.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {cls?.name || grade.subject}
                          </p>
                          <p className="text-sm text-gray-500">
                            {grade.type.charAt(0).toUpperCase() + grade.type.slice(1)}
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
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>
                  Classes you're currently enrolled in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledClasses.map((cls) => {
                    const teacher = state.teachers.find(t => t.id === cls.teacherId);
                    return (
                      <div key={cls.id} className="border border-gray-200 rounded-lg p-3">
                        <h3 className="font-medium text-gray-900">{cls.name}</h3>
                        <p className="text-sm text-gray-500">{cls.subject} - {cls.room}</p>
                        <p className="text-sm text-gray-500">Teacher: {teacher?.name}</p>
                        <p className="text-xs text-gray-400">{cls.schedule}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Classes</CardTitle>
              <CardDescription>
                Complete list of your current classes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {enrolledClasses.map((cls) => {
                  const teacher = state.teachers.find(t => t.id === cls.teacherId);
                  const classGrades = studentGrades.filter(g => g.classId === cls.id);
                  const avgGrade = classGrades.length > 0 
                    ? Math.round(classGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 100), 0) / classGrades.length)
                    : 'No grades';
                  
                  return (
                    <div key={cls.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{cls.name}</h3>
                          <p className="text-sm text-gray-500">{cls.subject} - Grade {cls.grade}</p>
                          <p className="text-sm text-gray-500">Teacher: {teacher?.name}</p>
                          <p className="text-sm text-gray-500">{cls.schedule}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{cls.room}</p>
                          <p className="text-sm text-gray-500">Average: {avgGrade}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grades" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grade History</CardTitle>
              <CardDescription>
                All your recorded grades and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Class</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Score</th>
                      <th className="text-left p-3 font-medium">Grade</th>
                      <th className="text-left p-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentGrades.map((grade) => {
                      const cls = state.classes.find(c => c.id === grade.classId);
                      const percentage = Math.round((grade.score / grade.maxScore) * 100);
                      return (
                        <tr key={grade.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{cls?.name || grade.subject}</td>
                          <td className="p-3">
                            <Badge variant="outline">
                              {grade.type.charAt(0).toUpperCase() + grade.type.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-3">{grade.score}/{grade.maxScore}</td>
                          <td className="p-3">
                            <Badge className={
                              percentage >= 90 ? 'bg-green-100 text-green-800' :
                              percentage >= 80 ? 'bg-blue-100 text-blue-800' :
                              percentage >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {percentage}%
                            </Badge>
                          </td>
                          <td className="p-3">{grade.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Record</CardTitle>
              <CardDescription>
                Your class attendance history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Class</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAttendance.map((attendance) => {
                      const cls = state.classes.find(c => c.id === attendance.classId);
                      return (
                        <tr key={attendance.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{cls?.name}</td>
                          <td className="p-3">{attendance.date}</td>
                          <td className="p-3">
                            <Badge className={
                              attendance.status === 'present' ? 'bg-green-100 text-green-800' :
                              attendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
