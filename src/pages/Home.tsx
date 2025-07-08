// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Car, House, Briefcase, Smartphone, Shirt, Wrench, ChevronRight, MapPin, Clock, Eye } from 'lucide-react';

// Mock data for categories
const categories = [
    { id: 1, name: 'Transportlīdzekļi', slug: 'transport', icon: Car, count: 1234, color: 'bg-blue-500' },
    { id: 2, name: 'Nekustamais īpašums', slug: 'real-estate', icon: House, count: 567, color: 'bg-green-500' },
    { id: 3, name: 'Darbs', slug: 'jobs', icon: Briefcase, count: 890, color: 'bg-purple-500' },
    { id: 4, name: 'Elektronika', slug: 'electronics', icon: Smartphone, count: 456, color: 'bg-orange-500' },
    { id: 5, name: 'Apģērbs', slug: 'fashion', icon: Shirt, count: 234, color: 'bg-pink-500' },
    { id: 6, name: 'Mājas un dārzs', slug: 'home-garden', icon: Wrench, count: 678, color: 'bg-yellow-500' },
];

// Mock data for featured ads
const featuredAds = [
    {
        id: 1,
        title: 'Toyota Corolla 2020, laba stāvoklī',
        price: '€15,500',
        location: 'Rīga',
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&h=200&fit=crop',
        category: 'Transportlīdzekļi',
        isNegotiable: true,
        postedAt: '2 stundas atpakaļ',
        views: 156,
    },
    {
        id: 2,
        title: '3-ist. dzīvoklis Centrā, renovēts',
        price: '€750/mēn',
        location: 'Rīga, Centrs',
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=200&fit=crop',
        category: 'Nekustamais īpašums',
        isNegotiable: false,
        postedAt: '5 stundas atpakaļ',
        views: 89,
    },
    {
        id: 3,
        title: 'iPhone 14 Pro, 256GB, ideāls stāvoklis',
        price: '€899',
        location: 'Liepāja',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
        category: 'Elektronika',
        isNegotiable: true,
        postedAt: '1 diena atpakaļ',
        views: 234,
    },
    {
        id: 4,
        title: 'Web Developer pozīcija remote',
        price: '€2,500/mēn',
        location: 'Attālināti',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop',
        category: 'Darbs',
        isNegotiable: false,
        postedAt: '2 dienas atpakaļ',
        views: 78,
    },
];

const latestAds = [
    {
        id: 5,
        title: 'Velosipēds, ļoti labs stāvoklis',
        price: '€125',
        location: 'Daugavpils',
        category: 'Sports',
        postedAt: '30 min atpakaļ',
        views: 12,
    },
    {
        id: 6,
        title: 'Mēbeles - dīvāns un krēsli',
        price: '€200',
        location: 'Jūrmala',
        category: 'Mājas',
        postedAt: '1 stunda atpakaļ',
        views: 25,
    },
    {
        id: 7,
        title: 'Grāmatu kolekcija, dažādas tēmas',
        price: '€50',
        location: 'Ventspils',
        category: 'Grāmatas',
        postedAt: '2 stundas atpakaļ',
        views: 8,
    },
];

export const Home: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">
                            Sludinājumi visai Latvijai
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-100 mb-8">
                            Pārdod, pirkt, īrē - viss vienuviet
                        </p>
                        <Link
                            to="/create-ad"
                            className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Pievienot sludinājumu
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Categories Section */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Populārākās kategorijas</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <Link
                                    key={category.id}
                                    to={`/category/${category.slug}`}
                                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow group"
                                >
                                    <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <IconComponent className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
                                    <p className="text-xs text-gray-500">{category.count} sludinājumi</p>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Featured Ads Section */}
                <section className="mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Izceltie sludinājumi</h2>
                        <Link
                            to="/featured"
                            className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                        >
                            Skatīt visus
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredAds.map((ad) => (
                            <div key={ad.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative">
                                    <img
                                        src={ad.image}
                                        alt={ad.title}
                                        className="w-full h-48 object-cover rounded-t-lg"
                                    />
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-medium">
                                        Izcelt
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{ad.title}</h3>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-lg font-bold text-indigo-600">{ad.price}</span>
                                        {ad.isNegotiable && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Vienojas
                      </span>
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mb-1">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {ad.location}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <div className="flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {ad.postedAt}
                                        </div>
                                        <div className="flex items-center">
                                            <Eye className="h-3 w-3 mr-1" />
                                            {ad.views}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Latest Ads Section */}
                <section>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Jaunākie sludinājumi</h2>
                        <Link
                            to="/latest"
                            className="text-indigo-600 hover:text-indigo-500 font-medium flex items-center"
                        >
                            Skatīt visus
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="divide-y divide-gray-200">
                            {latestAds.map((ad) => (
                                <div key={ad.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">{ad.title}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span className="font-medium text-indigo-600">{ad.price}</span>
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {ad.location}
                                                </div>
                                                <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {ad.category}
                        </span>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm text-gray-400">
                                            <div className="flex items-center mb-1">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {ad.postedAt}
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="h-3 w-3 mr-1" />
                                                {ad.views}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};