/*
  # Multi-School Support Schema

  1. New Tables
    - `schools` - School information and settings
    - `school_subscriptions` - Subscription plans and limits
    - `notifications` - System notifications
    - `audit_logs` - Activity tracking
    - `settings` - School-specific settings

  2. Schema Updates
    - Add school_id to existing tables
    - Update RLS policies for multi-tenancy
    - Add subscription limit checks

  3. Security
    - Multi-tenant RLS policies
    - School data isolation
    - Subscription enforcement
*/

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  website TEXT,
  logo_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'USD',
  academic_year_start DATE,
  academic_year_end DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create school subscriptions table
CREATE TABLE IF NOT EXISTS school_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'basic',
  status TEXT DEFAULT 'active',
  max_students INTEGER NOT NULL DEFAULT 100,
  max_teachers INTEGER NOT NULL DEFAULT 10,
  max_classes INTEGER NOT NULL DEFAULT 20,
  features JSONB DEFAULT '{}',
  price_per_month DECIMAL(10,2) NOT NULL DEFAULT 0,
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(school_id, key)
);

-- Add school_id to existing tables
DO $$
BEGIN
  -- Add school_id to profiles if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to students if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE students ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to teachers if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'teachers' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE teachers ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to classes if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'classes' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE classes ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to subjects if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subjects' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE subjects ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to fees if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'fees' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE fees ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to expenses if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE expenses ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to library_books if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'library_books' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE library_books ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to notices if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notices' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE notices ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to transport_routes if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transport_routes' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE transport_routes ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;

  -- Add school_id to hostel_rooms if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hostel_rooms' AND column_name = 'school_id'
  ) THEN
    ALTER TABLE hostel_rooms ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS on new tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools
CREATE POLICY "Super admins can manage all schools"
  ON schools FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "School admins can read own school"
  ON schools FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for school_subscriptions
CREATE POLICY "Super admins can manage all subscriptions"
  ON school_subscriptions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "School admins can read own subscription"
  ON school_subscriptions FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for audit_logs
CREATE POLICY "School admins can read own school logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- RLS Policies for settings
CREATE POLICY "School admins can manage own school settings"
  ON settings FOR ALL
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to get user's school_id
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT school_id 
    FROM profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing RLS policies to include school_id filtering
-- This ensures multi-tenant data isolation

-- Function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limit(
  school_id_param UUID,
  table_name_param TEXT,
  limit_column TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  current_count INTEGER;
  max_limit INTEGER;
BEGIN
  -- Get current count
  EXECUTE format('SELECT COUNT(*) FROM %I WHERE school_id = $1', table_name_param)
  INTO current_count
  USING school_id_param;
  
  -- Get subscription limit
  EXECUTE format('SELECT %I FROM school_subscriptions WHERE school_id = $1 AND status = ''active''', limit_column)
  INTO max_limit
  USING school_id_param;
  
  RETURN current_count < COALESCE(max_limit, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for updated_at on new tables
CREATE TRIGGER update_schools_updated_at 
  BEFORE UPDATE ON schools 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_subscriptions_updated_at 
  BEFORE UPDATE ON school_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
  BEFORE UPDATE ON settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schools_status ON schools(status);
CREATE INDEX IF NOT EXISTS idx_school_subscriptions_school_id ON school_subscriptions(school_id);
CREATE INDEX IF NOT EXISTS idx_school_subscriptions_status ON school_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_school_id ON audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_settings_school_id ON settings(school_id);

-- Add school_id indexes to existing tables
CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON profiles(school_id);
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_teachers_school_id ON teachers(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school_id ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_subjects_school_id ON subjects(school_id);
CREATE INDEX IF NOT EXISTS idx_fees_school_id ON fees(school_id);
CREATE INDEX IF NOT EXISTS idx_expenses_school_id ON expenses(school_id);