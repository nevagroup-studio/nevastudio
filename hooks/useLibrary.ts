
import { useState, useEffect, useCallback } from 'react';
import type { LibraryItem } from '../types';
import { 
    addLibraryItemToDB, 
    getAllLibraryItemsFromDB, 
    deleteLibraryItemFromDB,
    deleteMultipleLibraryItemsFromDB,
    clearLibraryFromDB
} from '../services/db';

export const useLibrary = () => {
    const [library, setLibrary] = useState<LibraryItem[]>([]);
    const [justSavedId, setJustSavedId] = useState<string | null>(null);

    // Load library from IndexedDB on initial render
    useEffect(() => {
        const loadLibrary = async () => {
            try {
                const savedLibrary = await getAllLibraryItemsFromDB();
                setLibrary(savedLibrary);
            } catch (error) {
                console.error("Failed to load library from IndexedDB:", error);
            }
        };

        loadLibrary();
    }, []);

    const addImageToLibrary = useCallback(async (imageDataUrl: string, prompt?: string) => {
        // Prevent duplicates
        if (library.some(item => item.imageData === imageDataUrl)) {
            console.log("Image already in library.");
            return;
        }

        const newLibraryItem: LibraryItem = { 
            id: Date.now().toString(), 
            imageData: imageDataUrl,
            prompt: prompt 
        };
        
        try {
            await addLibraryItemToDB(newLibraryItem);
            setLibrary(prev => [newLibraryItem, ...prev]);
            setJustSavedId(newLibraryItem.id);
            setTimeout(() => setJustSavedId(null), 2000); // Reset after 2 seconds
        } catch (error) {
            console.error("Failed to save library item to IndexedDB:", error);
        }
    }, [library]);

    const removeImageFromLibrary = useCallback(async (id: string) => {
        try {
            await deleteLibraryItemFromDB(id);
            setLibrary(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Failed to delete library item from IndexedDB:", error);
        }
    }, []);

    const removeMultipleImagesFromLibrary = useCallback(async (ids: string[]) => {
        try {
            await deleteMultipleLibraryItemsFromDB(ids);
            setLibrary(prev => prev.filter(item => !ids.includes(item.id)));
        } catch (error) {
            console.error("Failed to delete multiple library items from IndexedDB:", error);
        }
    }, []);

    const clearLibrary = useCallback(async () => {
        try {
            await clearLibraryFromDB();
            setLibrary([]);
        } catch (error) {
            console.error("Failed to clear library from IndexedDB:", error);
        }
    }, []);
    
    return { library, addImageToLibrary, removeImageFromLibrary, removeMultipleImagesFromLibrary, clearLibrary, justSavedId };
};
