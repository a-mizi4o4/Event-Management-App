import { useState } from 'react';
import { supabase } from './supabaseClient';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('guest'); 
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Processing...');

    if (isLogin) {
      // --- LOG IN LOGIC ---
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else setMessage('Successfully logged in! (Routing to dashboard coming soon)');
      
    } else {
      // --- SIGN UP LOGIC ---
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        setMessage(error.message);
        return;
      }

      // Save their role to the VIP list you just made!
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, email: email, role: role }]);

        if (profileError) setMessage(profileError.message);
        else setMessage('Account created! You can now log in.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>{isLogin ? 'Log In' : 'Create Account'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        
        {/* Only show the dropdown if they are registering */}
        {!isLogin && (
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '10px' }}>
            <option value="guest">Sign up as Guest</option>
            <option value="host">Sign up as Host</option>
          </select>
        )}

        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>

      <p style={{ color: 'blue', marginTop: '15px' }}>{message}</p>

      <button 
        onClick={() => setIsLogin(!isLogin)} 
        style={{ marginTop: '20px', background: 'none', border: 'none', color: 'gray', cursor: 'pointer', textDecoration: 'underline' }}
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
      </button>
    </div>
  );
}