
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Calendar, FileText, MessageSquare, CheckCircle, XCircle, Send } from 'lucide-react';
import { toast } from "sonner";
import Modal from '../common/Modal';

const TeacherDashboard = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [response, setResponse] = useState('');

  const teacher = state.teachers.find(t => t.email === user?.email);
  const teacherClasses = state.classes.filter(c => c.teacherId === teacher?.id);
  const teacherStudents = state.students.filter(s => 
    teacherClasses.some(c => c.enrolledStudents.includes(s.id))
  );

  const teacherGrades = state.grades.filter(g => 
    teacherClasses.some(c => c.id === g.classId)
  );

  const teacherQueries = state.studentQueries.filter(q => q.teacherId === teacher?.id);
  const pendingQueries = teacherQueries.filter(q => q.status === 'pending');

  const handleMarkAttendance = (studentId: string, classId: string, status: 'present' | 'absent') => {
    const attendance = {
      id: Date.now().toString(),
      studentId,
      classId,
      date: new Date().toISOString().split('T')[0],
      status
    };

    dispatch({ type: 'ADD_ATTENDANCE', payload: attendance });
    toast.success(`Attendance marked as ${status}`);
  };

  const handleRespondToQuery = () => {
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    const updatedQuery = {
      ...selectedQuery,
      response: response,
      status: 'answered'
    };

    dispatch({ type: 'UPDATE_STUDENT_QUERY', payload: updatedQuery });
    toast.success('Response sent successfully');
    setIsQueryModalOpen(false);
    setResponse('');
    setSelectedQuery(null);
  };

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
      title: 'Pending Queries',
      value: pendingQueries.length,
      icon: MessageSquare,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
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
              {teacherClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium text-sm">{cls.name}</div>
                    <div className="text-xs text-gray-500">{cls.schedule}</div>
                    <div className="text-xs text-gray-500">{cls.room}</div>
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
            <CardTitle>Student Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teacherQueries.slice(0, 3).map((query) => {
                const student = state.students.find(s => s.id === query.studentId);
                const cls = state.classes.find(c => c.id === query.classId);
                
                return (
                  <div key={query.id} className="p-3 border rounded">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium text-sm">{student?.name}</div>
                        <div className="text-xs text-gray-500">{cls?.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          query.status === 'answered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {query.status}
                        </span>
                        {query.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedQuery(query);
                              setIsQueryModalOpen(true);
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{query.message}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teacherStudents.slice(0, 5).map((student) => {
              const studentClass = teacherClasses.find(c => c.enrolledStudents.includes(student.id));
              
              return (
                <div key={student.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={student.avatar}
                      alt={student.name}
                    />
                    <div>
                      <div className="font-medium text-sm">{student.name}</div>
                      <div className="text-xs text-gray-500">{studentClass?.name}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAttendance(student.id, studentClass?.id || '', 'present')}
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAttendance(student.id, studentClass?.id || '', 'absent')}
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Query Response Modal */}
      <Modal 
        isOpen={isQueryModalOpen} 
        onClose={() => setIsQueryModalOpen(false)}
        title="Respond to Query"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 rounded p-3">
            <p className="font-medium text-sm mb-1">Student Query:</p>
            <p className="text-sm">{selectedQuery?.message}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              placeholder="Type your response here..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleRespondToQuery}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Response</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsQueryModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherDashboard;
