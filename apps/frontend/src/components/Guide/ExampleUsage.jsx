import { Caption, Content, Guide, GuideProvider, Title } from './index';

// Example usage in any component/page
const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <p>This is your home page content...</p>
      
      {/* Guide Modal - will show automatically on first visit */}
      <GuideProvider 
        guideId="home-page-guide" 
        title="Welcome to IMS Systems"
        onComplete={() => console.log('Guide completed!')}
        onClose={() => console.log('Guide closed!')}
        className="custom-guide-modal"
      >
        {/* Slide 1: Image only */}
        <Guide className="d-flex align-items-center justify-content-center p-4">
          <img 
            src="https://picsum.photos/800/320" 
            alt="Welcome" 
            className="img-fluid rounded shadow"
          />
        </Guide>
        
        {/* Slide 2: Image + caption */}
        <Guide>
          <img 
            src="https://picsum.photos/800/320" 
            alt="Navigation" 
            className="img-fluid rounded"
          />
          <Caption>
            <h5 className="mb-1">Navigate faster</h5>
            <p className="mb-0">Use the sidebar to switch sections, or the search to jump directly.</p>
          </Caption>
        </Guide>
        
        {/* Slide 3: Title + content (no image) */}
        <Guide className="p-4 d-flex align-items-center">
          <div className="w-100">
            <Title>Get the most out of your dashboard</Title>
            <Content className="text-muted">
              <p>Your dashboard highlights key metrics and shortcuts.</p>
              <ul className="mb-0">
                <li>Track performance in real time</li>
                <li>Jump to sections with quick actions</li>
                <li>Customize widgets to your workflow</li>
              </ul>
            </Content>
          </div>
        </Guide>
      </GuideProvider>
    </div>
  );
};

export default HomePage;
