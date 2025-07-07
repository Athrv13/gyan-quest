
import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, Calendar, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const { state } = useData();

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

  const recentStudents = state.students.slice(0, 5);
  const recentTeachers = state.teachers.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-gray-600">
          Overview of your school management system
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

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Add New Student</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Add New Teacher</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Create New Class</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
