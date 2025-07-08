
import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, FileText, Clock } from 'lucide-react';

const TeacherDashboard = () => {
  const { state } = useData();
  const { user } = useAuth();

  const teacher = state.teachers.find(t => t.email === user?.email);
  const teacherClasses = state.classes.filter(c => c.teacherId === teacher?.id);
  const teacherStudents = state.students.filter(s => 
    teacherClasses.some(c => c.enrolledStudents.includes(s.id))
  );

  // Filter grades for classes taught by this teacher
  const teacherGrades = state.grades.filter(g => 
    teacherClasses.some(c => c.id === g.classId)
  );

  // Filter attendance for classes taught by this teacher
  const teacherAttendance = state.attendance.filter(a => 
    teacherClasses.some(c => c.id === a.classId)
  );

  const stats = [
    {
      title: 'My Classes',
      value: teacherClasses.length,
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'My Students',
      value: teacherStudents.length,
      icon: Users,
      color: 'text-green-600',
    },
    {
      title: 'Grades Given',
      value: teacherGrades.length,
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      title: 'Attendance Records',
      value: teacherAttendance.length,
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="text-gray-600">Welcome back, {teacher?.name}</p>
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
            <CardTitle>My Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherClasses.slice(0, 5).map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <div>
                    <div className="font-medium text-sm">{cls.name}</div>
                    <div className="text-xs text-gray-500">{cls.subject} • {cls.schedule}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {cls.enrolledStudents.length} students
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherStudents.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
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
      </div>
    </div>
  );
};

export default TeacherDashboard;
