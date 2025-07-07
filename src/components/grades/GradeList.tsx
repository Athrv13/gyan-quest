
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Filter } from 'lucide-react';

const GradeList = () => {
  const { state } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  const filteredGrades = state.grades.filter(grade => {
    const student = state.students.find(s => s.id === grade.studentId);
    const cls = state.classes.find(c => c.id === grade.classId);
    
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGradeFilter = selectedGrade === '' || student?.grade === selectedGrade;
    
    return matchesSearch && matchesGradeFilter;
  });

  const grades = [...new Set(state.students.map(s => s.grade))].sort();

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Grades</h2>
          <p className="mt-1 text-sm text-gray-600">
            View and manage student grades
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Grade Records</span>
          </CardTitle>
          <CardDescription>
            {filteredGrades.length} of {state.grades.length} grade records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Subject</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Score</th>
                  <th className="text-left p-3 font-medium">Grade</th>
                  <th className="text-left p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade) => {
                  const percentage = getGradePercentage(grade.score, grade.maxScore);
                  return (
                    <tr key={grade.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{getStudentName(grade.studentId)}</td>
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GradeList;
