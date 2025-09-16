'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Pagination from '@/components/ui/pagination';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  loading?: boolean;
  searchable?: boolean;
  selectable?: boolean;
  actions?: {
    view?: (item: any) => void;
    edit?: (item: any) => void;
    delete?: (item: any) => void;
    custom?: Array<{
      label: string;
      icon?: React.ComponentType<any>;
      onClick: (item: any) => void;
      className?: string;
    }>;
  };
  title?: string;
  description?: string;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable({
  data,
  columns,
  loading = false,
  searchable = true,
  selectable = false,
  actions,
  title,
  description,
  emptyMessage = 'No data available',
  className,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState('10');

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchQuery && searchable) {
      filtered = data.filter(item =>
        columns.some(column => {
          const value = item[column.key];
          return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchQuery, sortColumn, sortDirection, columns, searchable]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / parseInt(itemsPerPage));
  const startIndex = (currentPage - 1) * parseInt(itemsPerPage);
  const paginatedData = processedData.slice(startIndex, startIndex + parseInt(itemsPerPage));

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(paginatedData.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          
          {searchable && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {processedData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {selectable && (
                      <th className="text-left py-3 px-4 w-12">
                        <Checkbox
                          checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                    )}
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        className={`text-left py-3 px-4 text-sm font-medium text-gray-600 ${
                          column.sortable ? 'cursor-pointer hover:text-gray-900' : ''
                        } ${column.className || ''}`}
                        onClick={column.sortable ? () => handleSort(column.key) : undefined}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{column.label}</span>
                          {column.sortable && sortColumn === column.key && (
                            <span className="text-xs">
                              {sortDirection === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    {actions && (
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {selectable && (
                        <td className="py-4 px-4">
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked)}
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.key} className={`py-4 px-4 ${column.className || ''}`}>
                          {column.render ? column.render(item[column.key], item) : item[column.key]}
                        </td>
                      ))}
                      {actions && (
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            {actions.view && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => actions.view!(item)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            )}
                            {actions.edit && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => actions.edit!(item)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            {actions.delete && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => actions.delete!(item)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
                            {actions.custom && actions.custom.length > 0 && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {actions.custom.map((action, index) => (
                                    <DropdownMenuItem
                                      key={index}
                                      onClick={() => action.onClick(item)}
                                      className={action.className}
                                    >
                                      {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                                      {action.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}