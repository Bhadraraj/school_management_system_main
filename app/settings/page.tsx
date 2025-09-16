'use client';

import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useThemeStore, type Theme } from '@/lib/store';
import { themes } from '@/lib/themes';
import { Palette, Moon, Sun, Upload } from 'lucide-react';
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
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  return (
    <Layout allowedRoles={['admin', 'teacher', 'parent']}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-lg font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your school management system appearance and preferences.</p>
        </div>
        
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
      </div>
    </Layout>
  );
}