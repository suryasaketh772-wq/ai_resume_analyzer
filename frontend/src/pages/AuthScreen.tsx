import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        const response = await authAPI.login(formData);
        login(response.data.access_token);
        navigate('/workspace');
      } else {
        if (password.length < 8) {
          setError('Password must be at least 8 characters long');
          setLoading(false);
          return;
        }
        await authAPI.register({ email, password });
        setSuccess('Registration successful! Switching to login...');
        setTimeout(() => setIsLogin(true), 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || `${isLogin ? 'Login' : 'Registration'} failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-all duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-down">
        <div className="flex justify-center">
          <div className={`w-12 h-12 bg-blue-600 rounded-xl shadow-lg flex items-center justify-center transform transition-transform duration-300 ${isLogin ? 'rotate-3 hover:rotate-0' : '-rotate-3 hover:rotate-0'}`}>
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? 'Sign in to your AI Resume Analyzer account' : 'Start analyzing your resume today'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-fade-in-up">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Alert type="error" message={error} isVisible={!!error} />
            <Alert type="success" message={success} isVisible={!!success} />
            
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isLogin ? "••••••••" : "Min. 8 characters"}
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              rightIcon={showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            <div className="pt-2">
              <Button type="submit" isLoading={loading} fullWidth>
                {isLogin ? 'Sign in' : 'Sign up'}
              </Button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm">
            <span className="text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button 
              onClick={toggleMode}
              className="font-bold text-blue-600 hover:text-blue-500 transition-colors bg-transparent border-none cursor-pointer"
            >
              {isLogin ? 'Sign up now' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
