import React, { useRef } from "react";
import QRCode from "react-qr-code";
import * as htmlToImage from "html-to-image";

const QrCodeGenerator = () => {
  const qrCodeRef = useRef(null);

  const downloadQRCode = () => {
    htmlToImage
      .toPng(qrCodeRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qr-code.png";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };
  return (
    <div className='qrcode__container'>
      <h1>QR Code </h1>
      <div className='qrcode__container--parent' ref={qrCodeRef}>
        <div className='qrcode__download'>
          <div className='qrcode__image'>
            <QRCode value='https://uplift-clinic2.web.app/patient_sign_in/uplift' size={300} />
          </div>
          <button onClick={downloadQRCode}>Download QR Code</button>
        </div>
      </div>
    </div>
  );
};

export default QrCodeGenerator;
