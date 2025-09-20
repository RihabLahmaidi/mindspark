import React, { useState, useEffect, useMemo } from 'react';

type SavedWorkItem = {
    id: string;
    type: string;
    title: string;
    timestamp: string;
    description: string;
    originalInput: string;
    resultText: string;
};

const SavedWorkCard = ({ item, onDelete }: { item: SavedWorkItem, onDelete: (id: string) => void }) => {
    const { id, title, timestamp, type, description } = item;
    const typeColor = type.toLowerCase().includes('summary') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      type.toLowerCase().includes('notes') ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return (
        <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl shadow-md flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${typeColor}`}>{type}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{new Date(timestamp).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{description}</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                <button className="flex-1 text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-500"><i className="fas fa-eye"></i></button>
                <button className="flex-1 text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-500"><i className="fas fa-edit"></i></button>
                <button className="flex-1 text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-500"><i className="fas fa-copy"></i></button>
                <button onClick={() => onDelete(id)} className="flex-1 text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-red-500"><i className="fas fa-trash"></i></button>
            </div>
        </div>
    );
}

const SavedWorkPage: React.FC = () => {
    const [savedWork, setSavedWork] = useState<SavedWorkItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All Types');

    useEffect(() => {
        const workFromStorage = JSON.parse(localStorage.getItem('mindspark_saved_work') || '[]') as SavedWorkItem[];
        setSavedWork(workFromStorage.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    const handleDelete = (id: string) => {
        const updatedWork = savedWork.filter(item => item.id !== id);
        setSavedWork(updatedWork);
        localStorage.setItem('mindspark_saved_work', JSON.stringify(updatedWork));
    };

    const filteredWork = useMemo(() => {
        return savedWork.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = typeFilter === 'All Types' || item.type === typeFilter;
            return matchesSearch && matchesType;
        });
    }, [savedWork, searchTerm, typeFilter]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Saved Work Library</h1>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-white dark:bg-gray-800/50 rounded-xl shadow-sm">
                <div className="relative flex-grow">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input 
                        type="text" 
                        placeholder="Search titles, content..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500" />
                </div>
                <select 
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500">
                    <option>All Types</option>
                    <option>Summary</option>
                    <option>Notes</option>
                    <option>Translation</option>
                    <option>Proofread</option>
                    <option>Image Analysis</option>
                </select>
            </div>

            {/* Grid */}
            {filteredWork.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredWork.map((item) => <SavedWorkCard key={item.id} item={item} onDelete={handleDelete} />)}
                </div>
            ) : (
                <div className="text-center py-16">
                    <i className="fas fa-folder-open text-5xl text-gray-400 mb-4"></i>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Saved Work Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Your saved items will appear here once you save them.</p>
                </div>
            )}
        </div>
    );
};

export default SavedWorkPage;