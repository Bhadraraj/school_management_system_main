"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import NoticeModal from "@/components/notice/NoticeModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const noticesData = [
  {
    id: "NOT001",
    title: "Annual Sports Day",
    description:
      "Annual sports day will be held on 25th December 2023. All students are requested to participate.",
    date: "2023-12-20",
    priority: "High",
    targetAudience: "All",
    author: "Principal",
    status: "Active",
  },
  {
    id: "NOT002",
    title: "Parent-Teacher Meeting",
    description:
      "Parent-teacher meeting scheduled for discussing student progress.",
    date: "2023-12-15",
    priority: "Medium",
    targetAudience: "Parents",
    author: "Admin",
    status: "Active",
  },
  {
    id: "NOT003",
    title: "Winter Break Notice",
    description:
      "School will remain closed from 25th Dec to 5th Jan for winter break.",
    date: "2023-12-10",
    priority: "High",
    targetAudience: "All",
    author: "Principal",
    status: "Active",
  },
  {
    id: "NOT004",
    title: "Library Book Return",
    description: "All borrowed books must be returned before winter break.",
    date: "2023-12-08",
    priority: "Low",
    targetAudience: "Students",
    author: "Librarian",
    status: "Active",
  },
];

export default function NoticePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = () => {
    setModalMode("create");
    setSelectedNotice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (notice: any) => {
    setModalMode("edit");
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const handleDelete = (notice: any) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      console.log("Delete notice:", notice);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "low":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <>
      <Layout allowedRoles={["admin", "teacher", "parent"]}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">Notice</h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage> Notice</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Add </span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search notices..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
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
                        Title
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Priority
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Audience
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Author
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {noticesData.map((notice) => (
                      <tr
                        key={notice.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {notice.title}
                        </td>
                        <td className="py-4 px-4 text-gray-600 max-w-xs truncate">
                          {notice.description}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">
                              {new Date(notice.date).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getPriorityColor(notice.priority)}>
                            {notice.priority}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {notice.targetAudience}
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {notice.author}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(notice)}
                            >
                              <Edit className="w-4 h-4 text-gray-400" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notice)}
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

      <NoticeModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="create"
      />
    </>
  );
}
