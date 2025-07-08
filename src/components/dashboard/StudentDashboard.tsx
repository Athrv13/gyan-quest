
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, BookOpen, FileText, Clock, Award, TrendingUp, Target, User } from 'lucide-react';

interface ActivityItem {
  type: 'grade' | 'attendance';
  date: string;
  data: any;
  class?: any;
}

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
    if (studentGrades.length === 0) return { gpa: 'N/A', letter: 'N/A', percentage: 0 };
    const totalPercentage = studentGrades.reduce((acc, grade) => acc + (grade.score / grade.maxScore * 100), 0);
    const avgPercentage = totalPercentage / studentGrades.length;
    const gpa = (avgPercentage / 25).toFixed(2); // Convert to 4.0 scale
    
    let letter = 'F';
    if (avgPercentage >= 97) letter = 'A+';
    else if (avgPercentage >= 93) letter = 'A';
    else if (avgPercentage >= 90) letter = 'A-';
    else if (avgPercentage >= 87) letter = 'B+';
    else if (avgPercentage >= 83) letter = 'B';
    else if (avgPercentage >= 80) letter = 'B-';
    else if (avgPercentage >= 77) letter = 'C+';
    else if (avgPercentage >= 73) letter = 'C';
    else if (avgPercentage >= 70) letter = 'C-';
    else if (avgPercentage >= 67) letter = 'D+';
    else if (avgPercentage >= 65) letter = 'D';
    
    return { gpa, letter, percentage: Math.round(avgPercentage) };
  };

  const getAttendanceRate = () => {
    if (studentAttendance.length === 0) return { rate: 0, present: 0, total: 0 };
    const presentCount = studentAttendance.filter(a => a.status === 'present').length;
    const rate = Math.round((presentCount / studentAttendance.length) * 100);
    return { rate, present: presentCount, total: studentAttendance.length };
  };

  const getRecentActivity = (): ActivityItem[] => {
    const recentGrades = studentGrades.slice(-5);
    const recentAttendance = studentAttendance.slice(-10);
    
    const activity: ActivityItem[] = [
      ...recentGrades.map(grade => ({
        type: 'grade' as const,
        date: grade.date,
        data: grade,
        class: state.classes.find(c => c.id === grade.classId)
      })),
      ...recentAttendance.map(att => ({
        type: 'attendance' as const,
        date: att.date,
        data: att,
        class: state.classes.find(c => c.id === att.classId)
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);
    
    return activity;
  };

  const gpaData = calculateGPA();
  const attendanceData = getAttendanceRate();
  const recentActivity = getRecentActivity();

  const stats = [
    {
      title: 'Enrolled Classes',
      value: enrolledClasses.length,
      description: 'Active enrollments',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Current GPA',
      value: gpaData.gpa,
      description: `${gpaData.letter} Grade • ${gpaData.percentage}%`,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Assessments',
      value: studentGrades.length,
      description: 'Completed assessments',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Attendance Rate',
      value: `${attendanceData.rate}%`,
      description: `${attendanceData.present}/${attendanceData.total} classes`,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Student Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back, {student?.name} - Grade {student?.grade}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <img 
            src={student?.avatar} 
            alt={student?.name} 
            className="w-12 h-12 rounded-full border-2 border-blue-100"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="grades">My Grades</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
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

          {/* Recent Activity and Quick Stats */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest grades and attendance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'grade' ? 'bg-purple-100' : 'bg-blue-100'
                        }`}>
                          {activity.type === 'grade' ? 
                            <FileText className="h-4 w-4 text-purple-600" /> : 
                            <Calendar className="h-4 w-4 text-blue-600" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.class?.name || 'Unknown Class'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.type === 'grade' ? 
                              `${activity.data.type} - ${activity.data.score}/${activity.data.maxScore}` :
                              `Attendance: ${activity.data.status}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{activity.date}</p>
                        {activity.type === 'grade' && (
                          <Badge className={
                            (activity.data.score / activity.data.maxScore * 100) >= 90 ? 'bg-green-100 text-green-800' :
                            (activity.data.score / activity.data.maxScore * 100) >= 80 ? 'bg-blue-100 text-blue-800' :
                            (activity.data.score / activity.data.maxScore * 100) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {Math.round((activity.data.score / activity.data.maxScore) * 100)}%
                          </Badge>
                        )}
                        {activity.type === 'attendance' && (
                          <Badge className={
                            activity.data.status === 'present' ? 'bg-green-100 text-green-800' :
                            activity.data.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {activity.data.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Performance Summary</span>
                </CardTitle>
                <CardDescription>
                  Your academic performance overview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Grade Average</span>
                    <span className="font-medium">{gpaData.percentage}% ({gpaData.letter})</span>
                  </div>
                  <Progress value={gpaData.percentage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Attendance Rate</span>
                    <span className="font-medium">{attendanceData.rate}%</span>
                  </div>
                  <Progress value={attendanceData.rate} className="h-2" />
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Best Subject</span>
                    <span className="font-medium">
                      {enrolledClasses.length > 0 ? enrolledClasses[0].subject : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Classes</span>
                    <span className="font-medium">{enrolledClasses.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Assessments Completed</span>
                    <span className="font-medium">{studentGrades.length}</span>
                  </div>
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

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Your performance across different subjects</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrolledClasses.map(cls => {
                  const classGrades = studentGrades.filter(g => g.classId === cls.id);
                  const avgGrade = classGrades.length > 0 
                    ? Math.round(classGrades.reduce((acc, g) => acc + (g.score / g.maxScore * 100), 0) / classGrades.length)
                    : 0;
                  
                  return (
                    <div key={cls.id}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{cls.subject}</span>
                        <span className="font-medium">{avgGrade}%</span>
                      </div>
                      <Progress value={avgGrade} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Academic Goals</CardTitle>
                <CardDescription>Track your progress towards academic goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Target GPA: 3.5</span>
                    <span className="font-medium">Current: {gpaData.gpa}</span>
                  </div>
                  <Progress value={parseFloat(gpaData.gpa.toString()) / 4 * 100 || 0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Attendance Goal: 95%</span>
                    <span className="font-medium">Current: {attendanceData.rate}%</span>
                  </div>
                  <Progress value={attendanceData.rate} className="h-2" />
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Focus on improving attendance</li>
                    <li>• Review latest assessment feedback</li>
                    <li>• Schedule study sessions for upcoming tests</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
