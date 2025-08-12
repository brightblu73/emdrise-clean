import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Post-auth routing rule: check if therapist selected
    const selectedTherapist = localStorage.getItem('selectedTherapist');
    if (selectedTherapist) {
      setLocation("/emdr-session");
    } else {
      setLocation("/"); // Go to home to pick therapist first
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Signing you in...</p>
      </div>
    </div>
  );
}