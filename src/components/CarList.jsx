// src/components/CarList.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from './Auth';
import CarDetail from './CarDetail';
const APIURL = import.meta.env.VITE_API_URL;


const CarList = ({ searchTerm, onEdit, onDelete }) => {
    const { token } = useAuth();
    const [cars, setCars] = useState([]);
    const [error, setError] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch(`${APIURL}/api/cars?search=${encodeURIComponent(searchTerm)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch cars');
                }

                const data = await response.json();
                setCars(data);
            } catch (error) {
                console.error('Error fetching cars:', error);
                setError(error.message);
            }
        };

        fetchCars();
    }, [token, searchTerm]);

    const handleDelete = async (carId) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return;

        try {
            const response = await fetch(`${APIURL}/api/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete car');
            }

            // Remove the deleted car from the state
            setCars(cars.filter((car) => car._id !== carId));
        } catch (error) {
            console.error('Error deleting car:', error);
            setError(error.message);
        }
    };

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
                <div key={car._id} className="border rounded-md p-4">
                    {car.images && car.images.length > 0 && (
                        <img
                            src={`${car.images[0]}`}
                            alt={car.title}
                            className="w-full h-48 object-cover rounded-md mb-2"
                        />
                    )}
                    <h2 className="text-xl font-bold">{car.title}</h2>
                    <p className="text-gray-600">{car.description}</p>

                    <div className="flex flex-wrap mt-2 gap-1">
                        {car.tags && car.tags.length > 0 ? (
                            car.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-500 text-sm">No tags available</span>
                        )}
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={() => setSelectedCar(car)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        >
                            View
                        </button>
                        <button
                            onClick={() => onEdit(car)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(car._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}

            {/* Conditionally render CarDetail */}
            {selectedCar && <CarDetail car={selectedCar} onClose={() => setSelectedCar(null)} />}
        </div>
    );
};

export default CarList;
