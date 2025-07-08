
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, Send } from 'lucide-react';
import { toast } from "sonner";
import Modal from '../common/Modal';
import type { StudentQuery } from '../../context/DataContext';

const StudentQueries = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuery, setNewQuery] = useState({ classId: '', message: '' });

  const student = state.students.find(s => s.email === user?.email);
  const studentQueries = state.studentQueries.filter(q => q.studentId === student?.id);
  const enrolledClasses = state.classes.filter(c => c.enrolledStudents.includes(student?.id || ''));

  const handleSubmitQuery = () => {
    if (!newQuery.classId || !newQuery.message.trim()) {
      toast.error('Please select a class and enter your question');
      return;
    }

    const selectedClass = state.classes.find(c => c.id === newQuery.classId);
    if (!selectedClass) return;

    const query: StudentQuery = {
      id: Date.now().toString(),
      studentId: student?.id || '',
      teacherId: selectedClass.teacherId,
      classId: newQuery.classId,
      message: newQuery.message,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    dispatch({ type: 'ADD_STUDENT_QUERY', payload: query });
    toast.success('Query sent to teacher successfully');
    setIsAddModalOpen(false);
    setNewQuery({ classId: '', message: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Queries</h2>
          <p className="text-sm text-gray-600">
            Questions and discussions with teachers
          </p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Ask Question</span>
        </Button>
      </div>

      {/* Queries List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Recent Queries ({studentQueries.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentQueries.map((query) => {
              const cls = state.classes.find(c => c.id === query.classId);
              const teacher = state.teachers.find(t => t.id === query.teacherId);
              
              return (
                <div key={query.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{cls?.name}</h4>
                      <p className="text-xs text-gray-500">
                        To: {teacher?.name} • {query.date}
                      </p>
                    </div>
                    <Badge 
                      variant={query.status === 'answered' ? 'default' : 'secondary'}
                    >
                      {query.status}
                    </Badge>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3 mb-2">
                    <p className="text-sm">{query.message}</p>
                  </div>
                  
                  {query.response && (
                    <div className="bg-blue-50 rounded p-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">Teacher Response:</p>
                      <p className="text-sm text-blue-800">{query.response}</p>
                    </div>
                  )}
                </div>
              );
            })}
            
            {studentQueries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No queries yet. Ask your first question!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Query Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Ask a Question"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={newQuery.classId}
              onChange={(e) => setNewQuery({...newQuery, classId: e.target.value})}
            >
              <option value="">Choose a class</option>
              {enrolledClasses.map(cls => {
                const teacher = state.teachers.find(t => t.id === cls.teacherId);
                return (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} - {teacher?.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md h-24"
              placeholder="Type your question here..."
              value={newQuery.message}
              onChange={(e) => setNewQuery({...newQuery, message: e.target.value})}
            />
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleSubmitQuery}
              className="flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>Send Query</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentQueries;
