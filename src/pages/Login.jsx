import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Lock, Mail, Smartphone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import './Login.css';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await signIn({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card animate-fade-in">
        <div className="login-header">
          <div className="login-logo">
            <Smartphone size={32} color="var(--color-accent)" />
          </div>
          <h1>Sebos Book</h1>
          <p>{isSignUp ? 'Create your retailer account' : 'Welcome back, sign in to your store'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="badge badge--loss" style={{ width: '100%', marginBottom: '1rem' }}>{error}</div>}
          
          <div className="input-group">
            <label className="input-label">Email</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                className="input" 
                placeholder="store@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <Mail size={18} className="text-muted" style={{ position: 'absolute', right: '12px', top: '12px' }} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                className="input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <Lock size={18} className="text-muted" style={{ position: 'absolute', right: '12px', top: '12px' }} />
            </div>
          </div>

          <button className="btn btn--primary btn--full btn--lg" disabled={loading}>
            {loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
            {isSignUp ? <UserPlus size={18} /> : <LogIn size={18} />}
          </button>
        </form>

        <div className="login-footer">
          <button className="btn btn--ghost btn--sm" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
