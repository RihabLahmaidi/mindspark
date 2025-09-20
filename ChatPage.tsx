import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
    role: 'user' | 'model';
    text: string;
}

const ChatPage: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize the chat session
        const initChat = () => {
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are a friendly and encouraging study advisor named Sparky. Provide helpful tips, motivation, and advice to students. Keep your responses concise and easy to read.',
                },
            });
            setChat(chatSession);
            setMessages([{ role: 'model', text: 'Hello! I\'m Sparky, your AI study advisor. How can I help you prepare for success today?' }]);
        };
        initChat();
    }, []);

    useEffect(() => {
        // Auto-scroll to the bottom of the chat
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || !chat || isLoading) return;

        const userMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError('');

        try {
            const stream = await chat.sendMessageStream({ message: userInput });
            
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].text = modelResponse;
                    return newMessages;
                });
            }

        } catch (err) {
            console.error(err);
            setError('Sorry, something went wrong. Please try again.');
            setMessages(prev => prev.slice(0, -1)); // Remove empty model message on error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 flex flex-col h-[calc(100vh-8rem)] fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Study Advisor</h1>
                <p className="text-gray-600 dark:text-gray-400">Chat with Sparky for tips and motivation!</p>
            </div>
            
            <div className="flex-grow bg-white dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg overflow-y-auto" ref={chatContainerRef}>
                <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} slide-in-bottom`}>
                           {msg.role === 'model' && <div className="w-8 h-8 rounded-full main-gradient-bg-light flex items-center justify-center text-white flex-shrink-0"><i className="fas fa-brain"></i></div>}
                            <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-3 justify-start slide-in-bottom">
                            <div className="w-8 h-8 rounded-full main-gradient-bg-light flex items-center justify-center text-white flex-shrink-0"><i className="fas fa-brain"></i></div>
                            <div className="max-w-md p-3 rounded-2xl bg-gray-200 dark:bg-gray-700">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        </div>
                    )}
                     {error && <p className="text-center text-red-500">{error}</p>}
                </div>
            </div>

            <form onSubmit={handleSendMessage} className="mt-6">
                <div className="relative">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask for study advice..."
                        className="w-full bg-white dark:bg-gray-800/50 p-4 pr-16 rounded-xl shadow-md border-2 border-transparent focus:border-indigo-500 focus:ring-0 transition-colors"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 main-gradient-bg-light text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatPage;