
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Filter, Edit } from 'lucide-react';
import { toast } from "sonner";
import Modal from '../common/Modal';

const AttendanceList = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);

  // Filter attendance based on user role
  const getFilteredAttendance = () => {
    let attendanceToShow = state.attendance;

    if (user?.role === 'teacher') {
      const teacher = state.teachers.find(t => t.email === user.email);
      const teacherClasses = state.classes.filter(c => c.teacherId === teacher?.id);
      attendanceToShow = state.attendance.filter(a => 
        teacherClasses.some(c => c.id === a.classId)
      );
    } else if (user?.role === 'student') {
      const student = state.students.find(s => s.email === user.email);
      attendanceToShow = state.attendance.filter(a => a.studentId === student?.id);
    }

    return attendanceToShow.filter(attendance => {
      const student = state.students.find(s => s.id === attendance.studentId);
      const cls = state.classes.find(c => c.id === attendance.classId);
      
      const matchesSearch = student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cls?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = selectedDate === '' || attendance.date === selectedDate;
      
      return matchesSearch && matchesDate;
    });
  };

  const filteredAttendance = getFilteredAttendance();
  const dates = [...new Set(state.attendance.map(a => a.date))].sort().reverse();

  const handleEditAttendance = (attendance) => {
    setEditingAttendance(attendance);
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

  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {user?.role === 'student' ? 'My Attendance' : 'Attendance'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {user?.role === 'student' ? 'View your attendance records' : 'View and manage student attendance records'}
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
            {filteredAttendance.length} attendance records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  {user?.role !== 'student' && <th className="text-left p-3 font-medium">Student</th>}
                  <th className="text-left p-3 font-medium">Class</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  {canEdit && <th className="text-left p-3 font-medium">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((attendance) => (
                  <tr key={attendance.id} className="border-b hover:bg-gray-50">
                    {user?.role !== 'student' && <td className="p-3">{getStudentName(attendance.studentId)}</td>}
                    <td className="p-3">{getClassName(attendance.classId)}</td>
                    <td className="p-3">{attendance.date}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(attendance.status)}>
                        {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                      </Badge>
                    </td>
                    {canEdit && (
                      <td className="p-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAttendance(attendance)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Attendance Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Attendance"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={editingAttendance?.status || ''}
              onChange={(e) => setEditingAttendance({...editingAttendance, status: e.target.value})}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={() => {
                dispatch({ type: 'UPDATE_ATTENDANCE', payload: editingAttendance });
                toast.success('Attendance updated successfully');
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

export default AttendanceList;
