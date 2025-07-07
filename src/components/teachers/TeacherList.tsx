
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from "sonner";
import Modal from '../common/Modal';
import TeacherForm from './TeacherForm';

const TeacherList = () => {
  const { state, dispatch } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const filteredTeachers = state.teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      dispatch({ type: 'DELETE_TEACHER', payload: teacherId });
      toast.success('Teacher deleted successfully');
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Teachers</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage teacher records and information
          </p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Teacher</span>
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Teachers</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search teachers by name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Teacher List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Faculty Directory</span>
          </CardTitle>
          <CardDescription>
            {filteredTeachers.length} of {state.teachers.length} teachers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={teacher.avatar}
                      alt={teacher.name}
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {teacher.name}
                      </h3>
                      <p className="text-sm text-gray-500">{teacher.email}</p>
                      <p className="text-sm text-gray-500">{teacher.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Badge variant="secondary">
                        {teacher.subject}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{teacher.experience} years exp.</p>
                      <p className="text-xs text-gray-400">
                        ${teacher.salary.toLocaleString()}/year
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(teacher)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(teacher.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <strong>Qualification:</strong> {teacher.qualification}
                    </div>
                    <div>
                      <strong>Classes:</strong> {teacher.classes.length} assigned
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Teacher Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Teacher"
      >
        <TeacherForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Teacher"
      >
        <TeacherForm 
          teacher={editingTeacher} 
          onSuccess={() => setIsEditModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default TeacherList;
