import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import JsBarcode from "jsbarcode";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import './Generator.css'

const Generator = () => {
  const [data, setData] = useState("");
  const [type, setType] = useState("qr");
  const [format, setFormat] = useState("png");
  const barcodeRef = useRef(null);

  // Generate barcode when the type is "barcode"
  useEffect(() => {
    if (type === "barcode" && data) {
      JsBarcode("#barcode", data, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 50,
        displayValue: true,
      });
    }
  }, [data, type]);

  // Function to download QR Code or Barcode
  const download = async () => {
    const ref = type === "qr" ? document.getElementById("qr-code") : barcodeRef.current;
    if (!ref) return;

    // Convert element to image using html2canvas
    const canvas = await html2canvas(ref);
    const imageData = canvas.toDataURL(`image/${format}`);

    if (format === "pdf") {
      const pdf = new jsPDF();
      pdf.addImage(imageData, "PNG", 10, 10, 100, 100);
      pdf.save("generated_code.pdf");
    } else {
      saveAs(imageData, `generated_code.${format}`);
    }
  };

  return (
    
    <div className="container">
      <p>Name: Rachana Chauhan , 202332700024</p>
      <h3>QR Code and Barcode Generator</h3>
      <input
        type="text"
        placeholder="Enter text or URL"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <select onChange={(e) => setType(e.target.value)}>
        <option value="qr">QR Code</option>
        <option value="barcode">Barcode</option>
      </select>

      <select onChange={(e) => setFormat(e.target.value)}>
        <option value="png">PNG</option>
        <option value="jpg">JPG</option>
        <option value="svg">SVG</option>
        <option value="pdf">PDF</option>
      </select>

      {type === "qr" && (
        <div id="qr-code" className="code-container">
          <QRCodeCanvas value={data} size={200} />
        </div>
      )}

      {type === "barcode" && (
        <div ref={barcodeRef} className="code-container">
          <svg id="barcode"></svg>
        </div>
      )}

      <button onClick={download}>Download {format.toUpperCase()}</button>
    </div>
  );
};

export default Generator;
