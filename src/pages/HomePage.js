import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const HomePage = () => {
    const [categories, setCategories] = useState([]);
    const [recentAds, setRecentAds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const categoriesData = [
                { id: 1, name: 'Transportlīdzekļi', slug: 'transport', icon: '🚗', count: 1234 },
                { id: 2, name: 'Nekustamais īpašums', slug: 'real-estate', icon: '🏠', count: 856 },
                { id: 3, name: 'Darbs', slug: 'jobs', icon: '💼', count: 432 },
                { id: 4, name: 'Elektronika', slug: 'electronics', icon: '📱', count: 2341 },
                { id: 5, name: 'Mājas un dārzs', slug: 'home-garden', icon: '🏡', count: 967 },
                { id: 6, name: 'Apģērbs', slug: 'fashion', icon: '👕', count: 1543 },
            ];

            const adsData = [
                {
                    id: 1,
                    title: 'BMW X5 2019, 3.0d',
                    price: 45000,
                    currency: 'EUR',
                    location: 'Rīga',
                    image: 'https://via.placeholder.com/300x200',
                    category: 'Transportlīdzekļi'
                },
                {
                    id: 2,
                    title: '3-istabu dzīvoklis Centrs',
                    price: 850,
                    currency: 'EUR',
                    location: 'Rīga',
                    image: 'https://via.placeholder.com/300x200',
                    category: 'Nekustamais īpašums'
                },
                {
                    id: 3,
                    title: 'iPhone 14 Pro Max',
                    price: 1200,
                    currency: 'EUR',
                    location: 'Liepāja',
                    image: 'https://via.placeholder.com/300x200',
                    category: 'Elektronika'
                },
                {
                    id: 4,
                    title: 'Web Developer pozīcija',
                    price: 2500,
                    currency: 'EUR',
                    location: 'Rīga',
                    image: 'https://via.placeholder.com/300x200',
                    category: 'Darbs'
                }
            ];

            setCategories(categoriesData);
            setRecentAds(adsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="homepage">
            <section className="hero">
                <div className="container">
                    <h1>Atrodi visu, kas tev nepieciešams</h1>
                    <p>Lielākā sludinājumu platforma Latvijā</p>
                </div>
            </section>

            <div className="container">
                <div className="search-bar">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Ko tu meklē?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="search-select"
                        >
                            <option value="">Visas kategorijas</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.slug}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn btn-primary">
                            Meklēt
                        </button>
                    </form>
                </div>
            </div>

            <section style={{ padding: '60px 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px', fontWeight: 'bold' }}>
                        Kategorijas
                    </h2>
                    <div className="category-grid">
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/category/${category.slug}`}
                                className="category-card"
                            >
                                <div className="category-icon">{category.icon}</div>
                                <div className="category-name">{category.name}</div>
                                <div className="category-count">{category.count} sludinājumi</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ padding: '60px 0', backgroundColor: 'white' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '32px', fontWeight: 'bold' }}>
                        Jaunākie sludinājumi
                    </h2>
                    <div className="grid grid-cols-4">
                        {recentAds.map(ad => (
                            <Link key={ad.id} to={`/ad/${ad.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <img
                                    src={ad.image}
                                    alt={ad.title}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h3 className="card-title" style={{ fontSize: '16px', marginBottom: '8px' }}>
                                        {ad.title}
                                    </h3>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3182ce', marginBottom: '8px' }}>
                                        {ad.price} {ad.currency}
                                    </div>
                                    <div style={{ color: '#718096', fontSize: '14px' }}>
                                        📍 {ad.location}
                                    </div>
                                    <div style={{ color: '#718096', fontSize: '12px', marginTop: '4px' }}>
                                        {ad.category}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <Link to="/ads" className="btn btn-outline btn-lg">
                            Skatīt visus sludinājumus
                        </Link>
                    </div>
                </div>
            </section>

            <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>
                        Vai tev ir kas pārdodams?
                    </h2>
                    <p style={{ fontSize: '18px', marginBottom: '30px', opacity: '0.9' }}>
                        Ievietojiet savu sludinājumu šodien un sasniedziet tūkstošiem pircēju!
                    </p>
                    <Link to="/create-ad" className="btn btn-lg" style={{ background: 'white', color: '#667eea' }}>
                        Ievietot sludinājumu
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;