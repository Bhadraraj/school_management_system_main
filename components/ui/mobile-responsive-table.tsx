'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
  className?: string;
  mobileHidden?: boolean;
}

interface MobileResponsiveTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  className?: string;
  mobileCardClassName?: string;
}

const MobileResponsiveTable = memo(function MobileResponsiveTable({
  data,
  columns,
  onEdit,
  onDelete,
  className,
  mobileCardClassName,
}: MobileResponsiveTableProps) {
  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'text-left py-3 px-4 text-sm font-medium text-gray-600',
                    column.className
                  )}
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b border-border hover:bg-accent transition-colors group"
              >
                {columns.map((column) => (
                  <td key={column.key} className={cn('py-4 px-4', column.className)}>
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(item)}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet View */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.filter(col => !col.mobileHidden).slice(0, 4).map((column) => (
                <th
                  key={column.key}
                  className="text-left py-3 px-2 text-sm font-medium text-gray-600"
                >
                  {column.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className="border-b border-border hover:bg-accent transition-colors"
              >
                {columns.filter(col => !col.mobileHidden).slice(0, 4).map((column) => (
                  <td key={column.key} className="py-4 px-2 text-sm">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-end space-x-1">
                      {onEdit && (
                        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      {onDelete && (
                        <Button variant="ghost" size="sm" onClick={() => onDelete(item)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-4">
        {data.map((item, index) => (
          <Card
            key={item.id || index}
            className={cn(
              'bg-card text-card-foreground border rounded-xl p-4 shadow-md',
              mobileCardClassName
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {item.avatar && (
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={item.avatar} alt={item.name} />
                    <AvatarFallback>
                      {item.name?.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {item.name || item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.id || item.code}
                  </p>
                </div>
              </div>
              {(onEdit || onDelete) && (
                <div className="flex items-center gap-1">
                  {onEdit && (
                    <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(item)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {columns.filter(col => !col.mobileHidden && col.key !== 'name' && col.key !== 'title').map((column) => (
                <div key={column.key} className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{column.label}:</span>
                  <span className="text-sm font-medium">
                    {column.render ? column.render(item[column.key], item) : item[column.key]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default MobileResponsiveTable;