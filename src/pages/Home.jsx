// src/pages/Home.jsx
import React, { useState } from 'react';
import { useAuth } from '../components/Auth';
import CarList from '../components/CarList';
import CarForm from '../components/CarForm';

const Home = () => {
    const { token, logout } = useAuth();
    const [view, setView] = useState('list');
    const [selectedCar, setSelectedCar] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const showForm = () => {
        console.log('Add New Car button clicked');
        setView('form');
        setSelectedCar(null);
    };

    const handleEdit = (car) => {
        setSelectedCar(car);
        setView('form');
    };

    const handleDelete = (carId) => {
        // Implement delete functionality here if needed
    };

    return (
        <div>
            <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
                <h1 className="text-lg font-bold">Car Manager</h1>
                <button onClick={logout} className="text-sm bg-red-500 py-1 px-2 rounded">
                    Logout
                </button>
            </header>
            <main className="p-4">
                {view === 'list' && (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={showForm} className="bg-blue-600 text-white px-4 py-2 rounded-md">
                                Add New Car
                            </button>
                            <input
                                type="text"
                                placeholder="Search cars..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 border rounded-md"
                            />
                        </div>
                        <CarList
                            searchTerm={searchTerm}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    </>
                )}
                {view === 'form' && (
                    <CarForm
                        token={token}
                        car={selectedCar}
                        onSubmit={() => setView('list')}
                        onClose={() => setView('list')}
                        isEditing={!!selectedCar}
                    />
                )}
            </main>
        </div>
    );
};

export default Home;
