import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';

export function AuthTest() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAuthHeaders = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await apiRequest('GET', '/api/session-dump');
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testDevAuth = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await apiRequest('GET', '/api/dev/auth');
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Authentication Headers Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={testAuthHeaders} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test Session Dump'}
          </Button>
          <Button 
            onClick={testDevAuth} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Testing...' : 'Test Dev Auth'}
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 font-medium">Error:</p>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="font-medium mb-2">Response:</p>
            <pre className="text-sm overflow-auto bg-white p-2 rounded border">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}