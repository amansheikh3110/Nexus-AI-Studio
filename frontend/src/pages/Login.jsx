import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username,   setUsername]   = useState('');
  const [password,   setPassword]   = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const { login, register }         = useAuth();
  const navigate                    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      if (isRegister) await register(username.trim(), password);
      else            await login(username.trim(), password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-base overflow-hidden">

      {/* ── Left panel (decorative, desktop only) ── */}
      <div className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden bg-mesh-dark">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full bg-accent2/15 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y:  0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-center px-12"
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/30 glow-accent
                            flex items-center justify-center">
              <Sparkles size={26} className="text-accent" />
            </div>
            <span className="text-3xl font-bold text-c-text">NexusAI</span>
          </div>

          <h2 className="text-4xl font-bold text-c-text leading-tight mb-4">
            The AI assistant<br />
            <span className="text-gradient">built for you</span>
          </h2>
          <p className="text-c-muted text-lg leading-relaxed max-w-sm mx-auto">
            Intelligent conversations, beautiful responses,<br />
            and the tools you need — all in one place.
          </p>

          {/* Feature dots */}
          <div className="flex flex-col gap-3 mt-10 text-left max-w-xs mx-auto">
            {[
              'Multiple AI models with instant fallback',
              'Beautiful markdown & code rendering',
              'Full conversation history',
              'Custom themes & personalization',
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1,  x: 0  }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-2.5 text-sm text-c-muted"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex items-center justify-center w-full lg:w-[480px] lg:flex-shrink-0 p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y:  0  }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Sparkles size={20} className="text-accent" />
            </div>
            <span className="text-xl font-bold text-c-text">NexusAI</span>
          </div>

          <h1 className="text-2xl font-bold text-c-text mb-1">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="text-c-muted text-sm mb-8">
            {isRegister
              ? 'Start your AI journey today'
              : 'Sign in to continue your conversations'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="text-xs font-medium text-c-muted mb-1.5 block uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="your_username"
                required
                className="input-field"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-medium text-c-muted mb-1.5 block uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-field pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-c-muted hover:text-c-text transition"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400 bg-red-400/8 border border-red-400/20 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading  ? { scale: 0.99 } : {}}
              className="btn-accent w-full py-3 rounded-xl text-sm font-semibold
                         flex items-center justify-center gap-2.5 disabled:opacity-60 mt-2"
            >
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <>
                    {isRegister ? 'Create Account' : 'Sign In'}
                    <ArrowRight size={16} />
                  </>
              }
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-c-muted mt-6">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => { setIsRegister(p => !p); setError(''); }}
              className="text-accent font-medium hover:underline underline-offset-2 transition"
            >
              {isRegister ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}