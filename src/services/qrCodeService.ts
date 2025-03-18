import QRCode from "qrcode";

export const generateQRCode = async (data: string, size: number = 300): Promise<string> => {
  try {
    return await QRCode.toDataURL(data, {
      width: size,
      margin: 1,
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};
