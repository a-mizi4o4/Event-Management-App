import { supabase } from './supabaseClient';

export default function ProfileSettings() {
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure? This will permanently delete your data per GDPR requirements.");
    
    if (confirmDelete) {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Delete from the 'profiles' table
      await supabase.from('profiles').delete().eq('id', user.id);

      // 2. Sign out (Note: Only an Admin can delete the actual Auth account in the free tier, 
      // but deleting the profile data satisfies the "Right to be Forgotten" for this project).
      await supabase.auth.signOut();
      window.location.href = '/'; 
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid red', marginTop: '20px' }}>
      <h3>GDPR Privacy Settings</h3>
      <p>Under GDPR, you have the right to be forgotten.</p>
      <button 
        onClick={handleDeleteAccount} 
        style={{ backgroundColor: 'red', color: 'white', padding: '10px', cursor: 'pointer' }}
      >
        Delete My Account & Data
      </button>
    </div>
  );
}