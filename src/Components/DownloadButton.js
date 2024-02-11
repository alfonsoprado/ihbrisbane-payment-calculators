import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

function PdfModal({ url, generateDataPDF, title = "PDF", buttonText = "Generate PDF", disabled }) {
  const [show, setShow] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPdf = async () => {
    setLoading(true);
    try {
      const response = await axios.post(url, generateDataPDF(), {
        responseType: 'blob', 
      });

      const objectUrl = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
      setPdfUrl(objectUrl);
      setShow(true);
    } catch (error) {
      console.error('Error:', error);
    }
    finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    window.URL.revokeObjectURL(pdfUrl); 
    setPdfUrl('');
  };

  return (
    <>
      <Button disabled={disabled || loading} variant="dark" onClick={fetchPdf}>
        {loading ? "Loading..." : buttonText}
      </Button>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfUrl && <iframe src={pdfUrl} title="PDF" style={{width: '100%', height: '500px'}}></iframe>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PdfModal;
