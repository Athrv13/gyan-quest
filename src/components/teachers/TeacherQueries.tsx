
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Plus, ArrowDown, ArrowUp } from 'lucide-react';
import { toast } from "sonner";
import Modal from '../common/Modal';

const TeacherQueries = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [isNewQueryModalOpen, setIsNewQueryModalOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [reply, setReply] = useState('');
  const [newQuery, setNewQuery] = useState({ studentId: '', message: '' });

  const teacher = state.teachers.find(t => t.email === user?.email);
  const teacherQueries = state.studentQueries.filter(q => q.teacherId === teacher?.id);
  const teacherStudents = state.students.filter(s => 
    state.classes.some(c => c.teacherId === teacher?.id && c.enrolledStudents.includes(s.id))
  );

  const handleReply = () => {
    if (!reply.trim()) {
      toast.error('Please enter a response');
      return;
    }

    const updatedQuery = {
      ...selectedQuery,
      response: reply,
      status: 'answered'
    };

    dispatch({ type: 'UPDATE_STUDENT_QUERY', payload: updatedQuery });
    toast.success('Response sent successfully');
    setIsReplyModalOpen(false);
    setReply('');
    setSelectedQuery(null);
  };

  const handleNewQuery = () => {
    if (!newQuery.studentId || !newQuery.message.trim()) {
      toast.error('Please select a student and enter your message');
      return;
    }

    const student = state.students.find(s => s.id === newQuery.studentId);
    const teacherClass = state.classes.find(c => 
      c.teacherId === teacher?.id && c.enrolledStudents.includes(newQuery.studentId)
    );

    if (!student || !teacherClass) return;

    const query = {
      id: Date.now().toString(),
      studentId: newQuery.studentId,
      teacherId: teacher?.id || '',
      classId: teacherClass.id,
      message: newQuery.message,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      isFromTeacher: true
    };

    dispatch({ type: 'ADD_STUDENT_QUERY', payload: query });
    toast.success('Message sent to student successfully');
    setIsNewQueryModalOpen(false);
    setNewQuery({ studentId: '', message: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Queries</h2>
          <p className="text-sm text-gray-600">
            Manage student questions and send messages
          </p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setIsNewQueryModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Message Student</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Student Communications ({teacherQueries.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teacherQueries.map((query) => {
              const cls = state.classes.find(c => c.id === query.classId);
              const student = state.students.find(s => s.id === query.studentId);
              
              return (
                <div key={query.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-sm">{cls?.name} - {cls?.subject}</h4>
                      <p className="text-xs text-gray-500">
                        From: {student?.name} • {query.date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={query.status === 'answered' ? 'default' : 'secondary'}
                      >
                        {query.status}
                      </Badge>
                      {query.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedQuery(query);
                            setIsReplyModalOpen(true);
                          }}
                        >
                          Reply
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Student Message */}
                  <div className="mb-3">
                    <div className="flex items-start space-x-2">
                      <ArrowUp className="h-4 w-4 text-blue-500 mt-1" />
                      <div className="bg-blue-50 rounded-lg p-3 flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">Student Question:</p>
                        <p className="text-sm text-blue-800">{query.message}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Teacher Response */}
                  {query.response && (
                    <div className="flex items-start space-x-2">
                      <ArrowDown className="h-4 w-4 text-green-500 mt-1" />
                      <div className="bg-green-50 rounded-lg p-3 flex-1">
                        <p className="text-sm font-medium text-green-900 mb-1">Your Response:</p>
                        <p className="text-sm text-green-800">{query.response}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {teacherQueries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No student queries yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reply Modal */}
      <Modal 
        isOpen={isReplyModalOpen} 
        onClose={() => setIsReplyModalOpen(false)}
        title="Reply to Student"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Question
            </label>
            <div className="bg-gray-50 rounded p-3 text-sm">
              {selectedQuery?.message}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Response
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              placeholder="Type your response here..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleReply}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Response</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsReplyModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Query Modal */}
      <Modal 
        isOpen={isNewQueryModalOpen} 
        onClose={() => setIsNewQueryModalOpen(false)}
        title="Message Student"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Student
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={newQuery.studentId}
              onChange={(e) => setNewQuery({...newQuery, studentId: e.target.value})}
            >
              <option value="">Choose a student</option>
              {teacherStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - Grade {student.grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              placeholder="Type your message here..."
              value={newQuery.message}
              onChange={(e) => setNewQuery({...newQuery, message: e.target.value})}
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleNewQuery}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsNewQueryModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherQueries;
