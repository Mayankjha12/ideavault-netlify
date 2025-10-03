import React, { useState } from 'react';

const GradientButton = ({ children, onClick, disabled = false, type = 'submit' }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3 mt-4 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
    style={{
      background: 'linear-gradient(to right, #a855f7, #f97316)', // Purple-to-Orange gradient
    }}
  >
    {children}
  </button>
);

// Receive the handleAuth prop
const AuthForm = ({ isSignIn, toggleView, handleAuth }) => { 
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear form state when switching between Sign In and Sign Up
  const handleToggle = (view) => {
    toggleView(view);
    setUsername('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const type = isSignIn ? 'signIn' : 'signUp';
    
    // Call the authentication handler passed from App.jsx
    const result = handleAuth(type, email, password, username);

    if (result.success) {
      // Success: App.jsx handles setting the user and redirecting
    } else {
      // Error
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center border-b border-gray-200">
        <button
          onClick={() => handleToggle(true)} // Use handleToggle
          className={`px-6 py-3 font-semibold transition-all duration-200 ${
            isSignIn ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => handleToggle(false)} // Use handleToggle
          className={`px-6 py-3 font-semibold transition-all duration-200 ${
            !isSignIn ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign Up
        </button>
      </div>
      
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form className="space-y-4 pt-4" onSubmit={handleSubmit}>
        {/* Only show Username field for Sign Up */}
        {!isSignIn && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-150"
            required={!isSignIn}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-150"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-150"
          required
        />
        <GradientButton disabled={loading}>
          {loading ? 'Loading...' : (isSignIn ? 'Sign In' : 'Sign Up')}
        </GradientButton>
      </form>
    </div>
  );
};

export default AuthForm;
