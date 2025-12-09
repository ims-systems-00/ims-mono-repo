import GuideModal from './GuideModal';

const GuideProvider = ({ children, guideId, ...props }) => {

  return (
    <GuideModal guideId={guideId} {...props}>
      {children}
    </GuideModal>
  );
};

export default GuideProvider;

