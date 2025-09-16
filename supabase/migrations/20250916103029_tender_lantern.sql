/*
  # Sample Multi-School Data

  1. Sample Schools
    - Create demo schools with different subscription plans
    - Set up school-specific data

  2. Subscription Plans
    - Basic, Standard, Premium plans
    - Different limits and features

  3. Sample Data
    - School-specific users, students, teachers
    - Isolated data for each school
*/

-- Insert sample schools
INSERT INTO schools (id, name, email, phone, address, website, timezone, currency) VALUES
  ('school1-1111-1111-1111-111111111111', 'Greenwood High School', 'admin@greenwood.edu', '+1 555 0101', '123 Education Ave, Springfield, IL 62701', 'https://greenwood.edu', 'America/Chicago', 'USD'),
  ('school2-2222-2222-2222-222222222222', 'Riverside Academy', 'admin@riverside.edu', '+1 555 0102', '456 Learning Blvd, Austin, TX 73301', 'https://riverside.edu', 'America/Chicago', 'USD'),
  ('school3-3333-3333-3333-333333333333', 'Mountain View School', 'admin@mountainview.edu', '+1 555 0103', '789 Knowledge St, Denver, CO 80201', 'https://mountainview.edu', 'America/Denver', 'USD');

-- Insert subscription plans
INSERT INTO school_subscriptions (school_id, plan_type, max_students, max_teachers, max_classes, price_per_month, expires_at) VALUES
  ('school1-1111-1111-1111-111111111111', 'premium', 500, 50, 100, 199.99, '2025-12-31 23:59:59'),
  ('school2-2222-2222-2222-222222222222', 'standard', 200, 20, 40, 99.99, '2025-12-31 23:59:59'),
  ('school3-3333-3333-3333-333333333333', 'basic', 100, 10, 20, 49.99, '2025-12-31 23:59:59');

-- Update existing profiles with school_id
UPDATE profiles SET school_id = 'school1-1111-1111-1111-111111111111' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE profiles SET school_id = 'school1-1111-1111-1111-111111111111' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE profiles SET school_id = 'school1-1111-1111-1111-111111111111' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE profiles SET school_id = 'school1-1111-1111-1111-111111111111' WHERE id = '44444444-4444-4444-4444-444444444444';
UPDATE profiles SET school_id = 'school1-1111-1111-1111-111111111111' WHERE id = '55555555-5555-5555-5555-555555555555';
UPDATE profiles SET school_id = 'school1-1111-1111-1111-111111111111' WHERE id = '66666666-6666-6666-6666-666666666666';

-- Update existing data with school_id
UPDATE subjects SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE teachers SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE classes SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE students SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE fees SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE expenses SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE library_books SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE notices SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE transport_routes SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE hostel_rooms SET school_id = 'school1-1111-1111-1111-111111111111';
UPDATE routines SET school_id = 'school1-1111-1111-1111-111111111111';

-- Insert sample data for second school
INSERT INTO profiles (id, email, name, role, school_id, phone) VALUES
  ('admin2-2222-2222-2222-222222222222', 'admin@riverside.edu', 'Dr. Michael Brown', 'admin', 'school2-2222-2222-2222-222222222222', '+1 555 0201'),
  ('teacher2-2222-2222-2222-222222222222', 'teacher@riverside.edu', 'Prof. Lisa Davis', 'teacher', 'school2-2222-2222-2222-222222222222', '+1 555 0202');

-- Insert subjects for second school
INSERT INTO subjects (id, name, code, credits, description, school_id) VALUES
  ('subj2-1111-1111-1111-111111111111', 'Advanced Mathematics', 'AMATH201', 4, 'Advanced Mathematics for Grade 11', 'school2-2222-2222-2222-222222222222'),
  ('subj2-2222-2222-2222-222222222222', 'Computer Science', 'CS101', 3, 'Introduction to Computer Science', 'school2-2222-2222-2222-222222222222');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Welcome to TRACKLY', 'Your school management system is ready to use!', 'success'),
  ('22222222-2222-2222-2222-222222222222', 'New Student Enrolled', 'A new student has been enrolled in your class.', 'info'),
  ('33333333-3333-3333-3333-333333333333', 'Fee Payment Due', 'Your child''s tuition fee is due in 3 days.', 'warning');

-- Insert sample settings
INSERT INTO settings (school_id, key, value) VALUES
  ('school1-1111-1111-1111-111111111111', 'theme', '{"primary_color": "#8B5CF6", "secondary_color": "#A78BFA"}'),
  ('school1-1111-1111-1111-111111111111', 'academic_calendar', '{"start_date": "2024-09-01", "end_date": "2025-06-30"}'),
  ('school1-1111-1111-1111-111111111111', 'grading_system', '{"scale": "A-F", "passing_grade": 60}');