
import React, { useState } from 'react';

const faqData = [
    {
        question: "How to use the Summarizer feature?",
        answer: "Simply paste or type your text into the input field on the Dashboard, select 'Summarize' as your desired action, and MindSpark's AI will generate a concise summary for you. You can choose different summary lengths."
    },
    {
        question: "Can I export my generated notes?",
        answer: "Yes, you can export your notes in various formats, including PDF, DOCX, and plain text. Look for the 'Download' icon on the Task Result Page or in your Saved Work Library."
    },
    {
        question: "What languages does the Translator support?",
        answer: "Our translator supports over 50 languages, including Spanish, French, German, Chinese, Japanese, and more. We are continuously adding support for new languages."
    },
    {
        question: "Is there a limit to how much text I can process?",
        answer: "The text limit depends on your subscription plan. The free plan has a limit of 1,000 words per request, while premium plans offer much higher limits and even unlimited processing."
    },
    {
        question: "How can I manage my saved work?",
        answer: "All your processed tasks are automatically saved to your 'Saved Work Library'. You can access it from the main navigation to view, edit, delete, or share your work."
    },
    {
        question: "What is MindSpark's privacy policy?",
        answer: "We take your privacy seriously. We do not store your data permanently unless you explicitly save it. All processing is done securely, and your information is never shared with third parties. You can read our full privacy policy for more details."
    }
];

// Fix: Define props type separately to fix TypeScript error about 'key' prop.
type FaqItemProps = {
    question: string;
    answer: string;
};
const FaqItem = ({ question, answer }: FaqItemProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 py-4">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left text-lg font-medium text-gray-800 dark:text-gray-200">
                <span>{question}</span>
                <i className={`fas fa-chevron-down transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 mt-2' : 'max-h-0'}`}>
                <p className="text-gray-600 dark:text-gray-400 pt-2">{answer}</p>
            </div>
        </div>
    );
};

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 fade-in">
        <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About MindSpark & Help Center</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
                MindSpark is your intelligent study companion, leveraging cutting-edge AI to transform how you learn. From summarizing complex articles to generating flashcards and translating content, we empower you to study smarter, not harder. Our mission is to make academic success accessible and efficient for everyone.
            </p>
        </div>

        <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
            <div>
                {faqData.map((faq, index) => (
                    <FaqItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </div>
        </div>

        <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">Get in Touch</h2>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Have a question or need assistance? Fill out the form below and we'll get back to you.</p>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                        <input type="text" id="name" placeholder="John Doe" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                        <input type="email" id="email" placeholder="you@example.com" className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                        <input type="text" id="subject" placeholder="Regarding Summarizer feature..." className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Message</label>
                        <textarea id="message" rows={4} placeholder="Tell us how we can help you..." className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"></textarea>
                    </div>
                    <button type="submit" className="w-full main-gradient-bg-light text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default AboutPage;