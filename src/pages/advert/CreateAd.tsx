import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    Upload,
    X,
    MapPin,
    DollarSign,
    FileText,
    Tag,
    Phone,
    Mail,
    Calendar,
    Image as ImageIcon,
} from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    parent_id?: number;
}

const mockCategories: Category[] = [
    { id: 1, name: 'Transportlīdzekļi', slug: 'transport' },
    { id: 2, name: 'Automašīnas', slug: 'cars', parent_id: 1 },
    { id: 3, name: 'Motocikli', slug: 'motorcycles', parent_id: 1 },
    { id: 4, name: 'Nekustamais īpašums', slug: 'real-estate' },
    { id: 5, name: 'Dzīvokļi', slug: 'apartments', parent_id: 4 },
    { id: 6, name: 'Mājas', slug: 'houses', parent_id: 4 },
    { id: 7, name: 'Elektronika', slug: 'electronics' },
    { id: 8, name: 'Telefoni', slug: 'phones', parent_id: 7 },
    { id: 9, name: 'Datori', slug: 'computers', parent_id: 7 },
];

export const CreateAd: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        currency: 'EUR',
        category_id: '',
        location: '',
        contact_phone: user?.phone || '',
        contact_email: user?.email || '',
        is_negotiable: false,
        expires_at: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: [] }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxFiles = 10;

        if (selectedImages.length + files.length > maxFiles) {
            setErrors(prev => ({ ...prev, images: [`Maksimums ${maxFiles} attēli`] }));
            return;
        }

        setSelectedImages(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreviews(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Client-side validation
        const newErrors: Record<string, string[]> = {};

        if (!formData.title.trim()) {
            newErrors.title = ['Nosaukums ir obligāts'];
        }

        if (!formData.description.trim()) {
            newErrors.description = ['Apraksts ir obligāts'];
        }

        if (!formData.category_id) {
            newErrors.category_id = ['Kategorija ir obligāta'];
        }

        if (!formData.location.trim()) {
            newErrors.location = ['Atrašanās vieta ir obligāta'];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Here you would make API call to create advertisement
            console.log('Creating advertisement:', formData);
            console.log('Selected images:', selectedImages);

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            navigate('/my-ads');
        } catch (err: any) {
            const responseErrors = err.response?.data?.errors || {};
            setErrors(responseErrors);
        } finally {
            setLoading(false);
        }
    };

    const getFieldError = (fieldName: string) => {
        return errors[fieldName]?.[0];
    };

    const mainCategories = mockCategories.filter(cat => !cat.parent_id);
    const getSubCategories = (parentId: number) =>
        mockCategories.filter(cat => cat.parent_id === parentId);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow-sm rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Pievienot sludinājumu</h1>
                    <p className="mt-1 text-sm text-gray-600">
                        Aizpildiet formu, lai izveidotu jaunu sludinājumu
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Nosaukums *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FileText className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={`pl-10 block w-full px-3 py-2 border ${
                                    getFieldError('title') ? 'border-red-300' : 'border-gray-300'
                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                placeholder="Ievadiet sludinājuma nosaukumu"
                                maxLength={100}
                            />
                        </div>
                        {getFieldError('title') && (
                            <p className="mt-1 text-sm text-red-600">{getFieldError('title')}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                                Kategorija *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    className={`pl-10 block w-full px-3 py-2 border ${
                                        getFieldError('category_id') ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                >
                                    <option value="">Izvēlieties kategoriju</option>
                                    {mainCategories.map(category => (
                                        <optgroup key={category.id} label={category.name}>
                                            <option value={category.id}>{category.name}</option>
                                            {getSubCategories(category.id).map(subCategory => (
                                                <option key={subCategory.id} value={subCategory.id}>
                                                    — {subCategory.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                            {getFieldError('category_id') && (
                                <p className="mt-1 text-sm text-red-600">{getFieldError('category_id')}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Atrašanās vieta *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className={`pl-10 block w-full px-3 py-2 border ${
                                        getFieldError('location') ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    placeholder="Pilsēta, rajons"
                                />
                            </div>
                            {getFieldError('location') && (
                                <p className="mt-1 text-sm text-red-600">{getFieldError('location')}</p>
                            )}
                        </div>
                    </div>

                    {/* Price */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                Cena
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
                                Valūta
                            </label>
                            <select
                                id="currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleInputChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="EUR">EUR (€)</option>
                                <option value="USD">USD ($)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>
                    </div>

                    {/* Negotiable checkbox */}
                    <div className="flex items-center">
                        <input
                            id="is_negotiable"
                            name="is_negotiable"
                            type="checkbox"
                            checked={formData.is_negotiable}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_negotiable" className="ml-2 block text-sm text-gray-900">
                            Cena ir par vienošanos
                        </label>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Apraksts *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={6}
                            className={`block w-full px-3 py-2 border ${
                                getFieldError('description') ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                            placeholder="Detalizēts sludinājuma apraksts..."
                            maxLength={2000}
                        />
                        <div className="mt-1 flex justify-between">
                            {getFieldError('description') && (
                                <p className="text-sm text-red-600">{getFieldError('description')}</p>
                            )}
                            <p className="text-sm text-gray-500">{formData.description.length}/2000</p>
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attēli (maksimums 10)
                        </label>

                        <div className="mt-2">
                            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Augšupielādēt attēlus</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleImageUpload}
                                            />
                                        </label>
                                        <p className="pl-1">vai ievelciet šeit</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF līdz 5MB katrs</p>
                                </div>
                            </div>
                        </div>

                        {/* Image previews */}
                        {imagePreviews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="h-24 w-full object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {getFieldError('images') && (
                            <p className="mt-1 text-sm text-red-600">{getFieldError('images')}</p>
                        )}
                    </div>

                    {/* Contact Information */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Kontaktinformācija</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                                    Telefona numurs
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="contact_phone"
                                        name="contact_phone"
                                        value={formData.contact_phone}
                                        onChange={handleInputChange}
                                        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="+371 12345678"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                                    E-pasta adrese
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="contact_email"
                                        name="contact_email"
                                        value={formData.contact_email}
                                        onChange={handleInputChange}
                                        className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="jūsu@epasts.lv"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expiration Date */}
                    <div>
                        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700 mb-2">
                            Sludinājuma derīguma termiņš
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                id="expires_at"
                                name="expires_at"
                                value={formData.expires_at}
                                onChange={handleInputChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                            Ja neesat norādījuši, sludinājums būs aktīvs 30 dienas
                        </p>
                    </div>

                    {/* Submit buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Atcelt
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Publicējam...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Publicēt sludinājumu
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};