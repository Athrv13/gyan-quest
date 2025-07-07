
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AttendanceForm = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [attendanceData, setAttendanceData] = useState<{[key: string]: 'present' | 'absent' | 'late'}>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const teacher = state.teachers.find(t => t.email === user?.email);
  const teacherClasses = state.classes.filter(c => c.teacherId === teacher?.id);

  const selectedClass = state.classes.find(c => c.id === selectedClassId);
  const enrolledStudents = selectedClass 
    ? state.students.filter(s => selectedClass.enrolledStudents.includes(s.id))
    : [];

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = () => {
    if (!selectedClassId) {
      toast.error('Please select a class');
      return;
    }

    const attendanceRecords = Object.entries(attendanceData).map(([studentId, status]) => ({
      id: `${Date.now()}-${studentId}`,
      studentId,
      classId: selectedClassId,
      date: selectedDate,
      status
    }));

    attendanceRecords.forEach(record => {
      dispatch({ type: 'ADD_ATTENDANCE', payload: record });
    });

    toast.success('Attendance recorded successfully');
    setAttendanceData({});
    setSelectedClassId('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Take Attendance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Class</label>
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
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
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {selectedClass && (
          <div className="space-y-3">
            <h3 className="font-medium">Students in {selectedClass.name}</h3>
            {enrolledStudents.map(student => (
              <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium">{student.name}</span>
                </div>
                <div className="flex space-x-2">
                  {['present', 'absent', 'late'].map(status => (
                    <Button
                      key={status}
                      variant={attendanceData[student.id] === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAttendanceChange(student.id, status as any)}
                      className={
                        attendanceData[student.id] === status
                          ? status === 'present' 
                            ? 'bg-green-600 hover:bg-green-700'
                            : status === 'late'
                            ? 'bg-yellow-600 hover:bg-yellow-700'
                            : 'bg-red-600 hover:bg-red-700'
                          : ''
                      }
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            <Button onClick={handleSubmit} className="w-full mt-4">
              Save Attendance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;
