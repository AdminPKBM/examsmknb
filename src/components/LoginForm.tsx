
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAppStore(state => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Username atau password salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-red-500 to-green-600 p-4">
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      <Card className="w-full max-w-md shadow-2xl relative z-10 border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          {/* Logo SMKNB */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 p-1 shadow-lg">
                <img 
                  src="/lovable-uploads/663c342d-979f-4bce-8809-f8e52f9749f8.png" 
                  alt="Logo SMK Negeri Bojonggambir"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                SMK Negeri Bojonggambir
              </h1>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-1 w-8 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full"></div>
                <p className="text-lg font-semibold text-blue-600">ExamBrowser</p>
                <div className="h-1 w-8 bg-gradient-to-r from-red-500 to-green-600 rounded-full"></div>
              </div>
              <p className="text-sm text-gray-600 font-medium">Kabupaten Tasikmalaya</p>
            </div>
          </div>
          <CardDescription className="text-center text-gray-700">
            Masuk untuk mengakses sistem ujian online yang aman dan terpercaya
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username Anda"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                'Masuk ke Sistem'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sistem Aktif</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Aman & Terpercaya</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              © 2024 SMK Negeri Bojonggambir
            </p>
            <p className="text-xs text-gray-400">
              Sistem Ujian Online Terpadu v2.0
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
