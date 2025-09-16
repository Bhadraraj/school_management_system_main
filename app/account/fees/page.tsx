"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import FeesTable from "@/components/fees/FeesTable";
import FeesModal from "@/components/fees/FeesModal";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Plus } from "lucide-react";

export default function FeesCollectionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedFees, setSelectedFees] = useState(null);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedFees(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <Layout allowedRoles={["admin"]}>
      <div className="space-y-6">
       
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">Fees Management</h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Fees Collection</BreadcrumbPage>
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
        <FeesTable 
          onEdit={(fees) => {
            setModalMode("edit");
            setSelectedFees(fees);
            setIsModalOpen(true);
          }}
          onDelete={(fees) => {
            if (confirm("Are you sure you want to delete this fee record?")) {
              console.log("Delete fees:", fees);
            }
          }}
        />
      </div>
    </Layout>

    <FeesModal
      open={isModalOpen}
      onOpenChange={setIsModalOpen}
      mode={modalMode}
      fees={selectedFees}
    />
  </>
  );
}
