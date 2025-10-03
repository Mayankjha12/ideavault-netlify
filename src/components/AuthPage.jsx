import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react'; // Make sure to install: npm install lucide-react
import AuthForm from '../components/AuthForm';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Logo/Branding Section */}
      <div className="mb-8 text-center">
        {/* Logo Icon with Gradient background */}
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl shadow-xl mb-4"
          style={{
            background: 'linear-gradient(to bottom right, #a855f7, #f97316)', // Purple-to-Orange gradient
          }}
        >
          <Lightbulb className="w-8 h-8 text-white" fill="white" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-800">IdeaVault</h1>
        <p className="mt-2 text-md text-gray-500">
          Share your startup ideas with the world
        </p>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl">
        <AuthForm isSignIn={isSignIn} toggleView={setIsSignIn} />
      </div>
    </div>
  );
};

export default AuthPage;