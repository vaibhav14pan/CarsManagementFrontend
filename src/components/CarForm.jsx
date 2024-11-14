// src/components/CarForm.jsx
import React, { useState, useEffect } from 'react';
const APIURL = import.meta.env.VITE_API_URL;


const CarForm = ({ token, car = {}, onSubmit, onClose, isEditing = false }) => {
    const [title, setTitle] = useState(car?.title || '');
    const [description, setDescription] = useState(car?.description || '');
    const [images, setImages] = useState([]);
    const [tags, setTags] = useState(Array.isArray(car?.tags) ? car.tags : []); // Ensure tags is an array
    const [currentTag, setCurrentTag] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize fields if car is being edited
        if (isEditing && car) {
            setTitle(car.title || '');
            setDescription(car.description || '');
            setTags(Array.isArray(car.tags) ? car.tags : []);
        }
    }, [car, isEditing]);

    const handleFileChange = (e) => {
        setImages(e.target.files);
    };

    const handleAddTag = () => {
        if (currentTag.trim() !== '' && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('tags', JSON.stringify(tags));

            Array.from(images).forEach((image) => {
                formData.append('images', image);
            });

            const url = isEditing
                ? `${APIURL}/api/cars/${car._id}`
                : `${APIURL}/api/cars`;
            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to save car');

            onSubmit();
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-4">
                {isEditing ? 'Edit Car' : 'Add New Car'}
            </h1>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        className="flex-grow px-3 py-2 border rounded-md"
                        placeholder="Enter a tag"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                        Add Tag
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-gray-200 px-2 py-1 rounded-full"
                        >
                            <span className="mr-2">{tag}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-red-500"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded-md"
                />
                <small className="text-gray-500">You can upload up to 10 images.</small>
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                {isEditing ? 'Update Car' : 'Add Car'}
            </button>

            <button
                type="button"
                onClick={onClose}
                className="w-full mt-2 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
                Cancel
            </button>
        </form>
    );
};

export default CarForm;
