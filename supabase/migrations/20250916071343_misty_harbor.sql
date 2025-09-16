/*
  # Initial School Management System Schema

  1. New Tables
    - `profiles` - User profiles for admin, teachers, and parents
    - `students` - Student information and details
    - `teachers` - Teacher-specific information
    - `classes` - Class/course information
    - `subjects` - Subject definitions
    - `attendance` - Daily attendance records
    - `exams` - Exam schedules and information
    - `exam_results` - Student exam results and grades
    - `fees` - Fee management and payment tracking
    - `expenses` - School expense tracking
    - `library_books` - Library book management
    - `notices` - School notices and announcements
    - `transport_routes` - Transport route management
    - `hostel_rooms` - Hostel room management
    - `routines` - Class schedule/timetable

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access based on user roles

  3. Relationships
    - Foreign key constraints between related tables
    - Proper indexing for performance
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent');
CREATE TYPE student_status AS ENUM ('active', 'inactive');
CREATE TYPE teacher_status AS ENUM ('active', 'inactive', 'on_leave');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE exam_type AS ENUM ('mid_term', 'final_term', 'class_test', 'quiz', 'assignment');
CREATE TYPE fee_type AS ENUM ('tuition', 'library', 'transport', 'hostel', 'exam', 'activity');
CREATE TYPE payment_status AS ENUM ('paid', 'unpaid', 'partial', 'overdue');
CREATE TYPE room_type AS ENUM ('single', 'double', 'triple', 'quad');
CREATE TYPE priority_level AS ENUM ('high', 'medium', 'low');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'parent',
  avatar_url TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  credits INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  qualification TEXT NOT NULL,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status teacher_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  room TEXT NOT NULL,
  schedule TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 30,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  roll_number TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT NOT NULL,
  parent_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status student_status DEFAULT 'active',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, roll_number)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  marked_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  exam_type exam_type NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_marks INTEGER NOT NULL,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exam Results table
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  obtained_marks INTEGER NOT NULL,
  grade TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

-- Fees table
CREATE TABLE IF NOT EXISTS fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_type fee_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  status payment_status DEFAULT 'unpaid',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT NOT NULL,
  approved_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receipt_number TEXT,
  status TEXT DEFAULT 'paid',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Library Books table
CREATE TABLE IF NOT EXISTS library_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  author TEXT NOT NULL,
  isbn TEXT UNIQUE NOT NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  class_level TEXT NOT NULL,
  publish_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  available_quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notices table
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  priority priority_level NOT NULL DEFAULT 'medium',
  target_audience TEXT NOT NULL DEFAULT 'all',
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transport Routes table
CREATE TABLE IF NOT EXISTS transport_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_name TEXT NOT NULL,
  vehicle_number TEXT UNIQUE NOT NULL,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  current_students INTEGER DEFAULT 0,
  monthly_fare DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hostel Rooms table
CREATE TABLE IF NOT EXISTS hostel_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT UNIQUE NOT NULL,
  room_type room_type NOT NULL,
  capacity INTEGER NOT NULL,
  occupied INTEGER DEFAULT 0,
  monthly_rent DECIMAL(10,2) NOT NULL,
  warden_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  facilities TEXT NOT NULL,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routines table (Class Schedule/Timetable)
CREATE TABLE IF NOT EXISTS routines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 7),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, day_of_week, start_time)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
CREATE INDEX IF NOT EXISTS idx_students_parent_id ON students(parent_id);
CREATE INDEX IF NOT EXISTS idx_teachers_profile_id ON teachers(profile_id);
CREATE INDEX IF NOT EXISTS idx_teachers_subject_id ON teachers(subject_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_exam_results_exam_id ON exam_results(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_student_id ON fees(student_id);
CREATE INDEX IF NOT EXISTS idx_fees_status ON fees(status);
CREATE INDEX IF NOT EXISTS idx_notices_target_audience ON notices(target_audience);
CREATE INDEX IF NOT EXISTS idx_routines_class_id ON routines(class_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE hostel_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for students
CREATE POLICY "Admins and teachers can read all students"
  ON students FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Parents can read their children"
  ON students FOR SELECT
  TO authenticated
  USING (
    parent_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- RLS Policies for teachers
CREATE POLICY "Admins can manage teachers"
  ON teachers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can read own data"
  ON teachers FOR SELECT
  TO authenticated
  USING (
    profile_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for classes
CREATE POLICY "All authenticated users can read classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can manage classes"
  ON classes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- RLS Policies for subjects
CREATE POLICY "All authenticated users can read subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can manage subjects"
  ON subjects FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- RLS Policies for attendance
CREATE POLICY "Teachers and admins can manage attendance"
  ON attendance FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Parents can read their children's attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_id AND s.parent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- RLS Policies for exams
CREATE POLICY "All authenticated users can read exams"
  ON exams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can manage exams"
  ON exams FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- RLS Policies for exam_results
CREATE POLICY "Teachers and admins can manage exam results"
  ON exam_results FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Parents can read their children's results"
  ON exam_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_id AND s.parent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- RLS Policies for fees
CREATE POLICY "Admins can manage all fees"
  ON fees FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Parents can read their children's fees"
  ON fees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM students s
      WHERE s.id = student_id AND s.parent_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for expenses
CREATE POLICY "Admins can manage expenses"
  ON expenses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for library_books
CREATE POLICY "All authenticated users can read library books"
  ON library_books FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can manage library books"
  ON library_books FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- RLS Policies for notices
CREATE POLICY "All authenticated users can read notices"
  ON notices FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can manage notices"
  ON notices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- RLS Policies for transport_routes
CREATE POLICY "All authenticated users can read transport routes"
  ON transport_routes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage transport routes"
  ON transport_routes FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for hostel_rooms
CREATE POLICY "All authenticated users can read hostel rooms"
  ON hostel_rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage hostel rooms"
  ON hostel_rooms FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for routines
CREATE POLICY "All authenticated users can read routines"
  ON routines FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and teachers can manage routines"
  ON routines FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'teacher')
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exam_results_updated_at BEFORE UPDATE ON exam_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fees_updated_at BEFORE UPDATE ON fees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON library_books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transport_routes_updated_at BEFORE UPDATE ON transport_routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hostel_rooms_updated_at BEFORE UPDATE ON hostel_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routines_updated_at BEFORE UPDATE ON routines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();