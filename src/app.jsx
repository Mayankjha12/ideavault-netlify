import React from 'react';
import IdeasPage from './pages/IdeasPage.jsx';
import AuthPage from './components/AuthPage.jsx';

function App() {
  // Simple state to toggle between views for demo/testing
  const [isAuthView, setIsAuthView] = React.useState(false); 

  return (
    <>
      <div className="fixed top-2 right-2 z-50">
          <button 
            onClick={() => setIsAuthView(!isAuthView)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded-full shadow-lg"
          >
              Switch to {isAuthView ? 'Ideas' : 'Auth'} Page
          </button>
      </div>

      {isAuthView ? <AuthPage /> : <IdeasPage />}
    </>
  );
}

export default App;
