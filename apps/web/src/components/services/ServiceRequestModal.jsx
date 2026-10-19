import React from 'react';
import Modal from '../common/Modal.jsx';
import ServiceRequestForm from '../forms/ServiceRequestForm.jsx';

export default function ServiceRequestModal({ isOpen, onClose, defaultServiceType }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book a Water Purifier Service"
      size="md"
    >
      <ServiceRequestForm
        defaultServiceType={defaultServiceType}
        onSuccess={onClose}
      />
    </Modal>
  );
}
