import { Button, Modal, ModalBody, ModalHeader } from '@ims-systems-00/ims-ui-kit';
import { Children, useEffect, useMemo, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';

const GuideModal = ({
  guideId,
  children,
  title = "Guide",
  showCloseButton = true,
  autoShow = true,
  onClose = () => { },
  onComplete = () => { },
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    if (autoShow) {
      const isAcknowledged = localStorage.getItem(`guide_${guideId}_acknowledged`);
      if (!isAcknowledged) {
        setIsOpen(true);
      }
    }
  }, [guideId, autoShow]);

  const handleClose = () => {
    // Mark as acknowledged in localStorage
    localStorage.setItem(`guide_${guideId}_acknowledged`, 'true');
    setIsOpen(false);
    onClose();
  };

  const handleComplete = () => {
    // Mark as acknowledged in localStorage
    localStorage.setItem(`guide_${guideId}_acknowledged`, 'true');
    setIsOpen(false);
    onComplete();
  };
  const slidesArray = useMemo(() => Children.toArray(children), [children]);
  const slideCount = slidesArray.length;
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };
  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      size="lg"
      centered
      className={className}
    >
      <ModalHeader toggle={showCloseButton ? handleClose : undefined} className="bg-light">
        <div className="d-flex align-items-center">
          <span className="fw-bold">{title}</span>
          <span className="ms-2 badge bg-secondary">
            {slideCount}
          </span>
        </div>
      </ModalHeader>
      <ModalBody>
        <Carousel activeIndex={activeIndex} onSelect={handleSelect} interval={null}>
          {slidesArray.map((slide, index) => {
            const kids = Children.toArray(slide.props?.children || []);
            const captionNode = kids.find(
              (node) => node?.type?.displayName === 'Caption' || node?.type?.name === 'Caption'
            );
            const bodyNodes = captionNode ? kids.filter((n) => n !== captionNode) : kids;

            return (
              <Carousel.Item key={index}>
                {bodyNodes}
                {captionNode}
              </Carousel.Item>
            );
          })}
        </Carousel>

        <div className="d-flex justify-content-end align-items-center p-3 border-top">
          <Button color="success" onClick={handleComplete} size="sm">
            <i className="fas fa-check me-1"></i>
            Complete
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default GuideModal;
