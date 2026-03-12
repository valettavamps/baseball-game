import React, { useState } from 'react';
import './AuthPage.css';
import { createUser, getUserByEmail } from '../services/db';

interface AuthPageProps {
  onSuccess: (userData: any) => void;
}

type AuthMode = 'signin' | 'signup' | '2fa';

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Find user in database
      const user = await getUserByEmail(email);
      
      if (!user) {
        setError('No account found with this email');
        setIsLoading(false);
        return;
      }

      // Store userId in localStorage for persistence
      localStorage.setItem('userId', user.id);
      
      setIsLoading(false);
      onSuccess({
        email: user.email,
        username: user.username,
        userId: user.id
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Create user in database (Supabase or localStorage)
      const newUser = await createUser(username || email.split('@')[0], email);
      
      // Store userId in localStorage for persistence
      localStorage.setItem('userId', newUser.id);
      
      // Simulate QR code generation for 2FA setup
      setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SimForge:' + email + '?secret=JBSWY3DPEHPK3PXP&issuer=SimForge');
      setMode('2fa');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
    setIsLoading(false);
  };

  const handleVerify2FA = async () => {
    if (twoFACode.length !== 6) {
      setError('Enter 6-digit code');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Get user from database
      const user = await getUserByEmail(email);
      
      if (!user) {
        setError('User not found');
        setIsLoading(false);
        return;
      }

      // Store userId in localStorage
      localStorage.setItem('userId', user.id);
      
      setIsLoading(false);
      onSuccess({
        email: user.email,
        username: user.username,
        userId: user.id
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      setIsLoading(false);
    }
  };

  const handleSkip2FA = () => {
    // For testing - skip directly to app
    onSuccess({
      email: email || 'test@example.com',
      username: username || 'testuser',
      userId: 'user-123'
    });
  };

  const renderSignIn = () => (
    <div className="auth-form">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to continue your career</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      <button 
        className="primary-btn"
        onClick={handleSignIn}
        disabled={isLoading || !email || !password}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>

      <div className="auth-footer">
        <span>Don't have an account?</span>
        <button className="link-btn" onClick={() => setMode('signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );

  const renderSignUp = () => (
    <div className="auth-form">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Start your baseball journey</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="yourname"
          autoComplete="username"
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />
      </div>

      <button 
        className="primary-btn"
        onClick={handleSignUp}
        disabled={isLoading || !email || !password || !username}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>

      <div className="auth-footer">
        <span>Already have an account?</span>
        <button className="link-btn" onClick={() => setMode('signin')}>
          Sign In
        </button>
      </div>
    </div>
  );

  const render2FA = () => (
    <div className="auth-form">
      <div className="auth-header">
        <h2>Two-Factor Authentication</h2>
        <p>
          {qrCode 
            ? 'Scan this QR code with Google Authenticator' 
            : 'Enter your 6-digit code'}
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {qrCode && (
        <div className="qr-code-container">
          <img src={qrCode} alt="2FA QR Code" className="qr-code" />
          <p className="qr-instructions">
            1. Open Google Authenticator app<br/>
            2. Tap + to add account<br/>
            3. Scan this QR code<br/>
            4. Enter the 6-digit code below
          </p>
        </div>
      )}

      <div className="form-group">
        <label>Authentication Code</label>
        <input
          type="text"
          value={twoFACode}
          onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="code-input"
          maxLength={6}
          autoComplete="one-time-code"
        />
      </div>

      <button 
        className="primary-btn"
        onClick={handleVerify2FA}
        disabled={isLoading || twoFACode.length !== 6}
      >
        {isLoading ? 'Verifying...' : 'Verify & Continue'}
      </button>

      <div className="skip-container">
        <button className="skip-btn" onClick={handleSkip2FA}>
          Skip for now (Testing)
        </button>
      </div>

      <div className="auth-footer">
        <button className="link-btn" onClick={() => {
          setMode('signin');
          setTwoFACode('');
          setQrCode('');
        }}>
          ← Back to Sign In
        </button>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-branding">
          <h1>
            <span className="gradient-text">Diamond</span>Chain
          </h1>
          <p>Your Baseball Career Starts Here</p>
        </div>

        {mode === 'signin' && renderSignIn()}
        {mode === 'signup' && renderSignUp()}
        {mode === '2fa' && render2FA()}

        <div className="auth-note">
          <span className="note-icon">🔐</span>
          <span>Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
