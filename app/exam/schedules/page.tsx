"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import ExamScheduleTable from "@/components/exam/ExamScheduleTable";
import ExamScheduleModal from "@/components/exam/ExamScheduleModal";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ExamSchedulesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Layout allowedRoles={["admin", "teacher"]}>
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              Examination
            </h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Exam</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Exam Schedule</BreadcrumbPage>
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
        <ExamScheduleTable onOpenModal={() => setIsModalOpen(true)} />
      </div>
    </Layout>

    <ExamScheduleModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
    />
  </>
  );
}
