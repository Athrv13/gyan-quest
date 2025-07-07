
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ClassFormProps {
  onSuccess: () => void;
  classData?: any;
}

const ClassForm: React.FC<ClassFormProps> = ({ onSuccess, classData }) => {
  const { state, dispatch } = useData();
  const [formData, setFormData] = useState({
    name: classData?.name || '',
    subject: classData?.subject || '',
    grade: classData?.grade || '',
    teacherId: classData?.teacherId || '',
    room: classData?.room || '',
    schedule: classData?.schedule || '',
    capacity: classData?.capacity || 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.subject || !formData.grade || !formData.teacherId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newClass = {
      id: classData?.id || `class-${Date.now()}`,
      ...formData,
      capacity: Number(formData.capacity),
      enrolledStudents: classData?.enrolledStudents || [],
    };

    if (classData) {
      dispatch({ type: 'UPDATE_CLASS', payload: newClass });
      toast.success('Class updated successfully');
    } else {
      dispatch({ type: 'ADD_CLASS', payload: newClass });
      toast.success('Class added successfully');
    }

    onSuccess();
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Class Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., Advanced Mathematics"
            required
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject *</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="e.g., Mathematics"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="grade">Grade *</Label>
          <Select value={formData.grade} onValueChange={(value) => handleChange('grade', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select grade" />
            </SelectTrigger>
            <SelectContent>
              {[9, 10, 11, 12].map(grade => (
                <SelectItem key={grade} value={grade.toString()}>
                  Grade {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="teacher">Teacher *</Label>
          <Select value={formData.teacherId} onValueChange={(value) => handleChange('teacherId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select teacher" />
            </SelectTrigger>
            <SelectContent>
              {state.teachers.map(teacher => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="room">Room</Label>
          <Input
            id="room"
            value={formData.room}
            onChange={(e) => handleChange('room', e.target.value)}
            placeholder="e.g., Room 101"
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
            min="1"
            max="50"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="schedule">Schedule</Label>
        <Input
          id="schedule"
          value={formData.schedule}
          onChange={(e) => handleChange('schedule', e.target.value)}
          placeholder="e.g., Mon, Wed, Fri 10:00-11:30"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          {classData ? 'Update Class' : 'Add Class'}
        </Button>
      </div>
    </form>
  );
};

export default ClassForm;
