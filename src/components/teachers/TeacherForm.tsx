
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface TeacherFormProps {
  teacher?: any;
  onSuccess?: () => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacher, onSuccess }) => {
  const { dispatch } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    experience: '',
    qualification: '',
    salary: ''
  });

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || '',
        email: teacher.email || '',
        phone: teacher.phone || '',
        subject: teacher.subject || '',
        experience: teacher.experience?.toString() || '',
        qualification: teacher.qualification || '',
        salary: teacher.salary?.toString() || ''
      });
    }
  }, [teacher]);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English Literature', 'History', 'Geography'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (teacher) {
      // Update existing teacher
      const updatedTeacher = {
        ...teacher,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        experience: parseInt(formData.experience) || 0,
        qualification: formData.qualification,
        salary: parseInt(formData.salary) || 50000,
      };
      dispatch({ type: 'UPDATE_TEACHER', payload: updatedTeacher });
      toast.success('Teacher updated successfully');
    } else {
      // Add new teacher
      const newTeacher = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        experience: parseInt(formData.experience) || 0,
        qualification: formData.qualification,
        salary: parseInt(formData.salary) || 50000,
        classes: [],
        avatar: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1494790108755-2616b612b786' : '1507003211169-0a1dd7228f2d'}?w=150&h=150&fit=crop&crop=face`
      };
      dispatch({ type: 'ADD_TEACHER', payload: newTeacher });
      toast.success('Teacher added successfully');
    }
    
    if (!teacher) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        experience: '',
        qualification: '',
        salary: ''
      });
    }
    
    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-2xl">
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
            <label className="block text-sm font-medium mb-2">Subject *</label>
            <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Experience (years)</label>
            <Input
              type="number"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              placeholder="Years of experience"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Salary</label>
            <Input
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
              placeholder="Annual salary"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Qualification</label>
          <Input
            value={formData.qualification}
            onChange={(e) => setFormData({...formData, qualification: e.target.value})}
            placeholder="e.g., MS in Physics, PhD in Mathematics"
          />
        </div>

        <Button type="submit" className="w-full">
          {teacher ? 'Update Teacher' : 'Add Teacher'}
        </Button>
      </form>
    </div>
  );
};

export default TeacherForm;
