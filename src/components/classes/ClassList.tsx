
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { toast } from "sonner";
import Modal from '../common/Modal';
import ClassForm from './ClassForm';

const ClassList = () => {
  const { state, dispatch } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  const filteredClasses = state.classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      dispatch({ type: 'DELETE_CLASS', payload: classId });
      toast.success('Class deleted successfully');
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setIsEditModalOpen(true);
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = state.teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'No teacher assigned';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Classes</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage class schedules and assignments
          </p>
        </div>
        <Button 
          className="flex items-center space-x-2"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Add Class</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Search Classes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search classes by name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Class Directory</span>
          </CardTitle>
          <CardDescription>
            {filteredClasses.length} of {state.classes.length} classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {filteredClasses.map((cls) => (
              <div
                key={cls.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{cls.name}</h3>
                        <p className="text-sm text-gray-500">{cls.subject} - Grade {cls.grade}</p>
                        <p className="text-sm text-gray-500">{cls.schedule}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Teacher:</span>
                        <p className="text-gray-600">{getTeacherName(cls.teacherId)}</p>
                      </div>
                      <div>
                        <span className="font-medium">Room:</span>
                        <p className="text-gray-600">{cls.room}</p>
                      </div>
                      <div>
                        <span className="font-medium">Capacity:</span>
                        <p className="text-gray-600">{cls.capacity} students</p>
                      </div>
                      <div>
                        <span className="font-medium">Enrolled:</span>
                        <p className="text-gray-600">{cls.enrolledStudents.length} students</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(cls)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(cls.id)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Class Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Class"
      >
        <ClassForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Class Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Class"
      >
        <ClassForm 
          classData={editingClass} 
          onSuccess={() => setIsEditModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default ClassList;
