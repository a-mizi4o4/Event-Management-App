import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import HostDashboard from './HostDashboard';
import GuestEvents from './GuestEvents';

function App() {
  const [session, setSession] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // 1. Check if a user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) getProfile(session.user.id);
    });

    // 2. Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) getProfile(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Fetch the role from the profiles table
  async function getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (data) setUserRole(data.role);
  }

  // --- TRAFFIC COP LOGIC ---
  if (!session) {
    return <Auth />; // If not logged in, show Login/Register
  }

  if (userRole === 'host') {
    return <HostDashboard />; // If Host, show Dashboard
  }

  if (userRole === 'guest') {
    return <GuestEvents />; // If Guest, show Events list
  }

  return <div>Loading profile...</div>;
}

export default App;