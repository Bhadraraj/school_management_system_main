'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { backupApi } from '@/lib/api/backup';
import { useAuthStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useThemeStore, type Theme } from '@/lib/store';
import { themes } from '@/lib/themes';
import { Palette, Moon, Sun, Upload, Download, Database, Shield, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const themeOptions: { name: Theme; label: string; color: string }[] = [
  { name: 'default', label: 'Default Purple', color: '#8B5CF6' },
  { name: 'ocean', label: 'Ocean Blue', color: '#0EA5E9' },
  { name: 'forest', label: 'Forest Green', color: '#059669' },
  { name: 'sunset', label: 'Sunset Orange', color: '#EA580C' },
  { name: 'royal', label: 'Royal Purple', color: '#7C3AED' },
];

export default function SettingsPage() {
  const { theme, isDark, setTheme, toggleDark } = useThemeStore();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backupLoading, setBackupLoading] = useState(false);
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: 'TRACKLY School',
    academicYear: '2024-2025',
    timezone: 'UTC',
    currency: 'USD',
    gradingSystem: 'A-F',
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      toast({
        title: "Logo uploaded",
        description: "Logo will be updated after saving settings",
      });
    }
  };

  const handleBackup = async () => {
    if (!user?.id) return;
    
    setBackupLoading(true);
    try {
      await backupApi.exportAsJSON('school1-1111-1111-1111-111111111111'); // Use actual school ID
      toast({
        title: "Backup created",
        description: "School data has been exported successfully",
      });
    } catch (error) {
      toast({
        title: "Backup failed",
        description: "Failed to create backup",
        variant: "destructive",
      });
    } finally {
      setBackupLoading(false);
    }
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully",
    });
  };
  return (
    <Layout allowedRoles={['admin', 'teacher', 'parent']}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-lg font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your school management system appearance and preferences.</p>
        </div>
        
        {/* School Information */}
        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>School Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={schoolSettings.schoolName}
                    onChange={(e) => setSchoolSettings(prev => ({ ...prev, schoolName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Academic Year</Label>
                  <Input
                    id="academicYear"
                    value={schoolSettings.academicYear}
                    onChange={(e) => setSchoolSettings(prev => ({ ...prev, academicYear: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={schoolSettings.timezone}
                    onChange={(e) => setSchoolSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={schoolSettings.currency}
                    onChange={(e) => setSchoolSettings(prev => ({ ...prev, currency: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">School Logo</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Theme Customization</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dark/Light Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <div className="flex items-center space-x-3">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <Switch checked={isDark} onCheckedChange={toggleDark} />
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Color Theme Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Color Theme</Label>
                <p className="text-sm text-muted-foreground">Choose from predefined color schemes</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => setTheme(option.name)}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md',
                      theme === option.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: option.color }}
                      />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.color}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div> 
          </CardContent>
        </Card> 

        {/* Data Management */}
        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Backup & Export</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create backups of your school data for security and compliance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleBackup}
                      disabled={backupLoading}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {backupLoading ? 'Creating Backup...' : 'Create Backup'}
                    </Button>
                    <Button variant="outline" onClick={() => backupApi.exportAsCSV('school1-1111-1111-1111-111111111111', 'students')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Students
                    </Button>
                    <Button variant="outline" onClick={() => backupApi.exportAsCSV('school1-1111-1111-1111-111111111111', 'teachers')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Teachers
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-foreground mb-2">Security Settings</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure security and access control settings.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                        <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Session Timeout</Label>
                        <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Audit Logging</Label>
                        <p className="text-xs text-muted-foreground">Track all user activities</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="bg-purple-600 hover:bg-purple-700">
            Save Settings
          </Button>
        </div>
      </div>
    </Layout>
  );
}