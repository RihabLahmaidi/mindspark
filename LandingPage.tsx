import React from 'react';
import { Link } from 'react-router-dom';

// Fix: Define props type separately to fix TypeScript error.
type FeatureCardProps = { icon: string; title: string; children: React.ReactNode };
const FeatureCard = ({ icon, title, children }: FeatureCardProps) => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-center h-12 w-12 rounded-full main-gradient-bg-light text-white mb-4">
      <i className={`fas ${icon} text-xl`}></i>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm">{children}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role, avatar }: { quote: string; author: string; role: string; avatar: string }) => (
  <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-lg text-center">
    <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{quote}"</p>
    <div className="flex items-center justify-center">
      <img src={avatar} alt={author} className="w-10 h-10 rounded-full mr-4" />
      <div>
        <p className="font-semibold text-gray-800 dark:text-white">{author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
      </div>
    </div>
  </div>
);


const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 md:space-y-32 pb-24 fade-in">
      {/* Hero Section */}
      <section className="pt-20 pb-10">
        <div className="container mx-auto px-4 text-center">
           <span className="inline-block bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-semibold px-4 py-1 rounded-full mb-4">
             Struggling with Information Overload?
           </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
            Stop Cramming. <br/> <span className="main-gradient-text">Start Understanding.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 mb-8">
            MindSpark is your personal AI study partner. We turn your dense textbooks, lecture notes, and research papers into clear summaries, organized notes, and interactive flashcards.
          </p>
          <div className="flex items-center justify-center gap-4">
             <Link to="/login" className="px-6 py-3 font-semibold text-white main-gradient-bg-light rounded-lg hover:opacity-90 transition-opacity shadow-md">
                Get Started Free
            </Link>
            <Link to="/login" className="px-6 py-3 font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Unlock Your Potential with AI</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard icon="fa-file-alt" title="Summarize Instantly">Condense long articles and documents into concise summaries, saving you valuable time.</FeatureCard>
          <FeatureCard icon="fa-lightbulb" title="Generate Smart Notes">Convert complex information into structured notes, outlines, and key takeaways.</FeatureCard>
          <FeatureCard icon="fa-layer-group" title="Create Flashcards">Automatically generate interactive flashcards from your text for active recall and revision.</FeatureCard>
        </div>
      </section>

      {/* Why Mindspark? Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Why MindSpark?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
            <div>
                <div className="text-5xl font-extrabold main-gradient-text mb-2">40%</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Faster Study Times</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Cut down on reading and note-taking time. Focus on what truly matters.</p>
            </div>
             <div>
                <div className="text-5xl font-extrabold main-gradient-text mb-2">95%</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Improved Comprehension</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Grasp complex topics easier with simplified summaries and structured notes.</p>
            </div>
             <div>
                <div className="text-5xl font-extrabold main-gradient-text mb-2">25%</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Higher Grades Achieved</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Improve your academic performance by focusing on understanding, not just memorizing.</p>
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Loved by Students Worldwide</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <TestimonialCard
                quote="MindSpark completely changed how I study. The summarizer saves me hours of reading, and the flashcards are a lifesaver for exams!"
                author="Sarah J."
                role="University Student"
                avatar="https://picsum.photos/seed/person1/100/100"
            />
            <TestimonialCard
                quote="As a researcher, I deal with dense academic papers daily. This tool helps me quickly get the gist of a paper, which is incredibly valuable."
                author="Dr. Ben Carter"
                role="Ph.D. Researcher"
                avatar="https://picsum.photos/seed/person2/100/100"
            />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center main-gradient-bg-light p-10 rounded-2xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Studies?</h2>
          <p className="text-indigo-100 mb-8">Join thousands of students and professionals who study smarter with MindSpark.</p>
          <Link to="/login" className="px-8 py-3 font-semibold bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors shadow-md">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
};

// Fix: Add default export for the LandingPage component, which was missing and caused an import error.
// The component's content was also incomplete due to file corruption and has been restored.
export default LandingPage;
