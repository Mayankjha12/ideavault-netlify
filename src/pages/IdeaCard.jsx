import React from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

const LOCAL_USER_ID = 'local-storage-user'; // Needs to be defined or passed

// IdeaCard now expects idea, handleVote, and handleDelete props from IdeasPage/app.jsx
const IdeaCard = ({ idea, handleVote, handleDelete }) => {
  const isOwner = true; // Still true for local storage
  const hasVoted = idea.voters && idea.voters[LOCAL_USER_ID];
  const voteCount = idea.votes || 0;

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this idea?")) {
        handleDelete(idea.id);
    }
  };

  return (
    // Updated container shadow and border
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex space-x-4">
      
      {/* Upvote Column (Matches app.jsx structure) */}
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={() => handleVote(idea.id, 1)}
          className={`p-1 rounded-full transition duration-150 ${hasVoted === 1 ? 'text-indigo-600 bg-indigo-100' : 'text-gray-400 hover:text-indigo-500'}`}
          title="Upvote"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        {/* Vote count styling matches app.jsx */}
        <span className={`font-bold text-xl mt-1 mb-1 ${voteCount > 0 ? 'text-green-600' : voteCount < 0 ? 'text-red-600' : 'text-gray-700'}`}>
          {voteCount}
        </span>
        <button
          onClick={() => handleVote(idea.id, -1)}
          className={`p-1 rounded-full transition duration-150 ${hasVoted === -1 ? 'text-red-600 bg-red-100' : 'text-gray-400 hover:text-red-500'}`}
          title="Downvote"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* Content Column */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900">{idea.title}</h3>
          {/* Delete Button (Added from app.jsx) */}
          {isOwner && (
            <button
              onClick={confirmDelete}
              className="text-red-500 hover:text-red-700 p-1 transition duration-150"
              title="Delete Idea"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-gray-600 mt-1">{idea.description}</p>
        <div className="mt-3 text-sm text-gray-500">
          {/* Category color changed to indigo */}
          <span className="font-medium text-indigo-600 mr-2">{idea.category || 'General'}</span>
          <span className="text-xs">
            Shared by: {idea.userEmail ? idea.userEmail.split('@')[0] : 'Local User'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
