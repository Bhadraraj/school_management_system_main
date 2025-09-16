// Mock data for demo purposes when Supabase is not configured
export const mockData = {
  students: [
    {
      id: 'student-1',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 234 567 8901',
      class_id: 'class-1',
      roll_number: '001',
      date_of_birth: '2008-05-15',
      address: '123 Main St, City, State 12345',
      parent_id: 'parent-1',
      admission_date: '2023-01-15',
      status: 'active',
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      created_at: '2023-01-15T00:00:00Z',
      updated_at: '2023-01-15T00:00:00Z',
      classes: { id: 'class-1', name: 'Grade 10A' },
      profiles: { id: 'parent-1', name: 'Robert Johnson', phone: '+1 234 567 8900' }
    },
    {
      id: 'student-2',
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1 234 567 8902',
      class_id: 'class-2',
      roll_number: '002',
      date_of_birth: '2008-03-20',
      address: '456 Oak Ave, City, State 12345',
      parent_id: 'parent-2',
      admission_date: '2023-01-15',
      status: 'active',
      avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
      created_at: '2023-01-15T00:00:00Z',
      updated_at: '2023-01-15T00:00:00Z',
      classes: { id: 'class-2', name: 'Grade 10B' },
      profiles: { id: 'parent-2', name: 'Mary Smith', phone: '+1 234 567 8905' }
    },
    {
      id: 'student-3',
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1 234 567 8903',
      class_id: 'class-3',
      roll_number: '003',
      date_of_birth: '2009-07-10',
      address: '789 Pine St, City, State 12345',
      parent_id: 'parent-1',
      admission_date: '2023-01-15',
      status: 'active',
      avatar_url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      created_at: '2023-01-15T00:00:00Z',
      updated_at: '2023-01-15T00:00:00Z',
      classes: { id: 'class-3', name: 'Grade 9A' },
      profiles: { id: 'parent-1', name: 'Robert Johnson', phone: '+1 234 567 8900' }
    }
  ],

  teachers: [
    {
      id: 'teacher-1',
      profile_id: 'profile-teacher-1',
      subject_id: 'subject-1',
      experience_years: 8,
      qualification: 'Ph.D. in Mathematics',
      join_date: '2020-08-15',
      status: 'active',
      created_at: '2020-08-15T00:00:00Z',
      updated_at: '2020-08-15T00:00:00Z',
      profiles: {
        id: 'profile-teacher-1',
        name: 'Dr. Sarah Wilson',
        email: 'sarah.wilson@school.edu',
        phone: '+1 234 567 8901',
        avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      subjects: { id: 'subject-1', name: 'Mathematics', code: 'MATH101' },
      classes: [{ id: 'class-1', name: 'Grade 10A' }]
    },
    {
      id: 'teacher-2',
      profile_id: 'profile-teacher-2',
      subject_id: 'subject-2',
      experience_years: 12,
      qualification: 'M.Sc. Physics',
      join_date: '2018-01-10',
      status: 'active',
      created_at: '2018-01-10T00:00:00Z',
      updated_at: '2018-01-10T00:00:00Z',
      profiles: {
        id: 'profile-teacher-2',
        name: 'Mr. John Davis',
        email: 'john.davis@school.edu',
        phone: '+1 234 567 8903',
        avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      subjects: { id: 'subject-2', name: 'Physics', code: 'PHY201' },
      classes: [{ id: 'class-2', name: 'Grade 10B' }]
    }
  ],

  classes: [
    {
      id: 'class-1',
      name: 'Grade 10A',
      teacher_id: 'teacher-1',
      subject_id: 'subject-1',
      room: 'Room 101',
      schedule: 'Mon-Fri 9:00-10:00 AM',
      capacity: 32,
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      teachers: {
        id: 'teacher-1',
        profiles: { name: 'Dr. Sarah Wilson' }
      },
      subjects: { id: 'subject-1', name: 'Mathematics', code: 'MATH101' },
      students: [{ id: 'student-1' }]
    },
    {
      id: 'class-2',
      name: 'Grade 10B',
      teacher_id: 'teacher-2',
      subject_id: 'subject-2',
      room: 'Room 102',
      schedule: 'Mon-Fri 10:00-11:00 AM',
      capacity: 28,
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      teachers: {
        id: 'teacher-2',
        profiles: { name: 'Mr. John Davis' }
      },
      subjects: { id: 'subject-2', name: 'Physics', code: 'PHY201' },
      students: [{ id: 'student-2' }]
    }
  ],

  subjects: [
    {
      id: 'subject-1',
      name: 'Mathematics',
      code: 'MATH101',
      credits: 4,
      description: 'Advanced Mathematics for Grade 10',
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      teachers: [{
        id: 'teacher-1',
        profiles: { name: 'Dr. Sarah Wilson' }
      }],
      classes: [{ id: 'class-1', name: 'Grade 10A' }]
    },
    {
      id: 'subject-2',
      name: 'Physics',
      code: 'PHY201',
      credits: 4,
      description: 'Physics fundamentals and applications',
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
      teachers: [{
        id: 'teacher-2',
        profiles: { name: 'Mr. John Davis' }
      }],
      classes: [{ id: 'class-2', name: 'Grade 10B' }]
    }
  ],

  fees: [
    {
      id: 'fee-1',
      student_id: 'student-1',
      fee_type: 'tuition',
      amount: 2000.00,
      due_date: '2024-02-01',
      paid_date: '2024-01-25',
      status: 'paid',
      payment_method: 'bank_transfer',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-25T00:00:00Z',
      students: {
        id: 'student-1',
        name: 'Alice Johnson',
        roll_number: '001',
        avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        classes: { name: 'Grade 10A' }
      }
    },
    {
      id: 'fee-2',
      student_id: 'student-2',
      fee_type: 'tuition',
      amount: 2000.00,
      due_date: '2024-02-01',
      status: 'unpaid',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      students: {
        id: 'student-2',
        name: 'Bob Smith',
        roll_number: '002',
        avatar_url: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
        classes: { name: 'Grade 10B' }
      }
    }
  ],

  dashboardStats: {
    students: 1234,
    teachers: 89,
    parents: 567,
    earnings: 45678,
    expenses: 23456,
    attendanceRate: 94
  }
};

// Mock API delay to simulate real API calls
export const mockApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));