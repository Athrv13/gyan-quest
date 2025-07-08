
import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, User, Calendar, FileText } from 'lucide-react';

const AdminDashboard = () => {
  const { state } = useData();

  const stats = [
    {
      title: 'Students',
      value: state.students.length,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Teachers',
      value: state.teachers.length,
      icon: User,
      color: 'text-green-600',
    },
    {
      title: 'Classes',
      value: state.classes.length,
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      title: 'Grades',
      value: state.grades.length,
      icon: FileText,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">School management overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.students.slice(-5).map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {student.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{student.name}</div>
                    <div className="text-xs text-gray-500">Grade {student.grade}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {state.teachers.slice(-5).map((teacher) => (
                <div key={teacher.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{teacher.name}</div>
                    <div className="text-xs text-gray-500">{teacher.subject}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
