
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface StudentFormProps {
  onSuccess?: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSuccess }) => {
  const { state, dispatch } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    dateOfBirth: '',
    address: '',
    parentName: '',
    parentPhone: '',
    class: ''
  });

  const grades = ['9', '10', '11', '12'];
  const classes = [...new Set(state.classes.map(c => c.name))];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.grade) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newStudent = {
      id: Date.now().toString(),
      ...formData,
      avatar: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1494790108755-2616b612b786' : '1507003211169-0a1dd7228f2d'}?w=150&h=150&fit=crop&crop=face`,
      enrollmentDate: new Date().toISOString().split('T')[0]
    };

    dispatch({ type: 'ADD_STUDENT', payload: newStudent });
    toast.success('Student added successfully');
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      grade: '',
      dateOfBirth: '',
      address: '',
      parentName: '',
      parentPhone: '',
      class: ''
    });
    
    if (onSuccess) onSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Student</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Grade *</label>
              <Select value={formData.grade} onValueChange={(value) => setFormData({...formData, grade: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date of Birth</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Class</label>
              <Select value={formData.class} onValueChange={(value) => setFormData({...formData, class: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Enter address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Parent Name</label>
              <Input
                value={formData.parentName}
                onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                placeholder="Enter parent name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Parent Phone</label>
              <Input
                value={formData.parentPhone}
                onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                placeholder="Enter parent phone"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Add Student</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentForm;
