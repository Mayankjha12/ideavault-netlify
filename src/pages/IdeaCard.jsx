import React, { useState } from 'react';
import { ArrowUp, MessageSquare } from 'lucide-react';

const IdeaCard = ({ idea }) => {
  const [votes, setVotes] = useState(idea.initialVotes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(votes + 1);
      setHasVoted(true);
    } else {
      setVotes(votes - 1);
      setHasVoted(false);
    }
  };

  return (
    <div className="flex bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      
      {/* Upvote Column */}
      <div className="flex flex-col items-center justify-start p-4 bg-gray-50 border-r border-gray-100">
        <button
          onClick={handleVote}
          className={`flex flex-col items-center p-2 rounded-xl transition-colors duration-200 ${
            hasVoted
              ? 'bg-violet-100 text-violet-600'
              : 'text-gray-500 hover:bg-gray-100 hover:text-violet-500'
          }`}
        >
          <ArrowUp className="w-5 h-5" />
          <span className="text-sm font-bold mt-1">{votes}</span>
        </button>
      </div>

      {/* Content Column */}
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{idea.title}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{idea.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {/* Tags (optional) */}
          <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full font-medium">
            {idea.category}
          </span>
          
          {/* Comments/Discussions */}
          <div className="flex items-center space-x-1 hover:text-violet-600 cursor-pointer transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>{idea.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;