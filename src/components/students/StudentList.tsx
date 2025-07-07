
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from "sonner";
import Modal from '../common/Modal';
import StudentForm from './StudentForm';

const StudentList = () => {
  const { state, dispatch } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const filteredStudents = state.students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === '' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const grades = [...new Set(state.students.map(s => s.grade))].sort();

  const handleDelete = (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      dispatch({ type: 'DELETE_STUDENT', payload: studentId });
      toast.success('Student deleted successfully');
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const getStudentGrades = (studentId: string) => {
    const studentGrades = state.grades.filter(g => g.studentId === studentId);
    if (studentGrades.length === 0) return 'No grades';
    const average = studentGrades.reduce((acc, grade) => acc + (grade.score / grade.maxScore * 100), 0) / studentGrades.length;
    return `${Math.round(average)}% avg`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Students</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage student records and information
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
              >
                <option value="">All Grades</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>Grade {grade}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Student Directory</span>
          </CardTitle>
          <CardDescription>
            {filteredStudents.length} of {state.students.length} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={student.avatar}
                      alt={student.name}
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {student.name}
                      </h3>
                      <p className="text-sm text-gray-500">{student.email}</p>
                      <p className="text-sm text-gray-500">{student.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant="secondary">
                        Grade {student.grade}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{student.class}</p>
                      <p className="text-xs text-gray-400">
                        {getStudentGrades(student.id)}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(student)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(student.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <strong>Parent:</strong> {student.parentName}
                    </div>
                    <div>
                      <strong>Parent Phone:</strong> {student.parentPhone}
                    </div>
                    <div>
                      <strong>Address:</strong> {student.address}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Student"
      >
        <StudentForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Student Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Student"
      >
        <StudentForm 
          student={editingStudent} 
          onSuccess={() => setIsEditModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default StudentList;
