import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type SavedWorkItem = {
    id: string;
    type: string;
    title: string;
    timestamp: string;
    description: string;
    originalInput: string;
    resultText: string;
};

const RecentWorkCard = ({ type, title, timestamp, description }: Omit<SavedWorkItem, 'id' | 'originalInput' | 'resultText'>) => (
    <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl shadow-md">
        <div className="flex justify-between items-start mb-3">
            <div>
                <span className="text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full">{type}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</span>
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <button className="hover:text-indigo-500 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-eye"></i><span className="ml-1 text-xs">View</span></button>
            <button className="hover:text-indigo-500 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><i className="fas fa-copy"></i></button>
        </div>
    </div>
);

const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl shadow-md animate-pulse">
        <div className="flex justify-between items-start mb-3">
            <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="flex items-center space-x-2">
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
    </div>
);

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const DashboardPage: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [language, setLanguage] = useState('Spanish');
    const [recentWork, setRecentWork] = useState<SavedWorkItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const imageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            const savedWork = JSON.parse(localStorage.getItem('mindspark_saved_work') || '[]') as SavedWorkItem[];
            setRecentWork(savedWork.slice(0, 6)); // Get latest 6
            setIsLoading(false);
        }, 500); // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    const handleActionClick = (taskType: string) => {
        if (inputText.trim() === '') {
            alert('Please enter some text to process.');
            return;
        }
        navigate('/result', { state: { inputText, taskType, language } });
    };

    const handleImageAnalysis = () => {
        imageInputRef.current?.click();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const imagePart = await fileToGenerativePart(file);
        const inputText = "Extract the text from this image and summarize it concisely.";
        navigate('/result', { state: { inputText, taskType: 'analyze_image', imagePart } });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, Olivia!</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Ready to spark your mind with new insights?</p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg mb-12">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Start a new task</h2>
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your text here..."
                    className="w-full h-40 bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg border-2 border-transparent focus:border-indigo-500 focus:ring-0 resize-none transition-colors"
                ></textarea>
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <button onClick={() => handleActionClick('summarize')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"><i className="fas fa-file-alt"></i> Summarize</button>
                        <button onClick={() => handleActionClick('notes')} className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"><i className="fas fa-lightbulb"></i> Generate Notes</button>
                        <button onClick={() => handleActionClick('proofread')} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"><i className="fas fa-check-circle"></i> Proofread</button>
                        <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageUpload} className="hidden" />
                        <button onClick={handleImageAnalysis} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"><i className="fas fa-image"></i> Analyze Image</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-indigo-500">
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                            <option>Japanese</option>
                        </select>
                        <button onClick={() => handleActionClick('translate')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"><i className="fas fa-language"></i> Translate</button>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Recent Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading
                        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        : recentWork.map((item) => <RecentWorkCard key={item.id} {...item} />)}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
