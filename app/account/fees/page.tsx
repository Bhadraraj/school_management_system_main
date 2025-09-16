"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import FeesTable from "@/components/fees/FeesTable";
import FeesModal from "@/components/fees/FeesModal";
import { feesApi } from "@/lib/api/fees";
import { studentsApi } from "@/lib/api/students";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
  const [fees, setFees] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesData, studentsData] = await Promise.all([
          feesApi.getAll(),
          studentsApi.getAll(),
        ]);
        setFees(feesData);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load fees data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleCreate = () => {
    setModalMode("create");
    setSelectedFees(null);
    setIsModalOpen(true);
  };

  const handleFeesSaved = async () => {
    try {
      const feesData = await feesApi.getAll();
      setFees(feesData);
    } catch (error) {
      console.error('Error refreshing fees:', error);
    }
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
          fees={fees}
          loading={loading}
          onEdit={(fees) => {
            setModalMode("edit");
            setSelectedFees(fees);
            setIsModalOpen(true);
          }}
          onDelete={async (fees) => {
            if (confirm(`Are you sure you want to delete this fee record for ${fees.students?.name}?`)) {
              try {
                await feesApi.delete(fees.id);
                setFees(prev => prev.filter(f => f.id !== fees.id));
                toast({
                  title: "Success",
                  description: "Fee record deleted successfully",
                });
              } catch (error) {
                console.error('Error deleting fee:', error);
                toast({
                  title: "Error",
                  description: "Failed to delete fee record",
                  variant: "destructive",
                });
              }
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
      students={students}
      onSaved={handleFeesSaved}
    />
  </>
  );
}
