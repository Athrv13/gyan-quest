
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

const AttendanceForm = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [selectedClassId, setSelectedClassId] = useState('');
  const [attendanceData, setAttendanceData] = useState<{[key: string]: 'present' | 'absent' | 'late'}>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const teacher = state.teachers.find(t => t.email === user?.email);
  const teacherClasses = state.classes.filter(c => c.teacherId === teacher?.id);

  const selectedClass = state.classes.find(c => c.id === selectedClassId);
  const enrolledStudents = selectedClass 
    ? state.students.filter(s => selectedClass.enrolledStudents.includes(s.id))
    : [];

  // Check if attendance already exists for this date and class
  const existingAttendance = state.attendance.filter(a => 
    a.classId === selectedClassId && a.date === selectedDate
  );

  useEffect(() => {
    // Pre-populate with existing attendance data
    const existingData: {[key: string]: 'present' | 'absent' | 'late'} = {};
    existingAttendance.forEach(record => {
      existingData[record.studentId] = record.status;
    });
    setAttendanceData(existingData);
  }, [selectedClassId, selectedDate]);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    if (!selectedClassId) {
      toast.error('Please select a class');
      return;
    }

    if (Object.keys(attendanceData).length === 0) {
      toast.error('Please mark attendance for at least one student');
      return;
    }

    setIsSubmitting(true);

    try {
      // Remove existing attendance records for this date and class
      existingAttendance.forEach(record => {
        dispatch({ type: 'DELETE_ATTENDANCE', payload: record.id });
      });

      // Add new attendance records
      const attendanceRecords = Object.entries(attendanceData).map(([studentId, status]) => ({
        id: `${Date.now()}-${studentId}-${Math.random()}`,
        studentId,
        classId: selectedClassId,
        date: selectedDate,
        status
      }));

      attendanceRecords.forEach(record => {
        dispatch({ type: 'ADD_ATTENDANCE', payload: record });
      });

      const presentCount = Object.values(attendanceData).filter(status => status === 'present').length;
      const totalStudents = Object.keys(attendanceData).length;

      toast.success(`Attendance recorded for ${totalStudents} students (${presentCount} present)`);
      
    } catch (error) {
      toast.error('Failed to record attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  const markAllPresent = () => {
    const allPresentData: {[key: string]: 'present' | 'absent' | 'late'} = {};
    enrolledStudents.forEach(student => {
      allPresentData[student.id] = 'present';
    });
    setAttendanceData(allPresentData);
  };

  const getAttendanceStats = () => {
    const total = Object.keys(attendanceData).length;
    const present = Object.values(attendanceData).filter(s => s === 'present').length;
    const absent = Object.values(attendanceData).filter(s => s === 'absent').length;
    const late = Object.values(attendanceData).filter(s => s === 'late').length;
    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Take Attendance</span>
          </CardTitle>
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
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.subject}
                    </SelectItem>
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

          {selectedClass && enrolledStudents.length > 0 && (
            <>
              {/* Quick Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={markAllPresent}
                    className="flex items-center space-x-1"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark All Present</span>
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Present: {stats.present}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Late: {stats.late}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Absent: {stats.absent}</span>
                  </div>
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-3">
                <h3 className="font-medium flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Students in {selectedClass.name} ({enrolledStudents.length})</span>
                </h3>
                {enrolledStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <span className="font-medium">{student.name}</span>
                        <p className="text-sm text-gray-500">Grade {student.grade}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {(['present', 'late', 'absent'] as const).map(status => (
                        <Button
                          key={status}
                          variant={attendanceData[student.id] === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAttendanceChange(student.id, status)}
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
                          {status === 'present' && <CheckCircle className="h-4 w-4 mr-1" />}
                          {status === 'late' && <Clock className="h-4 w-4 mr-1" />}
                          {status === 'absent' && <XCircle className="h-4 w-4 mr-1" />}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleSubmit} 
                className="w-full mt-6" 
                disabled={isSubmitting || Object.keys(attendanceData).length === 0}
              >
                {isSubmitting ? 'Saving...' : 'Save Attendance'}
              </Button>
            </>
          )}

          {selectedClass && enrolledStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No students enrolled in this class</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceForm;
