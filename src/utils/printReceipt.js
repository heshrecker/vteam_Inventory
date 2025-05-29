// src/utils/printReceipt.js

export const printReceipt = (elementRef) => {
  if (!elementRef || !elementRef.current) return;

  const printContents = elementRef.current.innerHTML;
  const newWindow = window.open('', '', 'width=600,height=600');

  newWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .signature-box {
            border: 1px solid #000;
            height: 80px;
            width: 100%;
            margin-top: 40px;
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
    </html>
  `);

  newWindow.document.close();

  newWindow.focus();
  newWindow.onload = () => {
    newWindow.print();
    setTimeout(() => newWindow.close(), 500);
  };
};
