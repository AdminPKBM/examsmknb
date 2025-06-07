
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, QrCode, ExternalLink, LogOut, Link } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import QRScanner from './QRScanner';
import AdminPasswordDialog from './AdminPasswordDialog';

const Dashboard = () => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  
  const { student, startExam, logout, examUrl, setExamUrl } = useAppStore();

  const handleStartExamWithUrl = (url: string) => {
    const exam = {
      id: 'custom-' + Date.now(),
      title: 'Ujian Online',
      url,
      isActive: true,
      startTime: new Date(),
      endTime: new Date(Date.now() + 120 * 60000), // 2 hours
    };
    startExam(exam);
  };

  const handleQRScan = (url: string) => {
    handleStartExamWithUrl(url);
    setShowQRScanner(false);
  };

  const handleCustomLink = () => {
    if (customUrl.trim()) {
      setExamUrl(customUrl.trim());
      handleStartExamWithUrl(customUrl.trim());
      setShowLinkInput(false);
      setCustomUrl('');
    }
  };

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 p-0.5 shadow-md">
                <img 
                  src="/lovable-uploads/663c342d-979f-4bce-8809-f8e52f9749f8.png" 
                  alt="Logo SMK Negeri Bojonggambir"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SMK Negeri Bojonggambir</h1>
              <p className="text-sm text-gray-600">ExamBrowser - Sistem Ujian Online</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowLogoutDialog(true)}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Student Info */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informasi Siswa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Nama</p>
                <p className="text-lg font-semibold text-gray-900">{student?.nama}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Username</p>
                <p className="text-lg font-semibold text-gray-900">{student?.username}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Kelas</p>
                <p className="text-lg font-semibold text-gray-900">{student?.kelas}</p>
              </div>
            </div>
            {student?.level && (
              <div className="mt-6 flex items-center space-x-2">
                <Badge 
                  variant={student.level === 'admin' ? 'default' : 'secondary'}
                  className={student.level === 'admin' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : ''}
                >
                  {student.level === 'admin' ? 'Administrator' : 'Siswa'}
                </Badge>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Status Aktif</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
            <CardTitle>Akses Cepat</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button 
                onClick={() => setShowQRScanner(true)}
                className="h-24 p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg transform transition-all duration-200 hover:scale-105"
                variant="outline"
              >
                <QrCode className="w-8 h-8" />
                <div className="text-center">
                  <div className="font-semibold">Scan QR Code</div>
                  <div className="text-xs opacity-90">Scan untuk akses ujian</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => setShowLinkInput(true)}
                className="h-24 p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0 shadow-lg transform transition-all duration-200 hover:scale-105"
                variant="outline"
              >
                <Link className="w-8 h-8" />
                <div className="text-center">
                  <div className="font-semibold">Masukan Link</div>
                  <div className="text-xs opacity-90">Input manual URL ujian</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => handleStartExamWithUrl(examUrl)}
                className="h-24 p-6 flex flex-col items-center gap-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                <ExternalLink className="w-8 h-8" />
                <div className="text-center">
                  <div className="font-semibold">Akses Langsung</div>
                  <div className="text-xs opacity-90">Ke ujian utama</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Link Input */}
        {showLinkInput && (
          <Card className="shadow-lg border-0 border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="text-orange-700">Masukkan Link Ujian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customUrl" className="text-gray-700 font-medium">URL Ujian</Label>
                <Input
                  id="customUrl"
                  type="url"
                  placeholder="https://example.com/exam"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleCustomLink} 
                  disabled={!customUrl.trim()}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  Mulai Ujian
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowLinkInput(false)}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner 
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {/* Admin Password Dialog */}
      {showLogoutDialog && (
        <AdminPasswordDialog
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutDialog(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
