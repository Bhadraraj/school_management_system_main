"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import TransportModal from "@/components/transport/TransportModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Bus,
  User,
  Phone,
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

const transportData = [
  {
    id: "TR001",
    routeName: "Route A - Downtown",
    vehicleNumber: "ABC-1234",
    driverName: "John Smith",
    driverPhone: "+1 234 567 8901",
    capacity: 40,
    currentStudents: 35,
    fare: "$50",
    status: "Active",
  },
  {
    id: "TR002",
    routeName: "Route B - Suburbs",
    vehicleNumber: "XYZ-5678",
    driverName: "Mike Johnson",
    driverPhone: "+1 234 567 8902",
    capacity: 45,
    currentStudents: 42,
    fare: "$60",
    status: "Active",
  },
  {
    id: "TR003",
    routeName: "Route C - Uptown",
    vehicleNumber: "DEF-9012",
    driverName: "Sarah Wilson",
    driverPhone: "+1 234 567 8903",
    capacity: 35,
    currentStudents: 28,
    fare: "$45",
    status: "Maintenance",
  },
  {
    id: "TR004",
    routeName: "Route D - Eastside",
    vehicleNumber: "GHI-3456",
    driverName: "David Brown",
    driverPhone: "+1 234 567 8904",
    capacity: 50,
    currentStudents: 48,
    fare: "$55",
    status: "Active",
  },
];

export default function TransportPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = () => {
    setModalMode("create");
    setSelectedTransport(null);
    setIsModalOpen(true);
  };

  const handleEdit = (transport: any) => {
    setModalMode("edit");
    setSelectedTransport(transport);
    setIsModalOpen(true);
  };

  const handleDelete = (transport: any) => {
    if (confirm("Are you sure you want to delete this transport route?")) {
      console.log("Delete transport:", transport);
    }
  };

  return (
    <>
      <Layout allowedRoles={["admin"]}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">
                Transport
              </h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage> Transport</BreadcrumbPage>
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
                    placeholder="Search routes..."
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
                        Route
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Vehicle
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Driver
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Capacity
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Fare
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
                    {transportData.map((transport) => (
                      <tr
                        key={transport.id}
                        className="border-b border-border hover:bg-accent transition-colors group"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Bus className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="font-medium text-foreground group-hover:text-accent-foreground">
                              {transport.routeName}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground font-mono group-hover:text-accent-foreground">
                          {transport.vehicleNumber}
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground group-hover:text-accent-foreground">
                                {transport.driverName}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground text-sm group-hover:text-accent-foreground">
                                {transport.driverPhone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground group-hover:text-accent-foreground">
                          {transport.currentStudents}/{transport.capacity}
                        </td>
                        <td className="py-4 px-4 font-medium text-foreground group-hover:text-accent-foreground">
                          {transport.fare}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            className={
                              transport.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            }
                          >
                            {transport.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(transport)}
                            >
                              <Edit className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(transport)}
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
            </CardContent>
          </Card>
        </div>
      </Layout>

      <TransportModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        transport={selectedTransport}
      />
    </>
  );
}
