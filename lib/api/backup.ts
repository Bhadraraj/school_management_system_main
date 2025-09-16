import { supabase } from '@/lib/supabase';

export const backupApi = {
  // Create full database backup
  async createBackup(schoolId: string) {
    try {
      const tables = [
        'profiles',
        'students', 
        'teachers',
        'classes',
        'subjects',
        'attendance',
        'exams',
        'exam_results',
        'fees',
        'expenses',
        'library_books',
        'notices',
        'transport_routes',
        'hostel_rooms',
        'routines',
      ];

      const backupData: any = {};

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .eq('school_id', schoolId);

        if (error) throw error;
        backupData[table] = data;
      }

      // Add metadata
      backupData.metadata = {
        school_id: schoolId,
        created_at: new Date().toISOString(),
        version: '1.0',
        tables_count: tables.length,
        total_records: Object.values(backupData).reduce((sum: number, tableData: any) => 
          sum + (Array.isArray(tableData) ? tableData.length : 0), 0
        ),
      };

      return backupData;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  },

  // Restore from backup
  async restoreBackup(backupData: any, schoolId: string) {
    try {
      const tables = Object.keys(backupData).filter(key => key !== 'metadata');

      for (const table of tables) {
        const tableData = backupData[table];
        
        if (Array.isArray(tableData) && tableData.length > 0) {
          // Update school_id for all records
          const updatedData = tableData.map(record => ({
            ...record,
            school_id: schoolId,
            id: undefined, // Let database generate new IDs
          }));

          const { error } = await supabase
            .from(table)
            .insert(updatedData);

          if (error) throw error;
        }
      }

      return { success: true, message: 'Backup restored successfully' };
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  },

  // Export data as JSON
  async exportAsJSON(schoolId: string) {
    const backupData = await this.createBackup(schoolId);
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school-backup-${schoolId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Export data as CSV
  async exportAsCSV(schoolId: string, tableName: string) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('school_id', schoolId);

      if (error) throw error;

      if (data.length === 0) {
        throw new Error('No data to export');
      }

      // Convert to CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tableName}-${schoolId}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      throw error;
    }
  },
};