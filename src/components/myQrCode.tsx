// src/components/MyQRCode.tsx
import { QRCodeSVG } from "qrcode.react";

export function MyQRCode({ value }: { value: string }) {
  return <QRCodeSVG value={value} size={150} />;
}

export default MyQRCode;