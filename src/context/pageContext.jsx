import { createContext, useContext, useState } from 'react';

// Membuat Context untuk Page Navigation
const PageContext = createContext();

// Provider Component
export function PageProvider({ children }) {
    const [currentPage, setCurrentPage] = useState('btnHome');

    // Fungsi untuk navigasi ke halaman tertentu
    const navigateTo = (pageId) => {
        setCurrentPage(pageId);
    };

    const value = {
        currentPage,
        navigateTo
    };

    return (
        <PageContext.Provider value={value}>
            {children}
        </PageContext.Provider>
    );
}

// Hook untuk menggunakan PageContext
export function usePage() {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('usePage harus digunakan dalam PageProvider');
    }
    return context;
}