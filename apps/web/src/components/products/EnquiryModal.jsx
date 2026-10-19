import Modal from '../common/Modal.jsx';
import EnquiryForm from '../forms/EnquiryForm.jsx';

export default function EnquiryModal({ isOpen, onClose, product }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? `Enquire About ${product.name}` : 'Product Enquiry'}
      size="md"
    >
      <EnquiryForm product={product} onSuccess={onClose} />
    </Modal>
  );
}
