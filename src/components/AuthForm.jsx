import React from 'react';

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

const AuthForm = ({ isSignIn, toggleView }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center border-b border-gray-200">
        <button
          onClick={() => toggleView(true)}
          className={`px-6 py-3 font-semibold transition-all duration-200 ${
            isSignIn ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => toggleView(false)}
          className={`px-6 py-3 font-semibold transition-all duration-200 ${
            !isSignIn ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Sign Up
        </button>
      </div>

      <form className="space-y-4 pt-4">
        {/* Only show Name field for Sign Up */}
        {!isSignIn && (
          <input
            type="text"
            placeholder="Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-150"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-150"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition duration-150"
        />
        <GradientButton>
          {isSignIn ? 'Sign In' : 'Create Account'}
        </GradientButton>
      </form>
    </div>
  );
};

export default AuthForm;