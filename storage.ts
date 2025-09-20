export type SavedWorkItem = {
    id: string;
    type: string;
    title: string;
    timestamp: string;
    description: string;
    originalInput: string;
    resultText: string;
    flashcards?: { question: string; answer: string; }[];
    imagePart?: { inlineData: { data: string; mimeType: string; } };
};

const STORAGE_KEY = 'mindspark_saved_work';

export const getSavedWork = (): SavedWorkItem[] => {
    try {
        const savedWork = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as SavedWorkItem[];
        return savedWork.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
        console.error("Failed to parse saved work from localStorage", error);
        return [];
    }
};

export const saveWorkItem = (item: Omit<SavedWorkItem, 'id' | 'timestamp'>): SavedWorkItem => {
    const allWork = getSavedWork();
    const newItem: SavedWorkItem = {
        ...item,
        id: new Date().toISOString() + Math.random(),
        timestamp: new Date().toISOString(),
    };
    const updatedWork = [newItem, ...allWork];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWork));
    return newItem;
};


export const deleteWorkItem = (id: string): SavedWorkItem[] => {
    let allWork = getSavedWork();
    const updatedWork = allWork.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWork));
    return updatedWork;
};

export const clearAllWork = (): void => {
    localStorage.removeItem(STORAGE_KEY);
};
