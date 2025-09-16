export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'teacher' | 'parent';
          avatar_url?: string;
          phone?: string;
          address?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'teacher' | 'parent';
          avatar_url?: string;
          phone?: string;
          address?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'teacher' | 'parent';
          avatar_url?: string;
          phone?: string;
          address?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          class_id: string;
          roll_number: string;
          date_of_birth: string;
          address: string;
          parent_id?: string;
          admission_date: string;
          status: 'active' | 'inactive';
          avatar_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          class_id: string;
          roll_number: string;
          date_of_birth: string;
          address: string;
          parent_id?: string;
          admission_date: string;
          status?: 'active' | 'inactive';
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          class_id?: string;
          roll_number?: string;
          date_of_birth?: string;
          address?: string;
          parent_id?: string;
          admission_date?: string;
          status?: 'active' | 'inactive';
          avatar_url?: string;
          updated_at?: string;
        };
      };
      teachers: {
        Row: {
          id: string;
          profile_id: string;
          subject_id: string;
          experience_years: number;
          qualification: string;
          join_date: string;
          status: 'active' | 'inactive' | 'on_leave';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          subject_id: string;
          experience_years: number;
          qualification: string;
          join_date: string;
          status?: 'active' | 'inactive' | 'on_leave';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          subject_id?: string;
          experience_years?: number;
          qualification?: string;
          join_date?: string;
          status?: 'active' | 'inactive' | 'on_leave';
          updated_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          name: string;
          teacher_id: string;
          subject_id: string;
          room: string;
          schedule: string;
          capacity: number;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          teacher_id: string;
          subject_id: string;
          room: string;
          schedule: string;
          capacity: number;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          teacher_id?: string;
          subject_id?: string;
          room?: string;
          schedule?: string;
          capacity?: number;
          status?: 'active' | 'inactive';
          updated_at?: string;
        };
      };
      subjects: {
        Row: {
          id: string;
          name: string;
          code: string;
          credits: number;
          description?: string;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          credits: number;
          description?: string;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          credits?: number;
          description?: string;
          status?: 'active' | 'inactive';
          updated_at?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          class_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          marked_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          class_id: string;
          date: string;
          status: 'present' | 'absent' | 'late';
          marked_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          class_id?: string;
          date?: string;
          status?: 'present' | 'absent' | 'late';
          marked_by?: string;
          updated_at?: string;
        };
      };
      exams: {
        Row: {
          id: string;
          name: string;
          subject_id: string;
          class_id: string;
          exam_type: 'mid_term' | 'final_term' | 'class_test' | 'quiz' | 'assignment';
          date: string;
          start_time: string;
          end_time: string;
          total_marks: number;
          status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subject_id: string;
          class_id: string;
          exam_type: 'mid_term' | 'final_term' | 'class_test' | 'quiz' | 'assignment';
          date: string;
          start_time: string;
          end_time: string;
          total_marks: number;
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subject_id?: string;
          class_id?: string;
          exam_type?: 'mid_term' | 'final_term' | 'class_test' | 'quiz' | 'assignment';
          date?: string;
          start_time?: string;
          end_time?: string;
          total_marks?: number;
          status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
          updated_at?: string;
        };
      };
      exam_results: {
        Row: {
          id: string;
          exam_id: string;
          student_id: string;
          obtained_marks: number;
          grade: string;
          percentage: number;
          remarks?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          exam_id: string;
          student_id: string;
          obtained_marks: number;
          grade: string;
          percentage: number;
          remarks?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          exam_id?: string;
          student_id?: string;
          obtained_marks?: number;
          grade?: string;
          percentage?: number;
          remarks?: string;
          updated_at?: string;
        };
      };
      fees: {
        Row: {
          id: string;
          student_id: string;
          fee_type: 'tuition' | 'library' | 'transport' | 'hostel' | 'exam' | 'activity';
          amount: number;
          due_date: string;
          paid_date?: string;
          status: 'paid' | 'unpaid' | 'partial' | 'overdue';
          payment_method?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          fee_type: 'tuition' | 'library' | 'transport' | 'hostel' | 'exam' | 'activity';
          amount: number;
          due_date: string;
          paid_date?: string;
          status?: 'paid' | 'unpaid' | 'partial' | 'overdue';
          payment_method?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          fee_type?: 'tuition' | 'library' | 'transport' | 'hostel' | 'exam' | 'activity';
          amount?: number;
          due_date?: string;
          paid_date?: string;
          status?: 'paid' | 'unpaid' | 'partial' | 'overdue';
          payment_method?: string;
          updated_at?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          category: string;
          description: string;
          amount: number;
          date: string;
          payment_method: string;
          approved_by: string;
          receipt_number?: string;
          status: 'paid' | 'pending' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: string;
          description: string;
          amount: number;
          date: string;
          payment_method: string;
          approved_by: string;
          receipt_number?: string;
          status?: 'paid' | 'pending' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category?: string;
          description?: string;
          amount?: number;
          date?: string;
          payment_method?: string;
          approved_by?: string;
          receipt_number?: string;
          status?: 'paid' | 'pending' | 'rejected';
          updated_at?: string;
        };
      };
      library_books: {
        Row: {
          id: string;
          name: string;
          author: string;
          isbn: string;
          subject_id: string;
          class_level: string;
          publish_date: string;
          quantity: number;
          available_quantity: number;
          status: 'available' | 'unavailable';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          author: string;
          isbn: string;
          subject_id: string;
          class_level: string;
          publish_date: string;
          quantity: number;
          available_quantity?: number;
          status?: 'available' | 'unavailable';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          author?: string;
          isbn?: string;
          subject_id?: string;
          class_level?: string;
          publish_date?: string;
          quantity?: number;
          available_quantity?: number;
          status?: 'available' | 'unavailable';
          updated_at?: string;
        };
      };
      notices: {
        Row: {
          id: string;
          title: string;
          description: string;
          date: string;
          priority: 'high' | 'medium' | 'low';
          target_audience: 'all' | 'students' | 'teachers' | 'parents';
          author_id: string;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          date: string;
          priority: 'high' | 'medium' | 'low';
          target_audience: 'all' | 'students' | 'teachers' | 'parents';
          author_id: string;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          date?: string;
          priority?: 'high' | 'medium' | 'low';
          target_audience?: 'all' | 'students' | 'teachers' | 'parents';
          author_id?: string;
          status?: 'active' | 'inactive';
          updated_at?: string;
        };
      };
      transport_routes: {
        Row: {
          id: string;
          route_name: string;
          vehicle_number: string;
          driver_name: string;
          driver_phone: string;
          capacity: number;
          current_students: number;
          monthly_fare: number;
          status: 'active' | 'inactive' | 'maintenance';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          route_name: string;
          vehicle_number: string;
          driver_name: string;
          driver_phone: string;
          capacity: number;
          current_students?: number;
          monthly_fare: number;
          status?: 'active' | 'inactive' | 'maintenance';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          route_name?: string;
          vehicle_number?: string;
          driver_name?: string;
          driver_phone?: string;
          capacity?: number;
          current_students?: number;
          monthly_fare?: number;
          status?: 'active' | 'inactive' | 'maintenance';
          updated_at?: string;
        };
      };
      hostel_rooms: {
        Row: {
          id: string;
          room_number: string;
          room_type: 'single' | 'double' | 'triple' | 'quad';
          capacity: number;
          occupied: number;
          monthly_rent: number;
          warden_id: string;
          facilities: string;
          status: 'available' | 'occupied' | 'partially_occupied' | 'maintenance';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          room_number: string;
          room_type: 'single' | 'double' | 'triple' | 'quad';
          capacity: number;
          occupied?: number;
          monthly_rent: number;
          warden_id: string;
          facilities: string;
          status?: 'available' | 'occupied' | 'partially_occupied' | 'maintenance';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          room_number?: string;
          room_type?: 'single' | 'double' | 'triple' | 'quad';
          capacity?: number;
          occupied?: number;
          monthly_rent?: number;
          warden_id?: string;
          facilities?: string;
          status?: 'available' | 'occupied' | 'partially_occupied' | 'maintenance';
          updated_at?: string;
        };
      };
      routines: {
        Row: {
          id: string;
          class_id: string;
          subject_id: string;
          teacher_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          room: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          subject_id: string;
          teacher_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          room: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          subject_id?: string;
          teacher_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          room?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'admin' | 'teacher' | 'parent';
      student_status: 'active' | 'inactive';
      teacher_status: 'active' | 'inactive' | 'on_leave';
      attendance_status: 'present' | 'absent' | 'late';
      exam_type: 'mid_term' | 'final_term' | 'class_test' | 'quiz' | 'assignment';
      fee_type: 'tuition' | 'library' | 'transport' | 'hostel' | 'exam' | 'activity';
      payment_status: 'paid' | 'unpaid' | 'partial' | 'overdue';
      room_type: 'single' | 'double' | 'triple' | 'quad';
      priority_level: 'high' | 'medium' | 'low';
    };
  };
}