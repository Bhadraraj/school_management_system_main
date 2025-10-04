'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import LibraryTable from '@/components/library/LibraryTable';
import LibraryModal from '@/components/library/LibraryModal';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Plus } from 'lucide-react';

export default function LibraryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Layout allowedRoles={['admin', 'teacher']}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-2">Library</h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Library Books</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </div>

          <LibraryTable />
        </div>
      </Layout>
      
      <LibraryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="create"
      />
    </>
  );
}