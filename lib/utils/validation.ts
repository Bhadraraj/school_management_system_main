import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits');
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters');

// Student validation
export const studentValidationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  roll_number: z.string().min(1, 'Roll number is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  class_id: z.string().min(1, 'Class is required'),
});

// Teacher validation
export const teacherValidationSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject_id: z.string().min(1, 'Subject is required'),
  experience_years: z.number().min(0, 'Experience cannot be negative'),
  qualification: z.string().min(1, 'Qualification is required'),
});

// Fee validation
export const feeValidationSchema = z.object({
  student_id: z.string().min(1, 'Student is required'),
  fee_type: z.enum(['tuition', 'library', 'transport', 'hostel', 'exam', 'activity']),
  amount: z.number().positive('Amount must be positive'),
  due_date: z.string().min(1, 'Due date is required'),
});

// Exam validation
export const examValidationSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  subject_id: z.string().min(1, 'Subject is required'),
  class_id: z.string().min(1, 'Class is required'),
  exam_type: z.enum(['mid_term', 'final_term', 'class_test', 'quiz', 'assignment']),
  date: z.string().min(1, 'Date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  total_marks: z.number().positive('Total marks must be positive'),
});

// Validation helper functions
export const validateCSVData = (data: any[], schema: z.ZodSchema) => {
  const results = {
    valid: [] as any[],
    invalid: [] as { row: any; errors: string[] }[],
  };

  data.forEach((row, index) => {
    try {
      const validatedRow = schema.parse(row);
      results.valid.push(validatedRow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        results.invalid.push({
          row: { ...row, rowNumber: index + 1 },
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
        });
      }
    }
  });

  return results;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

export const validateFileUpload = (file: File, allowedTypes: string[], maxSize: number) => {
  const errors: string[] = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  if (file.size > maxSize) {
    errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};