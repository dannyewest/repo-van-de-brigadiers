import TopNav from "./TopNav.jsx";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import PrivacyPolicy from "./PrivacyPolicy.jsx";

type Props = {
  children: React.ReactNode;
};

export default function Shell({ children }: Props) {
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleClose = () => () => setShowPrivacy(false);
  const handleShow = () => () => setShowPrivacy(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopNav />
      
      <main className="flex-grow mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <footer
        className="mt-8 border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-600"
        aria-label="Application Footer"
      >
        © {new Date().getFullYear()} Brigadiers, All rights reserved. |
        <span onClick={handleShow()} className="ms-2" style={{ cursor: 'pointer', textDecoration: 'underline' }} role="button" tabIndex={0} onKeyPress={(e) => { if (e.key === 'Enter') handleShow()(); }}>
          Privacy
        </span>
      </footer>

      {/* Privacy Policy Modal */}
      <Modal show={showPrivacy} onHide={handleClose()} size="lg" aria-labelledby="privacy-policy-modal">
        <Modal.Header closeButton>
          <Modal.Title id="privacy-policy-modal">Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PrivacyPolicy />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose()}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

