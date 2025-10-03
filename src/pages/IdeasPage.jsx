

import React from 'react';
import { Lightbulb, Plus, LogOut } from 'lucide-react'; 


const IdeasPage = ({ user, handleSignOut, ideas, setFilter, currentFilter, openSubmitModal }) => {
  const userDisplay = user.email ? user.email.split('@')[0] : 'Guest';

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Header (Updated to match app.jsx style) */}
      <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                  <Lightbulb className="h-6 w-6 text-indigo-600" /> {/* Changed color to indigo-600 */}
                  <h1 className="text-xl font-bold text-gray-900">IdeaVault</h1> 
              </div>
              <div className="flex items-center space-x-3 text-sm">
                  <span className="text-gray-600 hidden sm:inline truncate max-w-xs font-medium">Welcome, {userDisplay}</span>
                  <button
                      onClick={openSubmitModal} // Assuming this function is passed as a prop
                      className="flex items-center px-4 py-2 border border-transparent font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-md"
                  >
                      <Plus className="w-4 h-4 mr-2" />
                      Submit Idea
                  </button>
                  <button
                      onClick={handleSignOut}
                      className="flex items-center text-gray-600 hover:text-red-500 transition duration-150"
                  >
                      <LogOut className="w-5 h-5 mr-1" />
                      Sign Out
                  </button>
              </div>
          </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Startup Ideas</h2>
        <p className="text-gray-500 mb-6">Discover and vote on the next big thing</p>

        {/* 3. Filter Buttons (Updated to match app.jsx style) */}
        <div className="flex space-x-3 mb-6">
          {['Top', 'New'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f.toLowerCase())} // Assuming setFilter is passed
              className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 ${
                currentFilter === f.toLowerCase()
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Ideas List will map over the 'ideas' prop */}
        <div className="space-y-4">
          {/* ... Idea mapping logic using IdeaCard ... */}
        </div>
      </main>
    </div>
  );
};

export default IdeasPage;
