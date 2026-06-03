import React from 'react';
import { StyleSheet } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';

interface ScannerProps {
  onBarcodeScanned: (data: { type: string; data: string }) => void;
}

export default function Scanner({ onBarcodeScanned }: ScannerProps) {
  return (
    <CameraView
      style={StyleSheet.absoluteFillObject}
     // facing={CameraType.back}
      onBarcodeScanned={onBarcodeScanned}
      barcodeScannerSettings={{
        barcodeTypes: [
          'aztec',
          'ean13',
          'ean8',
          'qr',
          'pdf417',
          'upc_e',
          'datamatrix',
          'code39',
          'code93',
          'itf14',
          'codabar',
          'code128',
          'upc_a'
        ]
      }}
    />
  );
}