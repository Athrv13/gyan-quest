
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const GradeForm = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    studentId: '',
    classId: '',
    subject: '',
    score: '',
    maxScore: '100',
    type: 'quiz'
  });

  const teacher = state.teachers.find(t => t.email === user?.email);
  const teacherClasses = state.classes.filter(c => c.teacherId === teacher?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.classId || !formData.score) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedClass = state.classes.find(c => c.id === formData.classId);
    const newGrade = {
      id: Date.now().toString(),
      studentId: formData.studentId,
      classId: formData.classId,
      subject: selectedClass?.subject || formData.subject,
      score: parseInt(formData.score),
      maxScore: parseInt(formData.maxScore),
      date: new Date().toISOString().split('T')[0],
      type: formData.type as 'quiz' | 'exam' | 'assignment'
    };

    dispatch({ type: 'ADD_GRADE', payload: newGrade });
    toast.success('Grade recorded successfully');
    setFormData({
      studentId: '',
      classId: '',
      subject: '',
      score: '',
      maxScore: '100',
      type: 'quiz'
    });
  };

  const selectedClass = state.classes.find(c => c.id === formData.classId);
  const enrolledStudents = selectedClass 
    ? state.students.filter(s => selectedClass.enrolledStudents.includes(s.id))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Grade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Class</label>
            <Select value={formData.classId} onValueChange={(value) => setFormData({...formData, classId: value, studentId: ''})}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {teacherClasses.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedClass && (
            <div>
              <label className="block text-sm font-medium mb-2">Student</label>
              <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {enrolledStudents.map(student => (
                    <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Grade Type</label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Score</label>
              <Input
                type="number"
                value={formData.score}
                onChange={(e) => setFormData({...formData, score: e.target.value})}
                placeholder="Enter score"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Max Score</label>
              <Input
                type="number"
                value={formData.maxScore}
                onChange={(e) => setFormData({...formData, maxScore: e.target.value})}
                placeholder="Enter max score"
                min="1"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Record Grade</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GradeForm;
