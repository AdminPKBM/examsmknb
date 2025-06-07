
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, X, Camera } from 'lucide-react';

interface QRScannerProps {
  onScan: (url: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      setError('Tidak dapat mengakses kamera');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleManualInput = () => {
    const url = prompt('Masukkan URL ujian:');
    if (url) {
      onScan(url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Scan QR Code
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            {error ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">{error}</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 bg-black rounded-lg object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleManualInput}
              variant="outline" 
              className="w-full"
            >
              Input Manual URL
            </Button>
            <Button 
              onClick={() => onScan('https://smknbojonggambir.github.io/psat/')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Gunakan URL Default
            </Button>
          </div>

          <p className="text-sm text-gray-500 text-center">
            Arahkan kamera ke QR Code atau gunakan input manual
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;
