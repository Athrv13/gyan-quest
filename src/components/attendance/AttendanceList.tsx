
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Filter } from 'lucide-react';

const AttendanceList = () => {
  const { state } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredAttendance = state.attendance.filter(attendance => {
    const student = state.students.find(s => s.id === attendance.studentId);
    const cls = state.classes.find(c => c.id === attendance.classId);
    
    const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = selectedDate === '' || attendance.date === selectedDate;
    
    return matchesSearch && matchesDate;
  });

  const dates = [...new Set(state.attendance.map(a => a.date))].sort().reverse();

  const getStudentName = (studentId: string) => {
    const student = state.students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getClassName = (classId: string) => {
    const cls = state.classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Attendance</h2>
          <p className="mt-1 text-sm text-gray-600">
            View and manage student attendance records
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
                placeholder="Search by student name or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">All Dates</option>
                {dates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Attendance Records</span>
          </CardTitle>
          <CardDescription>
            {filteredAttendance.length} of {state.attendance.length} attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Student</th>
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((attendance) => (
                  <tr key={attendance.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{getStudentName(attendance.studentId)}</td>
                    <td className="p-3">{getClassName(attendance.classId)}</td>
                    <td className="p-3">{attendance.date}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(attendance.status)}>
                        {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceList;
