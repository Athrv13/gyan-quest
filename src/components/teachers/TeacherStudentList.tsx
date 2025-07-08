
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Users, MessageSquare } from 'lucide-react';
import { toast } from "sonner";
import Modal from '../common/Modal';

const TeacherStudentList = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');

  const teacher = state.teachers.find(t => t.email === user?.email);
  const teacherClasses = state.classes.filter(c => c.teacherId === teacher?.id);
  const teacherStudents = state.students.filter(s => 
    teacherClasses.some(c => c.enrolledStudents.includes(s.id))
  );

  const allStudents = state.students;
  const availableStudents = allStudents.filter(s => 
    !teacherClasses.some(c => c.enrolledStudents.includes(s.id))
  );

  const filteredStudents = teacherStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = (studentId: string) => {
    if (!selectedClass) {
      toast.error('Please select a class first');
      return;
    }

    const classToUpdate = state.classes.find(c => c.id === selectedClass);
    if (!classToUpdate) return;

    const updatedClass = {
      ...classToUpdate,
      enrolledStudents: [...classToUpdate.enrolledStudents, studentId]
    };

    dispatch({ type: 'UPDATE_CLASS', payload: updatedClass });
    toast.success('Student added to class successfully');
    setIsAddModalOpen(false);
  };

  const getStudentClasses = (studentId: string) => {
    return teacherClasses.filter(c => c.enrolledStudents.includes(studentId));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Students</h2>
          <p className="text-sm text-gray-600">
            Students enrolled in your classes
          </p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Student</span>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search Students</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search students by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Student List ({filteredStudents.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredStudents.map((student) => {
              const studentClasses = getStudentClasses(student.id);
              return (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={student.avatar}
                      alt={student.name}
                    />
                    <div>
                      <h3 className="font-medium text-sm">{student.name}</h3>
                      <p className="text-xs text-gray-500">{student.email}</p>
                      <div className="flex gap-1 mt-1">
                        {studentClasses.map(cls => (
                          <Badge key={cls.id} variant="secondary" className="text-xs">
                            {cls.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Grade {student.grade}</Badge>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add Student to Class"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Class
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Choose a class</option>
              {teacherClasses.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Students
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableStudents.map(student => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <img
                      className="h-8 w-8 rounded-full"
                      src={student.avatar}
                      alt={student.name}
                    />
                    <div>
                      <div className="text-sm font-medium">{student.name}</div>
                      <div className="text-xs text-gray-500">Grade {student.grade}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddStudent(student.id)}
                    disabled={!selectedClass}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TeacherStudentList;
