"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

// Import the Pagination component
import Pagination from "@/components/ui/pagination";

interface FeesTableProps {
  onEdit?: (fees: any) => void;
  onDelete?: (fees: any) => void;
}

const feesData = [
  {
    name: "Jessia Rose",
    roll: "#10",
    expense: "Class Test",
    class: "02",
    amount: "$2,0000.00",
    status: "Unpaid",
    phone: "+123 8988569",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Jane Cooper",
    roll: "#10",
    expense: "Class Test",
    class: "02",
    amount: "$2,0000.00",
    status: "Paid",
    phone: "+123 6988566",
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
    selected: true,
  },
  {
    name: "Theresa Webb",
    roll: "#10",
    expense: "Class Test",
    class: "02",
    amount: "$2,0000.00",
    status: "Unpaid",
    phone: "+123 8988569",
    avatar:
      "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Wade Warren",
    roll: "#10",
    expense: "Class Test",
    class: "03",
    amount: "$3,0000.00",
    status: "Paid",
    phone: "+123 4948564",
    avatar:
      "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function FeesTable({ onEdit, onDelete }: FeesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(4);
  const [itemsPerPage, setItemsPerPage] = useState("10");

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log(`Navigated to page ${page}`);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
    console.log(`Items per page changed to ${value}`);
  };

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
                  Students Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Roll
                </th>
                {/* <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Expense
                </th> */}
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Class
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  Phone
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {feesData.map((student, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-accent transition-colors group"
                >
                  <td className="py-4 px-4">
                    <Checkbox checked={student.selected} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground group-hover:text-accent-foreground">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                    {student.roll}
                  </td>
                  {/* <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                    {student.expense}
                  </td> */}
                  <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                    {student.class}
                  </td>
                  <td className="py-4 px-4 font-medium text-foreground group-hover:text-accent-foreground">
                    {student.amount}
                  </td>
                  <td className="py-4 px-4">
                    <Badge
                      variant={
                        student.status === "Paid" ? "default" : "destructive"
                      }
                      className={
                        student.status === "Paid"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {student.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                    {student.phone}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDelete?.(student)}
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit?.(student)}
                      >
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
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
              {feesData.map((student, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-accent transition-colors group"
                >
                  <td className="py-4 px-2">
                    <Checkbox checked={student.selected} />
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">
                          {student.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.roll}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm">
                      {/* <div className="text-muted-foreground">
                        {student.expense}
                      </div> */}
                      <div className="text-xs text-muted-foreground">
                        Class {student.class}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-medium text-foreground">
                    {student.amount}
                  </td>
                  <td className="py-4 px-2">
                    <Badge
                      variant={
                        student.status === "Paid" ? "default" : "destructive"
                      }
                      className={
                        student.status === "Paid"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {student.status}
                    </Badge>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-end space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDelete?.(student)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEdit?.(student)}
                      >
                        <Edit className="w-4 h-4" />
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
          {feesData.map((student, index) => (
           <div key={index} className="bg-card text-card-foreground border rounded-lg p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Checkbox checked={student.selected} />
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {student.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {student.roll}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete?.(student)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit?.(student)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  {/* <div>
                    <p className="text-xs text-muted-foreground">Expense</p>
                    <p className="text-sm font-medium">{student.expense}</p>
                  </div> */}
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Class</p>
                    <p className="text-sm font-medium">{student.class}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-medium">{student.amount}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{student.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    student.status === "Paid" ? "default" : "destructive"
                  }
                  className={
                    student.status === "Paid"
                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                      : "bg-red-100 text-red-700 hover:bg-red-100"
                  }
                >
                  {student.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Use the imported Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={100}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </CardContent>
    </Card>
    </div>
  );
}