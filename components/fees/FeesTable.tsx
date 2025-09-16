"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Edit,
  Trash2,
  Phone,
  DollarSign,
  GraduationCap,
  FileText,
} from "lucide-react";
import Pagination from "@/components/ui/pagination";

interface FeesTableProps {
  fees: any[];
  loading: boolean;
  onEdit?: (fees: any) => void;
  onDelete?: (fees: any) => void;
}

export default function FeesTable({ fees, loading, onEdit, onDelete }: FeesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "unpaid":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "partial":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "overdue":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  // Filter fees based on search query
  const filteredFees = fees.filter(fee =>
    fee.students?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.fee_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fee.students?.roll_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="mx-4 sm:mx-6 md:mx-8">
        <Card className="w-full mx-auto bg-card text-card-foreground">
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
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-4 sm:mx-6 md:mx-8">
      <Card className="w-full mx-auto bg-card text-card-foreground">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name or roll"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select defaultValue="30">
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="px-0 sm:px-6">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <Checkbox />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Student Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Roll
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Class
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Fee Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Due Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map((fee) => (
                  <tr
                    key={fee.id}
                    className="border-b border-border hover:bg-accent transition-colors group"
                  >
                    <td className="py-4 px-4">
                      <Checkbox />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={fee.students?.avatar_url} alt={fee.students?.name} />
                          <AvatarFallback>
                            {fee.students?.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground group-hover:text-accent-foreground">
                          {fee.students?.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {fee.students?.roll_number}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {fee.students?.classes?.name || 'No Class'}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground capitalize">
                      {fee.fee_type.replace('_', ' ')}
                    </td>
                    <td className="py-4 px-4 font-medium text-foreground group-hover:text-accent-foreground">
                      ${fee.amount}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                      {new Date(fee.due_date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(fee.status)}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEdit?.(fee)}
                        >
                          <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onDelete?.(fee)}
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                    </td>
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
                  <th className="text-left py-3 px-2">
                    <Checkbox />
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                    Student
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                    Details
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                    Amount
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map((fee) => (
                  <tr
                    key={fee.id}
                    className="border-b border-border hover:bg-accent transition-colors group"
                  >
                    <td className="py-4 px-2">
                      <Checkbox />
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={fee.students?.avatar_url} alt={fee.students?.name} />
                          <AvatarFallback>
                            {fee.students?.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">
                            {fee.students?.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {fee.students?.roll_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-sm">
                        <div className="text-muted-foreground capitalize">
                          {fee.fee_type.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Due: {new Date(fee.due_date).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 font-medium text-foreground">
                      ${fee.amount}
                    </td>
                    <td className="py-4 px-2">
                      <Badge className={getStatusColor(fee.status)}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-end space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onEdit?.(fee)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onDelete?.(fee)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredFees.map((fee) => (
              <div key={fee.id} className="bg-card text-card-foreground border rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox />
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={fee.students?.avatar_url} alt={fee.students?.name} />
                      <AvatarFallback>
                        {fee.students?.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-foreground">
                        {fee.students?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Roll: {fee.students?.roll_number}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit?.(fee)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete?.(fee)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Fee Type</p>
                      <p className="text-sm font-medium capitalize">{fee.fee_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Class</p>
                      <p className="text-sm font-medium">{fee.students?.classes?.name || 'No Class'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="text-sm font-medium">${fee.amount}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium">{new Date(fee.due_date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Badge className={getStatusColor(fee.status)}>
                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredFees.length / parseInt(itemsPerPage))}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}