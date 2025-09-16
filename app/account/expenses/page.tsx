"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ExpensesModal from "@/components/expenses/ExpensesModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Receipt,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const expensesData = [
  {
    id: "EXP001",
    category: "Utilities",
    description: "Electricity Bill - December",
    amount: "$1,200.00",
    date: "2023-12-15",
    paymentMethod: "Bank Transfer",
    status: "Paid",
    approvedBy: "Principal",
  },
  {
    id: "EXP002",
    category: "Maintenance",
    description: "Classroom Furniture Repair",
    amount: "$850.00",
    date: "2023-12-14",
    paymentMethod: "Cash",
    status: "Pending",
    approvedBy: "Admin",
  },
  {
    id: "EXP003",
    category: "Supplies",
    description: "Laboratory Equipment",
    amount: "$2,500.00",
    date: "2023-12-13",
    paymentMethod: "Check",
    status: "Paid",
    approvedBy: "Principal",
  },
  {
    id: "EXP004",
    category: "Transport",
    description: "Bus Fuel and Maintenance",
    amount: "$600.00",
    date: "2023-12-12",
    paymentMethod: "Bank Transfer",
    status: "Paid",
    approvedBy: "Transport Manager",
  },
];

export default function ExpensesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedExpense, setSelectedExpense] = useState(null);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense: any) => {
    setModalMode("edit");
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = (expense: any) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      console.log("Delete expense:", expense);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "Rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <>
      <Layout allowedRoles={["admin"]}>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1 mr-4">
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              All Expenses
            </h1>{" "}
            <div className="block sm:hidden">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Account</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-sm">
                      Expenses
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="hidden sm:block">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Account</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Expenses</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <Button
            onClick={handleCreate}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
          >
            <Plus className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline"> Add</span>
          </Button>
        </div>

        <Card className="w-full">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4 sm:pb-6">
            <div className="w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Payment Method
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Approved By
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expensesData.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Receipt className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-medium text-gray-900">
                            {expense.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                        {expense.description}
                      </td>
                      <td className="py-4 px-4 font-medium text-gray-900">
                        {expense.amount}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {expense.paymentMethod}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(expense.status)}>
                          {expense.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {expense.approvedBy}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(expense)}
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(expense)}
                          >
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>

    <ExpensesModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      mode={modalMode}
      expense={selectedExpense}
    />
  </>
  );
}
