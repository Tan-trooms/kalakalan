import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  School,
  KeyRound
} from 'lucide-react';
import { UserProfile, ThemeMode, AuthMode } from '../types';
import { DEMO_ACCOUNTS } from '../data/mockData';
import { DRAWING_AVATARS, DRAWN_AVATAR_PRESETS } from '../data/avatars';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  theme: ThemeMode;
  onAuthSuccess: (user: UserProfile, message?: string) => void;
}

const PRESET_AVATARS = DRAWN_AVATAR_PRESETS.map((p) => p.url);

const CAMPUS_LOCATIONS = [
  'Campus Center',
  'Science Quad',
  'West Village Dorms',
  'Engineering Hall',
  'Library Commons',
  'North Campus Residences',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  theme,
  onAuthSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupLocation, setSignupLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [signupAvatar, setSignupAvatar] = useState(PRESET_AVATARS[0]);
  const [isStudentVerified, setIsStudentVerified] = useState(true);
  const [agreeHonorCode, setAgreeHonorCode] = useState(true);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const isDark = theme === 'dark';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email or campus ID.');
      return;
    }
    if (!loginPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // Check if matches any demo account by email, or create session
    const matchedAccount = DEMO_ACCOUNTS.find(
      (a) => a.email?.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (matchedAccount) {
      onAuthSuccess(matchedAccount, `Welcome back, ${matchedAccount.name}!`);
      onClose();
      return;
    }

    // Allow flexible login for user-provided email
    const namePart = loginEmail.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    const loggedInUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: formattedName || 'Campus Trader',
      email: loginEmail.trim(),
      avatar: PRESET_AVATARS[Math.floor(Math.random() * PRESET_AVATARS.length)],
      initials: (formattedName.slice(0, 2) || 'CT').toUpperCase(),
      trustScore: 'Verified Trader',
      rating: 5.0,
      completedTrades: 1,
      location: 'Campus Center',
      studentId: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: 'Today',
    };

    onAuthSuccess(loggedInUser, `Welcome, ${loggedInUser.name}!`);
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!signupName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim()) {
      setErrorMsg('Please provide your campus or personal email.');
      return;
    }
    if (signupPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeHonorCode) {
      setErrorMsg('Please accept the campus barter honor code.');
      return;
    }

    const nameInitials = signupName
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: signupName.trim(),
      email: signupEmail.trim(),
      avatar: signupAvatar,
      initials: nameInitials || 'CT',
      trustScore: isStudentVerified ? 'Verified Trader' : 'Rising Trader',
      rating: 5.0,
      completedTrades: 0,
      location: signupLocation,
      studentId: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      joinedDate: 'Joined recently',
    };

    onAuthSuccess(newUser, `Account created successfully! Welcome to Kalakalan, ${newUser.name}.`);
    onClose();
  };

  const handleSelectDemoAccount = (account: UserProfile) => {
    onAuthSuccess(account, `Switched to demo profile: ${account.name}`);
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setErrorMsg('Please enter your account email.');
      return;
    }
    setErrorMsg(null);
    setResetSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl z-10 p-6 transition-all ${
        isDark ? 'bg-[#0e172e] text-slate-100 border border-slate-800' : 'bg-white text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-full transition-colors ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Close authentication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 ring-4 ring-emerald-500/10 mb-2.5">
            {mode === 'signup' ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'login' && 'Sign in to Kalakalan'}
            {mode === 'signup' && 'Create Barter Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {mode === 'login' && 'Access your active trades, listings, and campus matches.'}
            {mode === 'signup' && 'Join the peer-to-peer campus exchange network.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Tab Toggle between Login and Signup */}
        {mode !== 'forgot' && (
          <div className={`grid grid-cols-2 p-1 rounded-xl mb-5 border ${
            isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              id="tab-auth-login"
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? isDark 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'bg-white text-emerald-900 shadow-xs'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Log In
            </button>
            <button
              id="tab-auth-signup"
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? isDark 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'bg-white text-emerald-900 shadow-xs'
                  : isDark 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Sign Up
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* ================= LOGIN FORM ================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Email or Campus ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-login-email"
                  type="text"
                  required
                  placeholder="e.g. tristan.gab18@gmail.com or alex.l@campus.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-500' 
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-xs border outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-500' 
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-login"
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Account
            </button>

            {/* Quick Demo Profile Logins for Fast Testing */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Quick Demo Accounts
                </span>
                <div className={`h-px flex-1 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handleSelectDemoAccount(acc)}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all hover:border-emerald-500 active:scale-95 ${
                      isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-white'
                    }`}
                  >
                    <img src={acc.avatar} alt={acc.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold truncate leading-tight">{acc.name}</div>
                      <div className="text-[9px] text-emerald-600 dark:text-emerald-400 truncate">{acc.trustScore}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ================= SIGN UP FORM ================= */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
            {/* Avatar Selector */}
            <div>
              <label className={`block text-xs font-bold mb-1.5 flex items-center justify-between ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <span>Choose Illustrated Avatar (Drawing)</span>
                <span className="text-[10px] text-emerald-500 font-normal">Hand-drawn character</span>
              </label>
              <div className="flex items-center gap-2.5 overflow-x-auto py-1.5 px-0.5 no-scrollbar">
                {DRAWN_AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    title={preset.name}
                    onClick={() => setSignupAvatar(preset.url)}
                    className={`relative rounded-full shrink-0 transition-transform p-0.5 ${
                      signupAvatar === preset.url ? 'ring-2 ring-emerald-500 scale-110 shadow-xs' : 'opacity-75 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-full object-cover bg-white/10" />
                    {signupAvatar === preset.url && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center shadow-xs">
                        <CheckCircle2 className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-name"
                  type="text"
                  required
                  placeholder="e.g. Tristan Gabriel"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-500' 
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Campus or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-email"
                  type="email"
                  required
                  placeholder="student@campus.edu"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2 rounded-xl text-xs border outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-500' 
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Campus Primary Zone */}
            <div>
              <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Primary Campus Handover Spot
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  id="select-signup-location"
                  value={signupLocation}
                  onChange={(e) => setSignupLocation(e.target.value)}
                  className={`w-full pl-10 pr-3.5 py-2 rounded-xl text-xs border outline-none transition-all appearance-none cursor-pointer ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white' 
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900'
                  }`}
                >
                  {CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password
                </label>
                <input
                  id="input-signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Min. 6 chars"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-500' 
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Confirm
                </label>
                <input
                  id="input-signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border outline-none transition-all ${
                    isDark 
                      ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-500' 
                      : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1 text-xs">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isStudentVerified}
                  onChange={(e) => setIsStudentVerified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5"
                />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                  Claim <strong className="text-emerald-500">Verified Trader</strong> status (valid student email)
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeHonorCode}
                  onChange={(e) => setAgreeHonorCode(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 mt-0.5"
                />
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  I agree to fair tier valuation & safe campus handover guidelines.
                </span>
              </label>
            </div>

            {/* Submit Sign Up Button */}
            <button
              id="btn-submit-signup"
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              Create Barter Account
            </button>
          </form>
        )}

        {/* ================= FORGOT PASSWORD ================= */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {resetSent ? (
              <div className={`p-4 rounded-xl text-center space-y-2 border ${
                isDark ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500" />
                <h4 className="font-bold text-sm">Recovery Link Dispatched</h4>
                <p className="text-xs text-slate-400">
                  We have dispatched password reset instructions to <strong>{resetEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setResetSent(false);
                  }}
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900"
                >
                  Return to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Account Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="input-forgot-email"
                      type="email"
                      required
                      placeholder="student@campus.edu"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border outline-none transition-all ${
                        isDark 
                          ? 'bg-slate-900 border-slate-700 focus:border-emerald-500 text-white placeholder:text-slate-500' 
                          : 'bg-slate-50 border-slate-200 focus:border-emerald-600 text-slate-900 placeholder:text-slate-400'
                      }`}
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-forgot"
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  Send Reset Link
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-slate-400 hover:text-emerald-500 font-semibold"
                  >
                    Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
