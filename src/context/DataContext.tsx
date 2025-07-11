import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  class: string;
  avatar: string;
  dateOfBirth: string;
  address: string;
  parentName: string;
  parentPhone: string;
  enrollmentDate: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  experience: number;
  avatar: string;
  qualification: string;
  classes: string[];
  salary: number;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  subject: string;
  teacherId: string;
  schedule: string;
  room: string;
  capacity: number;
  enrolledStudents: string[];
}

export interface Grade {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  score: number;
  maxScore: number;
  date: string;
  type: 'quiz' | 'exam' | 'assignment';
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

interface StudentQuery {
  id: string;
  studentId: string;
  teacherId: string;
  classId: string;
  message: string;
  response?: string;
  date: string;
  status: 'pending' | 'answered';
}

interface DataState {
  students: Student[];
  teachers: Teacher[];
  classes: Class[];
  grades: Grade[];
  attendance: Attendance[];
  studentQueries: StudentQuery[];
}

type DataAction =
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'ADD_TEACHER'; payload: Teacher }
  | { type: 'UPDATE_TEACHER'; payload: Teacher }
  | { type: 'DELETE_TEACHER'; payload: string }
  | { type: 'ADD_CLASS'; payload: Class }
  | { type: 'UPDATE_CLASS'; payload: Class }
  | { type: 'DELETE_CLASS'; payload: string }
  | { type: 'ADD_GRADE'; payload: Grade }
  | { type: 'UPDATE_GRADE'; payload: Grade }
  | { type: 'ADD_ATTENDANCE'; payload: Attendance }
  | { type: 'UPDATE_ATTENDANCE'; payload: Attendance }
  | { type: 'DELETE_ATTENDANCE'; payload: string }
  | { type: 'ADD_STUDENT_QUERY'; payload: StudentQuery }
  | { type: 'UPDATE_STUDENT_QUERY'; payload: StudentQuery };

const initialState: DataState = {
  students: [
    {
      id: '1',
      name: 'Emma Thompson',
      email: 'emma.thompson@student.edu',
      phone: '(555) 123-4567',
      grade: '10',
      class: 'Math Advanced',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: '2008-03-15',
      address: '123 Maple St, Springfield',
      parentName: 'John Thompson',
      parentPhone: '(555) 123-4568',
      enrollmentDate: '2023-09-01'
    },
    {
      id: '2',
      name: 'Liam Rodriguez',
      email: 'liam.rodriguez@student.edu',
      phone: '(555) 234-5678',
      grade: '11',
      class: 'Physics Honors',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: '2007-07-22',
      address: '456 Oak Ave, Springfield',
      parentName: 'Maria Rodriguez',
      parentPhone: '(555) 234-5679',
      enrollmentDate: '2022-09-01'
    },
    {
      id: '3',
      name: 'Sophia Chen',
      email: 'sophia.chen@student.edu',
      phone: '(555) 345-6789',
      grade: '12',
      class: 'Chemistry AP',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: '2006-11-08',
      address: '789 Pine Rd, Springfield',
      parentName: 'David Chen',
      parentPhone: '(555) 345-6790',
      enrollmentDate: '2021-09-01'
    },
    {
      id: '4',
      name: 'Noah Williams',
      email: 'noah.williams@student.edu',
      phone: '(555) 456-7890',
      grade: '9',
      class: 'English Literature',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: '2009-01-14',
      address: '321 Elm St, Springfield',
      parentName: 'Lisa Williams',
      parentPhone: '(555) 456-7891',
      enrollmentDate: '2024-09-01'
    },
    {
      id: '5',
      name: 'Ava Johnson',
      email: 'ava.johnson@student.edu',
      phone: '(555) 567-8901',
      grade: '10',
      class: 'Biology',
      avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: '2008-05-20',
      address: '654 Cedar Ave, Springfield',
      parentName: 'Robert Johnson',
      parentPhone: '(555) 567-8902',
      enrollmentDate: '2023-09-01'
    },
    {
      id: '6',
      name: 'Mason Davis',
      email: 'mason.davis@student.edu',
      phone: '(555) 678-9012',
      grade: '11',
      class: 'History AP',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: '2007-09-12',
      address: '987 Birch St, Springfield',
      parentName: 'Jennifer Davis',
      parentPhone: '(555) 678-9013',
      enrollmentDate: '2022-09-01'
    },
    {
      id: '7',
      name: 'Isabella Garcia',
      email: 'isabella.garcia@student.edu',
      phone: '(555) 789-0123',
      grade: '10',
      class: 'Art Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      dateOfBirth: '2008-02-28',
      address: '456 Willow Ave, Springfield',
      parentName: 'Carlos Garcia',
      parentPhone: '(555) 789-0124',
      enrollmentDate: '2023-09-01'
    }
  ],
  teachers: [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '(555) 111-2222',
      subject: 'Mathematics',
      experience: 8,
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      qualification: 'PhD in Mathematics',
      classes: ['1', '2'],
      salary: 65000
    },
    {
      id: '2',
      name: 'Mr. Michael Brown',
      email: 'michael.brown@school.edu',
      phone: '(555) 222-3333',
      subject: 'Physics',
      experience: 12,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      qualification: 'MS in Physics',
      classes: ['3', '4'],
      salary: 62000
    },
    {
      id: '3',
      name: 'Ms. Emily Davis',
      email: 'emily.davis@school.edu',
      phone: '(555) 333-4444',
      subject: 'Chemistry',
      experience: 6,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      qualification: 'MS in Chemistry',
      classes: ['5'],
      salary: 58000
    },
    {
      id: '4',
      name: 'Mr. James Wilson',
      email: 'james.wilson@school.edu',
      phone: '(555) 444-5555',
      subject: 'English Literature',
      experience: 10,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      qualification: 'MA in English Literature',
      classes: ['6', '7'],
      salary: 60000
    },
    {
      id: '5',
      name: 'Dr. Lisa Anderson',
      email: 'lisa.anderson@school.edu',
      phone: '(555) 555-6666',
      subject: 'Biology',
      experience: 15,
      avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
      qualification: 'PhD in Biology',
      classes: ['8'],
      salary: 68000
    },
    {
      id: '6',
      name: 'Mr. Robert Taylor',
      email: 'robert.taylor@school.edu',
      phone: '(555) 666-7777',
      subject: 'History',
      experience: 9,
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      qualification: 'MA in History',
      classes: ['9'],
      salary: 59000
    },
    {
      id: '7',
      name: 'Ms. Maria Gonzalez',
      email: 'maria.gonzalez@school.edu',
      phone: '(555) 777-8888',
      subject: 'Art',
      experience: 7,
      avatar: 'https://images.unsplash.com/photo-1594736797933-d0401ba0ad65?w=150&h=150&fit=crop&crop=face',
      qualification: 'MFA in Fine Arts',
      classes: ['10'],
      salary: 55000
    }
  ],
  classes: [
    {
      id: '1',
      name: 'Math Advanced',
      grade: '10',
      subject: 'Mathematics',
      teacherId: '1',
      schedule: 'Mon, Wed, Fri 9:00-10:00 AM',
      room: 'Room 101',
      capacity: 30,
      enrolledStudents: ['1', '5']
    },
    {
      id: '2',
      name: 'Algebra II',
      grade: '11',
      subject: 'Mathematics',
      teacherId: '1',
      schedule: 'Tue, Thu 10:00-11:00 AM',
      room: 'Room 102',
      capacity: 25,
      enrolledStudents: ['2', '6']
    },
    {
      id: '3',
      name: 'Physics Honors',
      grade: '11',
      subject: 'Physics',
      teacherId: '2',
      schedule: 'Mon, Wed, Fri 11:00-12:00 PM',
      room: 'Lab 201',
      capacity: 20,
      enrolledStudents: ['2']
    },
    {
      id: '4',
      name: 'General Physics',
      grade: '10',
      subject: 'Physics',
      teacherId: '2',
      schedule: 'Tue, Thu 1:00-2:00 PM',
      room: 'Lab 202',
      capacity: 25,
      enrolledStudents: ['1']
    },
    {
      id: '5',
      name: 'Chemistry AP',
      grade: '12',
      subject: 'Chemistry',
      teacherId: '3',
      schedule: 'Mon, Wed, Fri 2:00-3:00 PM',
      room: 'Lab 301',
      capacity: 18,
      enrolledStudents: ['3']
    },
    {
      id: '6',
      name: 'English Literature',
      grade: '9',
      subject: 'English',
      teacherId: '4',
      schedule: 'Daily 9:00-10:00 AM',
      room: 'Room 401',
      capacity: 28,
      enrolledStudents: ['4']
    },
    {
      id: '7',
      name: 'Advanced Writing',
      grade: '12',
      subject: 'English',
      teacherId: '4',
      schedule: 'Tue, Thu 11:00-12:00 PM',
      room: 'Room 402',
      capacity: 22,
      enrolledStudents: ['3']
    },
    {
      id: '8',
      name: 'Biology',
      grade: '10',
      subject: 'Biology',
      teacherId: '5',
      schedule: 'Mon, Wed, Fri 10:00-11:00 AM',
      room: 'Lab 501',
      capacity: 24,
      enrolledStudents: ['5', '1', '7']
    },
    {
      id: '9',
      name: 'History AP',
      grade: '11',
      subject: 'History',
      teacherId: '6',
      schedule: 'Tue, Thu 2:00-3:00 PM',
      room: 'Room 601',
      capacity: 25,
      enrolledStudents: ['6', '2']
    },
    {
      id: '10',
      name: 'Art Studio',
      grade: '10',
      subject: 'Art',
      teacherId: '7',
      schedule: 'Mon, Wed 3:00-4:00 PM',
      room: 'Art Studio',
      capacity: 20,
      enrolledStudents: ['7']
    }
  ],
  grades: [
    {
      id: '1',
      studentId: '1',
      classId: '1',
      subject: 'Mathematics',
      score: 92,
      maxScore: 100,
      date: '2024-01-15',
      type: 'exam'
    },
    {
      id: '2',
      studentId: '2',
      classId: '3',
      subject: 'Physics',
      score: 88,
      maxScore: 100,
      date: '2024-01-20',
      type: 'quiz'
    },
    {
      id: '3',
      studentId: '3',
      classId: '5',
      subject: 'Chemistry',
      score: 95,
      maxScore: 100,
      date: '2024-01-25',
      type: 'assignment'
    },
    {
      id: '4',
      studentId: '5',
      classId: '8',
      subject: 'Biology',
      score: 89,
      maxScore: 100,
      date: '2024-01-30',
      type: 'quiz'
    },
    {
      id: '5',
      studentId: '6',
      classId: '9',
      subject: 'History',
      score: 91,
      maxScore: 100,
      date: '2024-02-01',
      type: 'exam'
    }
  ],
  attendance: [
    {
      id: '1',
      studentId: '1',
      classId: '1',
      date: '2024-01-15',
      status: 'present'
    },
    {
      id: '2',
      studentId: '2',
      classId: '3',
      date: '2024-01-15',
      status: 'present'
    },
    {
      id: '3',
      studentId: '3',
      classId: '5',
      date: '2024-01-15',
      status: 'late'
    },
    {
      id: '4',
      studentId: '5',
      classId: '8',
      date: '2024-01-16',
      status: 'present'
    },
    {
      id: '5',
      studentId: '6',
      classId: '9',
      date: '2024-01-16',
      status: 'absent'
    }
  ],
  studentQueries: [
    {
      id: '1',
      studentId: '1',
      teacherId: '1',
      classId: '1',
      message: 'I need help understanding quadratic equations.',
      date: '2024-01-20',
      status: 'pending'
    },
    {
      id: '2',
      studentId: '2',
      teacherId: '2',
      classId: '3',
      message: 'Could you explain the concept of momentum again?',
      response: 'Sure! Momentum is mass times velocity. We can discuss this in more detail after class.',
      date: '2024-01-18',
      status: 'answered'
    }
  ]
};

const dataReducer = (state: DataState, action: DataAction): DataState => {
  switch (action.type) {
    case 'ADD_STUDENT':
      return { ...state, students: [...state.students, action.payload] };
    case 'UPDATE_STUDENT':
      return {
        ...state,
        students: state.students.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_STUDENT':
      return {
        ...state,
        students: state.students.filter(s => s.id !== action.payload)
      };
    case 'ADD_TEACHER':
      return { ...state, teachers: [...state.teachers, action.payload] };
    case 'UPDATE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'DELETE_TEACHER':
      return {
        ...state,
        teachers: state.teachers.filter(t => t.id !== action.payload)
      };
    case 'ADD_CLASS':
      return {
        ...state,
        classes: [...state.classes, action.payload]
      };
    case 'UPDATE_CLASS':
      return {
        ...state,
        classes: state.classes.map(cls => 
          cls.id === action.payload.id ? action.payload : cls
        )
      };
    case 'DELETE_CLASS':
      return {
        ...state,
        classes: state.classes.filter(cls => cls.id !== action.payload)
      };
    case 'ADD_GRADE':
      return { ...state, grades: [...state.grades, action.payload] };
    case 'UPDATE_GRADE':
      return {
        ...state,
        grades: state.grades.map(g => g.id === action.payload.id ? action.payload : g)
      };
    case 'ADD_ATTENDANCE':
      return { ...state, attendance: [...state.attendance, action.payload] };
    case 'UPDATE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.map(a => a.id === action.payload.id ? action.payload : a)
      };
    case 'DELETE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.filter(att => att.id !== action.payload)
      };
    case 'ADD_STUDENT_QUERY':
      return { ...state, studentQueries: [...state.studentQueries, action.payload] };
    case 'UPDATE_STUDENT_QUERY':
      return {
        ...state,
        studentQueries: state.studentQueries.map(q => q.id === action.payload.id ? action.payload : q)
      };
    default:
      return state;
  }
};

interface DataContextType {
  state: DataState;
  dispatch: React.Dispatch<DataAction>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export type { StudentQuery };
