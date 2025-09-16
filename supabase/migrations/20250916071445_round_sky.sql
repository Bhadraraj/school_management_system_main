/*
  # Insert Sample Data for School Management System

  1. Sample Data
    - Demo profiles for admin, teachers, and parents
    - Sample subjects and classes
    - Demo students with relationships
    - Sample attendance, exams, and results
    - Fee records and expenses
    - Library books and notices
    - Transport routes and hostel rooms

  2. Data Relationships
    - Proper foreign key relationships
    - Realistic sample data for testing
*/

-- Insert sample profiles
INSERT INTO profiles (id, email, name, role, avatar_url, phone, address) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@school.edu', 'Priscilla Lily', 'admin', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', '+1 234 567 8900', '123 Admin Street, City, State 12345'),
  ('22222222-2222-2222-2222-222222222222', 'teacher@school.edu', 'Dr. Sarah Wilson', 'teacher', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', '+1 234 567 8901', '456 Teacher Lane, City, State 12345'),
  ('33333333-3333-3333-3333-333333333333', 'parent@school.edu', 'Robert Johnson', 'parent', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400', '+1 234 567 8902', '789 Parent Avenue, City, State 12345'),
  ('44444444-4444-4444-4444-444444444444', 'john.davis@school.edu', 'Mr. John Davis', 'teacher', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400', '+1 234 567 8903', '321 Faculty Road, City, State 12345'),
  ('55555555-5555-5555-5555-555555555555', 'emily.chen@school.edu', 'Ms. Emily Chen', 'teacher', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', '+1 234 567 8904', '654 Education Blvd, City, State 12345'),
  ('66666666-6666-6666-6666-666666666666', 'parent2@school.edu', 'Mary Smith', 'parent', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', '+1 234 567 8905', '987 Family Street, City, State 12345');

-- Insert sample subjects
INSERT INTO subjects (id, name, code, credits, description) VALUES
  ('aaaa1111-1111-1111-1111-111111111111', 'Mathematics', 'MATH101', 4, 'Advanced Mathematics for Grade 10'),
  ('bbbb2222-2222-2222-2222-222222222222', 'Physics', 'PHY201', 4, 'Physics fundamentals and applications'),
  ('cccc3333-3333-3333-3333-333333333333', 'Chemistry', 'CHEM201', 4, 'Organic and Inorganic Chemistry'),
  ('dddd4444-4444-4444-4444-444444444444', 'English Literature', 'ENG101', 3, 'English Language and Literature'),
  ('eeee5555-5555-5555-5555-555555555555', 'Biology', 'BIO201', 4, 'Life Sciences and Biology'),
  ('ffff6666-6666-6666-6666-666666666666', 'History', 'HIST101', 3, 'World History and Civilizations'),
  ('gggg7777-7777-7777-7777-777777777777', 'Geography', 'GEO101', 3, 'Physical and Human Geography');

-- Insert sample teachers
INSERT INTO teachers (id, profile_id, subject_id, experience_years, qualification, join_date, status) VALUES
  ('tttt1111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'aaaa1111-1111-1111-1111-111111111111', 8, 'Ph.D. in Mathematics', '2020-08-15', 'active'),
  ('tttt2222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'bbbb2222-2222-2222-2222-222222222222', 12, 'M.Sc. Physics', '2018-01-10', 'active'),
  ('tttt3333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'dddd4444-4444-4444-4444-444444444444', 5, 'M.A. English Literature', '2022-03-01', 'active');

-- Insert sample classes
INSERT INTO classes (id, name, teacher_id, subject_id, room, schedule, capacity) VALUES
  ('cccc1111-1111-1111-1111-111111111111', 'Grade 10A', 'tttt1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'Room 101', 'Mon-Fri 9:00-10:00 AM', 32),
  ('cccc2222-2222-2222-2222-222222222222', 'Grade 10B', 'tttt2222-2222-2222-2222-222222222222', 'bbbb2222-2222-2222-2222-222222222222', 'Room 102', 'Mon-Fri 10:00-11:00 AM', 28),
  ('cccc3333-3333-3333-3333-333333333333', 'Grade 9A', 'tttt3333-3333-3333-3333-333333333333', 'dddd4444-4444-4444-4444-444444444444', 'Room 103', 'Mon-Fri 11:00-12:00 PM', 30);

-- Insert sample students
INSERT INTO students (id, name, email, phone, class_id, roll_number, date_of_birth, address, parent_id, admission_date, avatar_url) VALUES
  ('ssss1111-1111-1111-1111-111111111111', 'Alice Johnson', 'alice.johnson@email.com', '+1 234 567 8901', 'cccc1111-1111-1111-1111-111111111111', '001', '2008-05-15', '123 Main St, City, State 12345', '33333333-3333-3333-3333-333333333333', '2023-01-15', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('ssss2222-2222-2222-2222-222222222222', 'Bob Smith', 'bob.smith@email.com', '+1 234 567 8902', 'cccc2222-2222-2222-2222-222222222222', '002', '2008-03-20', '456 Oak Ave, City, State 12345', '66666666-6666-6666-6666-666666666666', '2023-01-15', 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('ssss3333-3333-3333-3333-333333333333', 'Carol Davis', 'carol.davis@email.com', '+1 234 567 8903', 'cccc3333-3333-3333-3333-333333333333', '003', '2009-07-10', '789 Pine St, City, State 12345', '33333333-3333-3333-3333-333333333333', '2023-01-15', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('ssss4444-4444-4444-4444-444444444444', 'David Wilson', 'david.wilson@email.com', '+1 234 567 8904', 'cccc1111-1111-1111-1111-111111111111', '004', '2008-11-25', '321 Elm St, City, State 12345', '66666666-6666-6666-6666-666666666666', '2023-01-15', 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400');

-- Insert sample attendance records
INSERT INTO attendance (student_id, class_id, date, status, marked_by) VALUES
  ('ssss1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', '2024-01-15', 'present', '22222222-2222-2222-2222-222222222222'),
  ('ssss2222-2222-2222-2222-222222222222', 'cccc2222-2222-2222-2222-222222222222', '2024-01-15', 'present', '44444444-4444-4444-4444-444444444444'),
  ('ssss3333-3333-3333-3333-333333333333', 'cccc3333-3333-3333-3333-333333333333', '2024-01-15', 'absent', '55555555-5555-5555-5555-555555555555'),
  ('ssss4444-4444-4444-4444-444444444444', 'cccc1111-1111-1111-1111-111111111111', '2024-01-15', 'late', '22222222-2222-2222-2222-222222222222');

-- Insert sample exams
INSERT INTO exams (id, name, subject_id, class_id, exam_type, date, start_time, end_time, total_marks) VALUES
  ('eeee1111-1111-1111-1111-111111111111', 'Mid Term Mathematics', 'aaaa1111-1111-1111-1111-111111111111', 'cccc1111-1111-1111-1111-111111111111', 'mid_term', '2024-02-15', '09:00', '11:00', 100),
  ('eeee2222-2222-2222-2222-222222222222', 'Physics Class Test', 'bbbb2222-2222-2222-2222-222222222222', 'cccc2222-2222-2222-2222-222222222222', 'class_test', '2024-02-20', '10:00', '11:00', 50),
  ('eeee3333-3333-3333-3333-333333333333', 'English Literature Quiz', 'dddd4444-4444-4444-4444-444444444444', 'cccc3333-3333-3333-3333-333333333333', 'quiz', '2024-02-25', '11:00', '11:30', 25);

-- Insert sample exam results
INSERT INTO exam_results (exam_id, student_id, obtained_marks, grade, percentage) VALUES
  ('eeee1111-1111-1111-1111-111111111111', 'ssss1111-1111-1111-1111-111111111111', 95, 'A+', 95.00),
  ('eeee2222-2222-2222-2222-222222222222', 'ssss2222-2222-2222-2222-222222222222', 42, 'B+', 84.00),
  ('eeee3333-3333-3333-3333-333333333333', 'ssss3333-3333-3333-3333-333333333333', 23, 'A+', 92.00);

-- Insert sample fees
INSERT INTO fees (student_id, fee_type, amount, due_date, status) VALUES
  ('ssss1111-1111-1111-1111-111111111111', 'tuition', 2000.00, '2024-02-01', 'paid'),
  ('ssss2222-2222-2222-2222-222222222222', 'tuition', 2000.00, '2024-02-01', 'unpaid'),
  ('ssss3333-3333-3333-3333-333333333333', 'library', 50.00, '2024-02-01', 'paid'),
  ('ssss4444-4444-4444-4444-444444444444', 'transport', 100.00, '2024-02-01', 'partial');

-- Insert sample expenses
INSERT INTO expenses (category, description, amount, date, payment_method, approved_by) VALUES
  ('Utilities', 'Electricity Bill - January', 1200.00, '2024-01-15', 'Bank Transfer', '11111111-1111-1111-1111-111111111111'),
  ('Maintenance', 'Classroom Furniture Repair', 850.00, '2024-01-14', 'Cash', '11111111-1111-1111-1111-111111111111'),
  ('Supplies', 'Laboratory Equipment', 2500.00, '2024-01-13', 'Check', '11111111-1111-1111-1111-111111111111');

-- Insert sample library books
INSERT INTO library_books (name, author, isbn, subject_id, class_level, publish_date, quantity, available_quantity) VALUES
  ('Advanced Mathematics', 'Dr. John Smith', '978-0123456789', 'aaaa1111-1111-1111-1111-111111111111', 'Grade 10', '2022-01-01', 50, 45),
  ('Physics Fundamentals', 'Prof. Jane Doe', '978-0987654321', 'bbbb2222-2222-2222-2222-222222222222', 'Grade 10', '2021-06-15', 40, 38),
  ('English Literature Classics', 'William Shakespeare', '978-0456789123', 'dddd4444-4444-4444-4444-444444444444', 'Grade 9', '2020-03-10', 60, 55);

-- Insert sample notices
INSERT INTO notices (title, description, date, priority, target_audience, author_id) VALUES
  ('Annual Sports Day', 'Annual sports day will be held on 25th December 2024. All students are requested to participate.', '2024-02-20', 'high', 'all', '11111111-1111-1111-1111-111111111111'),
  ('Parent-Teacher Meeting', 'Parent-teacher meeting scheduled for discussing student progress.', '2024-02-15', 'medium', 'parents', '11111111-1111-1111-1111-111111111111'),
  ('Library Book Return', 'All borrowed books must be returned before winter break.', '2024-02-10', 'low', 'students', '22222222-2222-2222-2222-222222222222');

-- Insert sample transport routes
INSERT INTO transport_routes (route_name, vehicle_number, driver_name, driver_phone, capacity, current_students, monthly_fare) VALUES
  ('Route A - Downtown', 'ABC-1234', 'John Smith', '+1 234 567 8901', 40, 35, 50.00),
  ('Route B - Suburbs', 'XYZ-5678', 'Mike Johnson', '+1 234 567 8902', 45, 42, 60.00),
  ('Route C - Uptown', 'DEF-9012', 'Sarah Wilson', '+1 234 567 8903', 35, 28, 45.00);

-- Insert sample hostel rooms
INSERT INTO hostel_rooms (room_number, room_type, capacity, occupied, monthly_rent, warden_id, facilities) VALUES
  ('H-101', 'double', 2, 2, 200.00, '22222222-2222-2222-2222-222222222222', 'WiFi, AC, Study Table'),
  ('H-102', 'single', 1, 1, 300.00, '44444444-4444-4444-4444-444444444444', 'WiFi, AC, Private Bath'),
  ('H-103', 'triple', 3, 0, 150.00, '22222222-2222-2222-2222-222222222222', 'WiFi, Fan, Study Table'),
  ('H-104', 'quad', 4, 3, 120.00, '55555555-5555-5555-5555-555555555555', 'WiFi, AC, Study Table');

-- Insert sample routines
INSERT INTO routines (class_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES
  ('cccc1111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 'tttt1111-1111-1111-1111-111111111111', 1, '09:00', '10:00', 'Room 101'),
  ('cccc2222-2222-2222-2222-222222222222', 'bbbb2222-2222-2222-2222-222222222222', 'tttt2222-2222-2222-2222-222222222222', 1, '10:00', '11:00', 'Room 102'),
  ('cccc3333-3333-3333-3333-333333333333', 'dddd4444-4444-4444-4444-444444444444', 'tttt3333-3333-3333-3333-333333333333', 1, '11:00', '12:00', 'Room 103'),
  ('cccc1111-1111-1111-1111-111111111111', 'bbbb2222-2222-2222-2222-222222222222', 'tttt2222-2222-2222-2222-222222222222', 2, '09:00', '10:00', 'Room 101'),
  ('cccc2222-2222-2222-2222-222222222222', 'aaaa1111-1111-1111-1111-111111111111', 'tttt1111-1111-1111-1111-111111111111', 2, '10:00', '11:00', 'Room 102');