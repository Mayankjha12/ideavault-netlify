import React from 'react';
import { Lightbulb, Sun, Clock, TrendingUp } from 'lucide-react';
import IdeaCard from '../components/IdeaCard';

// Dummy Data
const DUMMY_IDEAS = [
  { id: 1, title: 'AI-Powered Resume Builder', description: 'Uses LLMs to analyze job descriptions and tailor resumes instantly. Saves job seekers hours of work.', category: 'AI/SaaS', initialVotes: 45, comments: 12 },
  { id: 2, title: 'Decentralized Energy Trading Platform', description: 'A blockchain platform allowing homeowners with solar panels to sell surplus energy directly to neighbors.', category: 'Web3/Energy', initialVotes: 32, comments: 5 },
  { id: 3, title: 'Micro-Learning Platform for Coding', description: '10-minute daily coding challenges delivered via WhatsApp/Telegram to keep developers sharp.', category: 'Education/Mobile', initialVotes: 15, comments: 3 },
];

const IdeasPage = () => {
  // A custom button component for the gradient effect
  const GradientButton = ({ children, className = '', onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 px-4 py-2 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] ${className}`}
      style={{
        background: 'linear-gradient(to right, #a855f7, #f97316)', // Purple-to-Orange gradient
      }}
    >
      {children}
    </button>
  );

  const navItems = [
    { name: 'Hot', icon: Sun, active: false },
    { name: 'New', icon: Clock, active: true }, // 'New' is active by default in the image
    { name: 'Top', icon: TrendingUp, active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 text-xl font-extrabold text-gray-800">
            <Lightbulb className="w-6 h-6 text-violet-600" />
            <span className="hidden sm:inline">IdeaVault</span>
          </div>

          {/* User & CTA */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 font-medium hidden md:inline">Welcome, MKJ523</span>
            <button className="text-gray-500 hover:text-gray-700 transition">Sign Out</button>
            <GradientButton>
              <span>Submit Idea</span>
            </GradientButton>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Startup Ideas</h1>
        <p className="text-gray-500 mt-1 mb-6">Discover and vote on the next big thing</p>

        {/* Navigation/Filter */}
        <div className="flex space-x-2 mb-8 p-1 bg-white rounded-xl shadow-inner max-w-fit border border-gray-200">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                item.active
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Ideas List */}
        <div className="space-y-6">
          {DUMMY_IDEAS.length > 0 ? (
            DUMMY_IDEAS.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))
          ) : (
            <div className="text-center p-20 bg-white rounded-xl shadow-lg">
              <p className="text-lg text-gray-500">No ideas yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IdeasPage;