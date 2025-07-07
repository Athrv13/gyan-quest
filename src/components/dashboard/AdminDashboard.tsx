
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, User, Calendar, FileText } from 'lucide-react';
import StudentForm from '../students/StudentForm';
import TeacherForm from '../teachers/TeacherForm';

const AdminDashboard = () => {
  const { state } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Students',
      value: state.students.length,
      description: 'Enrolled students',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Teachers',
      value: state.teachers.length,
      description: 'Active faculty',
      icon: User,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Classes',
      value: state.classes.length,
      description: 'Active classes',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Grades',
      value: state.grades.length,
      description: 'Recorded grades',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentStudents = state.students.slice(-5);
  const recentTeachers = state.teachers.slice(-3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your school management system
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="add-student">Add Student</TabsTrigger>
          <TabsTrigger value="add-teacher">Add Teacher</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
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

          {/* Recent Data Tables */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Students */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>
                  Recently enrolled students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center space-x-4">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={student.avatar}
                        alt={student.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Grade {student.grade} - {student.class}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.enrollmentDate}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Teachers */}
            <Card>
              <CardHeader>
                <CardTitle>Faculty Overview</CardTitle>
                <CardDescription>
                  Teaching staff information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTeachers.map((teacher) => (
                    <div key={teacher.id} className="flex items-center space-x-4">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={teacher.avatar}
                        alt={teacher.name}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {teacher.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {teacher.subject} - {teacher.experience} years exp.
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {teacher.classes.length} classes
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="add-student">
          <StudentForm onSuccess={() => setActiveTab('overview')} />
        </TabsContent>

        <TabsContent value="add-teacher">
          <TeacherForm onSuccess={() => setActiveTab('overview')} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['9', '10', '11', '12'].map(grade => {
                    const gradeStudents = state.students.filter(s => s.grade === grade);
                    const percentage = (gradeStudents.length / state.students.length) * 100;
                    return (
                      <div key={grade} className="flex items-center justify-between">
                        <span className="text-sm font-medium">Grade {grade}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{gradeStudents.length}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[...new Set(state.teachers.map(t => t.subject))].map(subject => {
                    const subjectTeachers = state.teachers.filter(t => t.subject === subject);
                    return (
                      <div key={subject} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{subject}</span>
                        <span className="text-sm text-gray-600">{subjectTeachers.length} teachers</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
