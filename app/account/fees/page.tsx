"use client";

import Layout from "@/components/layout/Layout";
import FeesTable from "@/components/fees/FeesTable";
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
  return (
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
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">Add </span>
          </Button>
        </div>
        <FeesTable />
      </div>
    </Layout>
  );
}
