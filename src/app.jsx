import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Loader, Zap, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import AuthPage from './AuthPage'; // Ensure AuthPage.jsx exists in the same directory

// =================================================================
// 0. LOCAL STORAGE & DATA UTILS
// =================================================================

// Local Storage Keys
const AUTH_KEY = 'ideaVaultUser';
const EMAIL_KEY = 'ideaVaultUserEmail';
const IDEAS_KEY = 'ideaVaultIdeas';

// Fixed User ID for Local Storage version
const LOCAL_USER_ID = 'local-storage-user';

// Function to safely load ideas from Local Storage
const loadIdeas = () => {
    try {
        const storedIdeas = localStorage.getItem(IDEAS_KEY);
        return storedIdeas ? JSON.parse(storedIdeas) : [];
    } catch (e) {
        return [];
    }
};

// Function to safely save ideas to Local Storage
const saveIdeas = (ideas) => {
    try {
        localStorage.setItem(IDEAS_KEY, JSON.stringify(ideas));
    } catch (e) {
        // Handle error if storage is full
    }
};

// =================================================================
// 1. IDEAS PAGE (IdeasPage Component) - Your main app content
// =================================================================

const IdeaCard = ({ idea, handleVote, handleDelete }) => {
    // Everyone is the 'owner' for local storage version simplicity
    const isOwner = true; 
    const hasVoted = idea.voters && idea.voters[LOCAL_USER_ID];
    const voteCount = idea.votes || 0;
    
    // NOTE: Using window.confirm instead of a custom modal 
    const confirmDelete = () => {
        if (window.confirm("Are you sure you want to delete this idea?")) {
            handleDelete(idea.id);
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex space-x-4">
            <div className="flex flex-col items-center justify-center">
                <button
                    onClick={() => handleVote(idea.id, 1)}
                    className={`p-1 rounded-full transition duration-150 ${hasVoted === 1 ? 'text-indigo-600 bg-indigo-100' : 'text-gray-400 hover:text-indigo-500'}`}
                    title="Upvote"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
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

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900">{idea.title}</h3>
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
                    <span className="font-medium text-indigo-600 mr-2">{idea.category || 'General'}</span>
                    <span className="text-xs">
                        Shared by: {idea.userEmail ? idea.userEmail.split('@')[0] : 'Local User'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const IdeasPage = ({ user, handleSignOut }) => {
    const userDisplay = user.email ? user.email.split('@')[0] : 'Guest';
    
    const [ideas, setIdeas] = useState(loadIdeas);
    const [newIdea, setNewIdea] = useState({ title: '', description: '', category: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filter, setFilter] = useState('top');
    const [error, setError] = useState('');
    const [showSubmitForm, setShowSubmitForm] = useState(false);

    useEffect(() => {
        saveIdeas(ideas);
    }, [ideas]);

    useEffect(() => {
        setIdeas(prevIdeas => {
            return [...prevIdeas].sort((a, b) => {
                if (filter === 'top') {
                    return (b.votes || 0) - (a.votes || 0);
                }
                if (filter === 'new') {
                    return b.createdAt - a.createdAt;
                }
                return (b.votes || 0) - (a.votes || 0);
            });
        });
    }, [filter, setIdeas]);


    const handleSubmitIdea = (e) => {
        e.preventDefault();
        if (!newIdea.title || !newIdea.description) {
            setError("Please fill in the title and description.");
            return;
        }

        setIsSubmitting(true);
        setError('');
        
        const newIdeaObject = {
            id: Date.now().toString(),
            title: newIdea.title,
            description: newIdea.description,
            category: newIdea.category || 'General',
            userId: LOCAL_USER_ID,
            userEmail: user.email,
            votes: 0,
            voters: {},
            createdAt: Date.now(),
        };
        
        setIdeas(prevIdeas => {
            const updatedIdeas = [newIdeaObject, ...prevIdeas];
            return updatedIdeas.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        });

        setNewIdea({ title: '', description: '', category: '' });
        setShowSubmitForm(false);
        setIsSubmitting(false);
    };

    const handleVote = useCallback((ideaId, voteType) => {
        setIdeas(prevIdeas => {
            const updatedIdeas = prevIdeas.map(idea => {
                if (idea.id === ideaId) {
                    const currentVote = idea.voters ? idea.voters[LOCAL_USER_ID] : 0;
                    let newVoteCount = idea.votes || 0;
                    let newVoters = idea.voters ? { ...idea.voters } : {};

                    if (currentVote === voteType) {
                        newVoteCount -= voteType;
                        delete newVoters[LOCAL_USER_ID];
                    } else {
                        if (currentVote !== 0) {
                            newVoteCount -= currentVote;
                        }
                        newVoteCount += voteType;
                        newVoters[LOCAL_USER_ID] = voteType;
                    }

                    return { ...idea, votes: newVoteCount, voters: newVoters };
                }
                return idea;
            });
            
            return updatedIdeas.sort((a, b) => {
                if (filter === 'top') {
                    return (b.votes || 0) - (a.votes || 0);
                }
                if (filter === 'new') {
                    return b.createdAt - a.createdAt;
                }
                return (b.votes || 0) - (a.votes || 0);
            });
        });
    }, [filter, setIdeas]);

    const handleDelete = (ideaId) => {
        setIdeas(prevIdeas => prevIdeas.filter(idea => idea.id !== ideaId));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Zap className="h-6 w-6 text-indigo-600" />
                        {/* FINAL FIX: Removed (Local Data) from the header title */}
                        <h1 className="text-xl font-bold text-gray-900">IdeaVault</h1> 
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        <span className="text-gray-600 hidden sm:inline truncate max-w-xs font-medium">Welcome, {userDisplay}</span>
                        <button
                            onClick={() => setShowSubmitForm(true)}
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

            <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Startup Ideas</h2>
                {/* FINAL FIX: Removed (Fake Auth & Local Data) from the subtitle */}
                <p className="text-gray-500 mb-6">Discover and vote on the next big thing</p>
                
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">{error}</div>}

                {/* Filter Buttons */}
                <div className="flex space-x-3 mb-6">
                    {['Top', 'New'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f.toLowerCase())}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition duration-150 ${
                                filter === f.toLowerCase()
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {/* New Idea Submission Form (Modal) */}
                {showSubmitForm && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
                            <h3 className="text-2xl font-bold mb-4">Submit a New Idea</h3>
                            <form onSubmit={handleSubmitIdea} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Idea Title (e.g., AI Powered Resume Builder)"
                                    value={newIdea.title}
                                    onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                                <textarea
                                    placeholder="Idea Description (e.g., Uses LLMs to analyze job descriptions...)"
                                    value={newIdea.description}
                                    onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Category (e.g., SaaS, Web3, Education)"
                                    value={newIdea.category}
                                    onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <div className="flex justify-end space-x-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowSubmitForm(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center px-4 py-2 border border-transparent font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition duration-150 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader className="animate-spin h-5 w-5 mr-2" /> : 'Submit Idea'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Ideas List */}
                <div className="space-y-4">
                    {ideas.length > 0 ? (
                        ideas.map((idea) => (
                            <IdeaCard
                                key={idea.id}
                                idea={idea}
                                handleVote={handleVote}
                                handleDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            No ideas yet. Be the first to share!
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};


export default function App() {
    // Initial state: Check Local Storage for saved login status
    const [user, setUser] = useState(() => {
        const isLoggedIn = localStorage.getItem(AUTH_KEY) === 'true';
        const userEmail = localStorage.getItem(EMAIL_KEY);
        return isLoggedIn && userEmail ? { uid: LOCAL_USER_ID, email: userEmail } : null;
    });
    const [loading, setLoading] = useState(true);

    // Function to update user state after Sign In/Sign Up
    const setLocalUser = (userData) => {
        setUser(userData);
    };

    // Fake Sign Out function
    const handleSignOut = () => {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(EMAIL_KEY);
        setUser(null);
    };

    // Simulate app loading briefly
    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600 text-lg">
                <Loader className="animate-spin h-6 w-6 mr-3 text-indigo-500" />
                Loading Application...
            </div>
        );
    }

    // Conditional Routing based on Auth state
    if (user && user.email) {
        // Logged in user with Email (Local Storage)
        return <IdeasPage user={user} handleSignOut={handleSignOut} />;
    } else {
        // Logged out user: Show the fake AuthPage
        return <AuthPage setLocalUser={setLocalUser} />;
    }
}
