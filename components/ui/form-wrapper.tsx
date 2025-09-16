'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

interface FormWrapperProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

const FormWrapper = memo(function FormWrapper({ 
  children, 
  className, 
  title, 
  description 
}: FormWrapperProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
});

export default FormWrapper;