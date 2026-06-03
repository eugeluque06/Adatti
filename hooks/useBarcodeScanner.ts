import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as BarcodeScanner from 'expo-barcode-scanner';

export interface BarcodeData {
  type: string;
  data: string;
  timestamp: string;
}

export const useBarcodeScanner = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<BarcodeData | null>(null);
  const [scanHistory, setScanHistory] = useState<BarcodeData[]>([]);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await BarcodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    const newData: BarcodeData = {
      type,
      data,
      timestamp: new Date().toISOString()
    };
    
    setScannedData(newData);
    setScanHistory(prev => [newData, ...prev.slice(0, 49)]); // Mantener últimos 50
  };

  const clearScannedData = () => {
    setScannedData(null);
  };

  return {
    hasPermission,
    scannedData,
    scanHistory,
    handleBarCodeScanned,
    requestPermission,
    clearScannedData
  };
};