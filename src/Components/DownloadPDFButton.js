import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

function DownloadPDF({ url, generateDataPDF, title = "PDF", buttonText = "Generate PDF", disabled, downloadFileName = "document.pdf" }) {
  const [show, setShow] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPdf = async () => {
    setLoading(true);
    try {
      const response = await axios.post(url, generateDataPDF(), {
        responseType: 'blob',
      });

      const objectUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPdfUrl(objectUrl);
      setShow(true);
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const downloadPdf = (pdfBlobUrl, fileName) => {
    const link = document.createElement('a');
    link.href = pdfBlobUrl;
    link.download = fileName; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setShow(false);
    window.URL.revokeObjectURL(pdfUrl);
    setPdfUrl('');
  };

  return (
    <>
      <Button disabled={disabled || loading} variant="dark" onClick={fetchPdf}>
        {loading ? <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> Loading...</> : buttonText}
      </Button>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfUrl && <iframe src={pdfUrl} title="PDF" style={{ width: '100%', height: '500px' }}></iframe>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => downloadPdf(pdfUrl, downloadFileName)}>
            Download PDF
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DownloadPDF;
