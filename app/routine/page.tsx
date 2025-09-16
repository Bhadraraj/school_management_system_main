"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import RoutineModal from "@/components/routine/RoutineModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const scheduleData = [
  {
    time: "8:00 AM",
    monday: "Math",
    tuesday: "Physics",
    wednesday: "Chemistry",
    thursday: "Biology",
    friday: "Math",
  },
  {
    time: "9:00 AM",
    monday: "English",
    tuesday: "Math",
    wednesday: "Physics",
    thursday: "Chemistry",
    friday: "English",
  },
  {
    time: "10:00 AM",
    monday: "Physics",
    tuesday: "English",
    wednesday: "Math",
    thursday: "Physics",
    friday: "History",
  },
  {
    time: "11:00 AM",
    monday: "Break",
    tuesday: "Break",
    wednesday: "Break",
    thursday: "Break",
    friday: "Break",
  },
  {
    time: "11:30 AM",
    monday: "Chemistry",
    tuesday: "Biology",
    wednesday: "English",
    thursday: "Math",
    friday: "Geography",
  },
  {
    time: "12:30 PM",
    monday: "Biology",
    tuesday: "Chemistry",
    wednesday: "Biology",
    thursday: "English",
    friday: "Art",
  },
  {
    time: "1:30 PM",
    monday: "Lunch",
    tuesday: "Lunch",
    wednesday: "Lunch",
    thursday: "Lunch",
    friday: "Lunch",
  },
  {
    time: "2:30 PM",
    monday: "History",
    tuesday: "Geography",
    wednesday: "History",
    thursday: "Geography",
    friday: "PE",
  },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function RoutinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Layout allowedRoles={["admin", "teacher", "parent"]}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">Routine</h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Routine</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="w-3 h-3 sm:mr-1" />
              <span className="hidden sm:inline">Add </span>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Weekly Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                        Time
                      </th>
                      {days.map((day) => (
                        <th
                          key={day}
                          className="text-center py-3 px-4 text-sm font-medium text-gray-600"
                        >
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.map((slot, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">
                          {slot.time}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              slot.monday === "Break" || slot.monday === "Lunch"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-purple-100 text-purple-700"
                            }
                          >
                            {slot.monday}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              slot.tuesday === "Break" ||
                              slot.tuesday === "Lunch"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-blue-100 text-blue-700"
                            }
                          >
                            {slot.tuesday}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              slot.wednesday === "Break" ||
                              slot.wednesday === "Lunch"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-green-100 text-green-700"
                            }
                          >
                            {slot.wednesday}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              slot.thursday === "Break" ||
                              slot.thursday === "Lunch"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {slot.thursday}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge
                            variant="outline"
                            className={
                              slot.friday === "Break" || slot.friday === "Lunch"
                                ? "bg-gray-100 text-gray-600"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {slot.friday}
                          </Badge>
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

      <RoutineModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="create"
      />
    </>
  );
}
