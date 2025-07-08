
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Filter, Edit, Plus } from 'lucide-react';
import { toast } from "sonner";
import Modal from '../common/Modal';

const GradeList = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);

  // Filter grades based on user role
  const getFilteredGrades = () => {
    let gradesToShow = state.grades;

    if (user?.role === 'teacher') {
      const teacher = state.teachers.find(t => t.email === user.email);
      const teacherClasses = state.classes.filter(c => c.teacherId === teacher?.id);
      gradesToShow = state.grades.filter(g => 
        teacherClasses.some(c => c.id === g.classId)
      );
    } else if (user?.role === 'student') {
      const student = state.students.find(s => s.email === user.email);
      gradesToShow = state.grades.filter(g => g.studentId === student?.id);
    }

    return gradesToShow.filter(grade => {
      const student = state.students.find(s => s.id === grade.studentId);
      const cls = state.classes.find(c => c.id === grade.classId);
      
      const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cls?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grade.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGradeFilter = selectedGrade === '' || student?.grade === selectedGrade;
      
      return matchesSearch && matchesGradeFilter;
    });
  };

  const filteredGrades = getFilteredGrades();
  const grades = [...new Set(state.students.map(s => s.grade))].sort();

  const handleEditGrade = (grade) => {
    setEditingGrade(grade);
    setIsEditModalOpen(true);
  };

  const getStudentName = (studentId: string) => {
    const student = state.students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getClassName = (classId: string) => {
    const cls = state.classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
  };

  const getGradePercentage = (score: number, maxScore: number) => {
    return Math.round((score / maxScore) * 100);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-blue-100 text-blue-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {user?.role === 'student' ? 'My Grades' : 'Grades'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {user?.role === 'student' ? 'View your academic performance' : 'View and manage student grades'}
          </p>
        </div>
      </div>

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
                placeholder="Search by student name, class, or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {user?.role !== 'student' && (
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
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Grade Records</span>
          </CardTitle>
          <CardDescription>
            {filteredGrades.length} grade records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {user?.role !== 'student' && <th className="text-left p-3 font-medium">Student</th>}
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Score</th>
                  <th className="text-left p-3 font-medium">Grade</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  {canEdit && <th className="text-left p-3 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => {
                  const percentage = getGradePercentage(grade.score, grade.maxScore);
                  return (
                    <tr key={grade.id} className="border-b hover:bg-gray-50">
                      {user?.role !== 'student' && <td className="p-3">{getStudentName(grade.studentId)}</td>}
                      <td className="p-3">{getClassName(grade.classId)}</td>
                      <td className="p-3">{grade.subject}</td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {grade.type.charAt(0).toUpperCase() + grade.type.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">{grade.score}/{grade.maxScore}</td>
                      <td className="p-3">
                        <Badge className={getGradeColor(percentage)}>
                          {percentage}%
                        </Badge>
                      </td>
                      <td className="p-3">{grade.date}</td>
                      {canEdit && (
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditGrade(grade)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Grade Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Grade"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Score
            </label>
            <Input
              type="number"
              value={editingGrade?.score || ''}
              onChange={(e) => setEditingGrade({...editingGrade, score: parseInt(e.target.value)})}
            />
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => {
                dispatch({ type: 'UPDATE_GRADE', payload: editingGrade });
                toast.success('Grade updated successfully');
                setIsEditModalOpen(false);
              }}
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GradeList;
