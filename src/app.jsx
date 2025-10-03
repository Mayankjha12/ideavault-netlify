import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { LogOut, Loader, Zap, Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

// =================================================================
// 0. FIREBASE SETUP (Global configuration, instances set in App component)
// =================================================================
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

// Placeholder variables to be set by the App component's useEffect
let authInstance = null;
let dbInstance = null;

// =================================================================
// 1. AUTHENTICATION PAGE (AuthPage Component)
// Handles Sign Up and Sign In logic using Firebase Auth.
// =================================================================

const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(true);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAuth = async () => {
        const auth = authInstance;
        if (!auth) {
            setError("Authentication service is not available (Check Firebase config).");
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            if (isSigningUp) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            console.error("Authentication Error:", err);
            // Provide user-friendly error messages
            if (err.code === 'auth/email-already-in-use') {
                setError('Email already in use. Try signing in.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak (min 6 characters).');
            } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Incorrect email or password.');
            } else {
                setError(`Authentication failed. Code: ${err.code}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl">
                <div className="flex flex-col items-center mb-6">
                    <Zap className="h-10 w-10 text-indigo-600 mb-2" />
                    <h1 className="text-3xl font-extrabold text-gray-900">IdeaVault</h1>
                    <p className="text-sm text-gray-500 mt-1">Share your startup ideas with the world</p>
                </div>

                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-200 ${isSigningUp ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { setIsSigningUp(true); setError(''); }}
                    >
                        Sign Up
                    </button>
                    <button
                        className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-200 ${!isSigningUp ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => { setIsSigningUp(false); setError(''); }}
                    >
                        Sign In
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm" role="alert">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <button
                    onClick={handleAuth}
                    disabled={isLoading || !email || !password}
                    className="mt-6 w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md transition duration-150 ease-in-out disabled:opacity-50"
                >
                    {isLoading ? <Loader className="animate-spin h-5 w-5 mr-3" /> : (
                        isSigningUp ? 'Sign Up' : 'Sign In'
                    )}
                </button>
            </div>
        </div>
    );
};

// =================================================================
// 2. IDEAS PAGE (IdeasPage Component)
// Handles Idea viewing, submission, voting, and deletion.
// =================================================================

const IdeaCard = ({ idea, userId, handleVote, handleDelete, userEmail }) => {
    // Check if the current logged-in user is the one who submitted the idea
    const isOwner = idea.userId === userId;
    const hasVoted = idea.voters && idea.voters[userId];
    const voteCount = idea.votes || 0;
    
    // Using simple window.confirm (Note: use custom modal in production)
    const confirmDelete = () => {
        if (window.confirm("Are you sure you want to delete this idea?")) {
            handleDelete(idea.id);
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200 flex space-x-4">
            <div className="flex flex-col items-center justify-center">
                <button
                    onClick={() => handleVote(idea.id, userId, 1)}
                    className={`p-1 rounded-full transition duration-150 ${hasVoted === 1 ? 'text-indigo-600 bg-indigo-100' : 'text-gray-400 hover:text-indigo-500'}`}
                    title="Upvote"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
                <span className={`font-bold text-xl mt-1 mb-1 ${voteCount > 0 ? 'text-green-600' : voteCount < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                    {voteCount}
                </span>
                <button
                    onClick={() => handleVote(idea.id, userId, -1)}
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
                        Shared by: {idea.userEmail ? idea.userEmail.split('@')[0] : 'Anonymous'}
                    </span>
                </div>
            </div>
        </div>
    );
};

const IdeasPage = ({ user, handleSignOut }) => {
    const userId = user.uid;
    // Display the part of the email before @ (e.g., 'mayankjha12')
    const userDisplay = user.email ? user.email.split('@')[0] : 'Guest'; 
    const userEmail = user.email || 'Anonymous';
    const [ideas, setIdeas] = useState([]);
    const [newIdea, setNewIdea] = useState({ title: '', description: '', category: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filter, setFilter] = useState('top'); 
    const [error, setError] = useState('');
    const [showSubmitForm, setShowSubmitForm] = useState(false);

    const db = dbInstance; // Get the initialized DB instance

    // 1. Fetch Ideas (Real-time listener)
    useEffect(() => {
        if (!db) return;

        // Public collection path: /artifacts/{appId}/public/data/ideas
        const ideasColRef = collection(db, 'artifacts', appId, 'public', 'data', 'ideas');
        
        // Query ordered by creation time (desc) for efficient Firestore querying
        const q = query(ideasColRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedIdeas = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Local sorting based on filter 
            const sortedIdeas = fetchedIdeas.sort((a, b) => {
                if (filter === 'top') {
                    // Sort by votes, highest first
                    return (b.votes || 0) - (a.votes || 0);
                }
                if (filter === 'new') {
                    // Sort by creation time (using safe toMillis)
                    return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
                }
                return (b.votes || 0) - (a.votes || 0);
            });

            setIdeas(sortedIdeas);
        }, (err) => {
            console.error("Firestore listen error:", err);
            setError("Failed to load ideas.");
        });

        return () => unsubscribe();
    }, [db, filter]);

    // 2. Submit New Idea
    const handleSubmitIdea = async (e) => {
        e.preventDefault();
        if (!db || !newIdea.title || !newIdea.description) {
            setError("Please fill in the title and description.");
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'ideas'), {
                title: newIdea.title,
                description: newIdea.description,
                category: newIdea.category || 'General',
                userId: userId,
                userEmail: userEmail,
                votes: 0,
                voters: {}, 
                createdAt: serverTimestamp(),
            });
            setNewIdea({ title: '', description: '', category: '' });
            setShowSubmitForm(false);
        } catch (e) {
            console.error("Error adding document: ", e);
            setError("Failed to submit idea.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 3. Vote Logic (Upvote/Downvote)
    const handleVote = useCallback(async (ideaId, currentUserId, voteType) => {
        if (!db) return;

        const ideaRef = doc(db, 'artifacts', appId, 'public', 'data', 'ideas', ideaId);

        try {
            const currentIdea = ideas.find(i => i.id === ideaId);
            if (!currentIdea) return;
            
            const currentVote = currentIdea.voters ? currentIdea.voters[currentUserId] : 0;
            let newVoteCount = currentIdea.votes || 0;
            let newVoters = currentIdea.voters || {};

            if (currentVote === voteType) {
                // Revoking vote (clicking the same button twice)
                newVoteCount -= voteType;
                delete newVoters[currentUserId];
            } else {
                // Changing or casting a new vote
                
                // 1. Remove previous vote effect (if any)
                if (currentVote !== 0) {
                    newVoteCount -= currentVote;
                }
                
                // 2. Apply new vote effect
                newVoteCount += voteType;
                newVoters[currentUserId] = voteType;
            }

            await updateDoc(ideaRef, {
                votes: newVoteCount,
                voters: newVoters,
            });
        } catch (e) {
            console.error("Error updating vote:", e);
            setError("Failed to update vote.");
        }
    }, [db, ideas]);

    // 4. Delete Idea (Owner only)
    const handleDelete = async (ideaId) => {
        if (!db) return;
        
        try {
            await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'ideas', ideaId));
        } catch (e) {
            console.error("Error deleting document: ", e);
            setError("Failed to delete idea.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Zap className="h-6 w-6 text-indigo-600" />
                        <h1 className="text-xl font-bold text-gray-900">IdeaVault</h1>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                        {/* Display real username derived from email */}
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
                                userId={userId}
                                userEmail={userEmail}
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


// =================================================================
// 3. MAIN APPLICATION ROOT (App Component)
// Handles routing and Firebase initialization safely
// =================================================================

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthReady, setAuthReady] = useState(false);

    // 1. Firebase Initialization and Auth Listener (Executed Safely)
    useEffect(() => {
        // Only initialize if config is present
        if (Object.keys(firebaseConfig).length === 0) {
            setLoading(false);
            setAuthReady(true);
            return;
        }

        try {
            const app = initializeApp(firebaseConfig);
            const auth = getAuth(app);
            const db = getFirestore(app);

            // Set global instances so child components can access them
            authInstance = auth;
            dbInstance = db;
            
            // Set logging level for debugging Firebase operations
            // setLogLevel('Debug');

            const initializeAuth = async () => {
                // Sign in with custom token if available, otherwise anonymously
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token).catch(e => console.error("Custom Auth Error:", e));
                } else {
                    await signInAnonymously(auth).catch(e => console.error("Anonymous Auth Error:", e));
                }
                setAuthReady(true);
            };
            
            initializeAuth();

            // Listener for auth state changes (This handles Sign In/Sign Out)
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser);
                setLoading(false);
            });

            return () => unsubscribe();
        } catch (e) {
            console.error("Initialization failed:", e);
            setLoading(false);
            setAuthReady(true);
        }
    }, []);


    const handleSignOut = async () => {
        if (!authInstance) return;
        try {
            await signOut(authInstance);
        } catch (e) {
            console.error("Sign Out Error:", e);
        }
    };

    if (loading || !isAuthReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600 text-lg">
                <Loader className="animate-spin h-6 w-6 mr-3 text-indigo-500" />
                Loading App...
            </div>
        );
    }

    // Conditional Rendering: Autohandles routing (Fixes the "Switch" button issue)
    if (user && user.email) {
        // Logged In: Show Ideas Page (only if email is available, ensuring real user)
        return <IdeasPage user={user} handleSignOut={handleSignOut} />;
    } else {
        // Logged Out or Anonymous: Show Auth Page
        return <AuthPage />;
    }
}
