'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NavigationTest() {
  const router = useRouter();

  const testRoutes = [
    { name: 'Current Investments', path: '/dashboard/investments/current' },
    { name: 'Investment Opportunities', path: '/dashboard/investments/opportunities' },
    { name: 'Investment Pools', path: '/dashboard/investments/pools' },
    { name: 'Carbon Dashboard', path: '/dashboard/carbon-credits' },
    { name: 'Device Energy Stats', path: '/dashboard/carbon-credits/device-stats' },
  ];

  const handleNavigation = (path: string) => {
    console.log('🚀 Navigating to:', path);
    router.push(path);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border border-yellow-500/50 m-4">
      <CardHeader>
        <CardTitle className="text-yellow-400">🔧 Navigation Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-yellow-200 text-sm mb-4">
          Click buttons below to test navigation:
        </div>
        {testRoutes.map((route) => (
          <Button
            key={route.path}
            onClick={() => handleNavigation(route.path)}
            className="w-full justify-start bg-yellow-600/20 border border-yellow-500/30 text-yellow-100 hover:bg-yellow-500/30"
          >
            Test → {route.name}
          </Button>
        ))}
        
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/30 rounded text-yellow-200 text-xs">
          <strong>Debug Info:</strong><br/>
          • Check browser console for navigation logs<br/>
          • Verify if URL changes in address bar<br/>
          • Check for any error messages
        </div>
      </CardContent>
    </Card>
  );
} 