// src/components/CarDetail.jsx
import React, { useState } from 'react';
const APIURL = import.meta.env.VITE_API_URL;


const CarDetail = ({ car, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrev = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? car.images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === car.images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-2xl relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-red-600 text-white text-xl font-bold px-4 py-2 rounded-full hover:bg-red-700 focus:outline-none"
                >
                    &times;
                </button>

                {/* Carousel */}
                {car.images && car.images.length > 0 && (
                    <div className="relative mt-4">
                        <img
                            src={`${car.images[currentImageIndex]}`}
                            alt={car.title}
                            className="w-full h-64 object-cover rounded-md"
                        />
                        {/* Navigation buttons */}
                        <button
                            onClick={handlePrev}
                            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-70 focus:outline-none"
                        >
                            {"<"}
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded hover:bg-opacity-70 focus:outline-none"
                        >
                            {">"}
                        </button>
                    </div>
                )}

                {/* Car Details */}
                <h2 className="text-2xl font-bold mt-4">{car.title}</h2>
                <p className="text-gray-600 mt-2">{car.description}</p>

                {/* Display Tags */}
                <div className="flex flex-wrap mt-4 gap-2">
                    {(Array.isArray(car.tags) ? car.tags : []).map((tag, index) => (
                        <span
                            key={index}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarDetail;
