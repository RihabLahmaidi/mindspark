import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type, Part } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const loadingMessages = [
    "Analyzing your text...",
    "Consulting with the AI core...",
    "Generating insights...",
    "Crafting the perfect response...",
    "Finalizing the output..."
];

type Flashcard = {
    question: string;
    answer: string;
};

const FlashcardItem: React.FC<{ card: Flashcard }> = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="perspective-1000 w-full h-48" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-700 rounded-xl shadow-md flex items-center justify-center p-4 text-center">
                    <p className="text-gray-800 dark:text-gray-200 font-semibold">{card.question}</p>
                </div>
                <div className="absolute w-full h-full backface-hidden bg-indigo-100 dark:bg-indigo-900/80 rounded-xl shadow-md flex items-center justify-center p-4 text-center rotate-y-180">
                    <p className="text-indigo-800 dark:text-indigo-200">{card.answer}</p>
                </div>
            </div>
        </div>
    );
};

const TaskResultPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { inputText, taskType, language, imagePart } = location.state || {};
    
    const [isLoading, setIsLoading] = useState(true);
    const [resultText, setResultText] = useState('');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [toastMessage, setToastMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'result' | 'flashcards'>('result');
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [isFlashcardLoading, setIsFlashcardLoading] = useState(false);

    useEffect(() => {
        if (!inputText || !taskType) {
            navigate('/dashboard');
            return;
        }

        const getPrompt = () => {
            switch (taskType) {
                case 'summarize': return `Summarize the following text:\n\n"${inputText}"`;
                case 'notes': return `Generate detailed notes from the following text:\n\n"${inputText}"`;
                case 'proofread': return `Proofread the following text and provide only the corrected version:\n\n"${inputText}"`;
                case 'translate': return `Translate the following text to ${language}:\n\n"${inputText}"`;
                case 'analyze_image': return inputText; // The prompt is already in inputText
                default: return inputText;
            }
        };

        const callAi = async () => {
            try {
                const prompt = getPrompt();

                // Fix: The `contents` parameter must be a string for text-only prompts or an object
                // with a `parts` array for multipart requests.
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: (taskType === 'analyze_image' && imagePart)
                        ? { parts: [imagePart, { text: prompt }] }
                        : prompt
                });
                setResultText(response.text);
            } catch (e) {
                console.error(e);
                setError('An error occurred while communicating with the AI. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };
        
        callAi();
    }, [inputText, taskType, language, imagePart, navigate]);
    
    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 95) { clearInterval(interval); return 95; }
                    return prev + 5;
                });
                setLoadingMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
            }, 400);
            return () => clearInterval(interval);
        }
    }, [isLoading]);

    const generateFlashcards = async () => {
        if (flashcards.length > 0) return; // Don't re-generate
        setIsFlashcardLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Based on the following text, generate 5-10 flashcards. Text: "${inputText}"`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            flashcards: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        question: { type: Type.STRING },
                                        answer: { type: Type.STRING }
                                    },
                                    required: ['question', 'answer']
                                }
                            }
                        },
                        required: ['flashcards']
                    }
                }
            });
            const parsed = JSON.parse(response.text);
            setFlashcards(parsed.flashcards);
        } catch (e) {
            console.error("Flashcard generation failed:", e);
            showToast("Could not generate flashcards.");
        } finally {
            setIsFlashcardLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'flashcards' && !isLoading) {
            generateFlashcards();
        }
    }, [activeTab, isLoading]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(''), 3000);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(resultText);
        showToast('Copied to clipboard!');
    };

    const handleSave = () => {
        const title = (inputText.split(' ').slice(0, 5).join(' ') + '...') || 'New Work';
        const newItem = {
            id: new Date().toISOString(),
            type: taskType.charAt(0).toUpperCase() + taskType.slice(1).replace('_', ' '),
            title,
            timestamp: new Date().toISOString(),
            description: resultText.slice(0, 150) + '...',
            originalInput: inputText,
            resultText,
        };
        const savedWork = JSON.parse(localStorage.getItem('mindspark_saved_work') || '[]');
        savedWork.push(newItem);
        localStorage.setItem('mindspark_saved_work', JSON.stringify(savedWork));
        showToast('Work saved successfully!');
    };

    const handleExport = () => {
        const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${taskType}_result.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
        showToast('Exported as .txt file!');
    };
    
    const pageTitle = `${taskType.charAt(0).toUpperCase() + taskType.slice(1).replace('_', ' ')} Result`;

    return (
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{pageTitle}</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Original Input */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Original Input</h2>
                    {imagePart && <img src={`data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`} alt="User input" className="rounded-lg mb-4 max-h-60 w-auto" />}
                    <div className="text-gray-600 dark:text-gray-400 leading-relaxed max-h-96 overflow-y-auto pr-2">{inputText}</div>
                </div>

                {/* AI Result */}
                <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center h-full min-h-[20rem]">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">AI is Processing</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">{loadingMessage}</p>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="main-gradient-bg-light h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.4s ease-in-out' }}></div></div>
                        </div>
                    ) : error ? (
                         <div className="flex flex-col justify-center items-center h-full min-h-[20rem] text-center"><i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i><h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">Error</h2><p className="text-gray-600 dark:text-gray-400">{error}</p></div>
                    ) : (
                        <div>
                            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                    <button onClick={() => setActiveTab('result')} className={`${activeTab === 'result' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>AI Result</button>
                                    <button onClick={() => setActiveTab('flashcards')} className={`${activeTab === 'flashcards' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>Flashcards</button>
                                </nav>
                            </div>
                            
                            {activeTab === 'result' && (
                                <>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Generated Output</h2>
                                        <div className="flex space-x-2 text-gray-500 dark:text-gray-400">
                                            <button onClick={handleCopy} title="Copy" className="p-2 w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-500"><i className="fas fa-copy"></i></button>
                                            <button onClick={handleSave} title="Save" className="p-2 w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-500"><i className="fas fa-save"></i></button>
                                            <button onClick={handleExport} title="Export" className="p-2 w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-500"><i className="fas fa-download"></i></button>
                                        </div>
                                    </div>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto pr-2">{resultText}</div>
                                </>
                            )}

                            {activeTab === 'flashcards' && (
                                isFlashcardLoading ? <div className="text-center py-10">Loading flashcards...</div> :
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[28rem] overflow-y-auto pr-2">
                                    {flashcards.map((card, index) => <FlashcardItem key={index} card={card} />)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {toastMessage && (<div className="fixed bottom-5 right-5 main-gradient-bg text-white px-4 py-2 rounded-lg shadow-lg toast-enter">{toastMessage}</div>)}
             <style>{`
                .transform-style-preserve-3d { transform-style: preserve-3d; }
                .perspective-1000 { perspective: 1000px; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
            `}</style>
        </div>
    );
};

export default TaskResultPage;