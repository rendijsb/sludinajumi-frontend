import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Plus,
    Eye,
    Edit3,
    Trash2,
    Search,
    Calendar,
    MapPin,
    Clock,
    DollarSign,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
} from 'lucide-react';

interface Advertisement {
    id: number;
    title: string;
    description: string;
    price: number;
    currency: string;
    status: 'draft' | 'pending' | 'active' | 'expired' | 'rejected';
    location: string;
    category: string;
    images: string[];
    views_count: number;
    created_at: string;
    expires_at: string;
    is_negotiable: boolean;
    featured_until?: string;
}

const mockAds: Advertisement[] = [
    {
        id: 1,
        title: 'Toyota Corolla 2020, laba stāvoklī',
        description: 'Pārdodu savu Toyota Corolla 2020. gada automašīnu...',
        price: 15500,
        currency: 'EUR',
        status: 'active',
        location: 'Rīga',
        category: 'Transportlīdzekļi',
        images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=100&h=100&fit=crop'],
        views_count: 156,
        created_at: '2025-01-07',
        expires_at: '2025-02-07',
        is_negotiable: true,
        featured_until: '2025-01-14',
    },
    {
        id: 2,
        title: 'iPhone 14 Pro, 256GB, ideāls stāvoklis',
        description: 'Pārdodu iPhone 14 Pro ar 256GB atmiņu...',
        price: 899,
        currency: 'EUR',
        status: 'active',
        location: 'Liepāja',
        category: 'Elektronika',
        images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop'],
        views_count: 234,
        created_at: '2025-01-05',
        expires_at: '2025-02-05',
        is_negotiable: true,
    },
    {
        id: 3,
        title: 'Dzīvoklis Centrā, 3 istabas',
        description: 'Īrēju dzīvokli Rīgas centrā...',
        price: 750,
        currency: 'EUR',
        status: 'pending',
        location: 'Rīga, Centrs',
        category: 'Nekustamais īpašums',
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop'],
        views_count: 12,
        created_at: '2025-01-08',
        expires_at: '2025-02-08',
        is_negotiable: false,
    },
    {
        id: 4,
        title: 'Velosipēds, ļoti labs stāvoklis',
        description: 'Pārdodu velosipēdu...',
        price: 125,
        currency: 'EUR',
        status: 'expired',
        location: 'Daugavpils',
        category: 'Sports',
        images: [],
        views_count: 45,
        created_at: '2024-12-01',
        expires_at: '2025-01-01',
        is_negotiable: false,
    },
];

const statusConfig = {
    draft: { label: 'Melnraksts', color: 'bg-gray-100 text-gray-800', icon: Edit3 },
    pending: { label: 'Gaidīšanā', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    active: { label: 'Aktīvs', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    expired: { label: 'Beidzies', color: 'bg-red-100 text-red-800', icon: XCircle },
    rejected: { label: 'Noraidīts', color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export const MyAds: React.FC = () => {
    const [ads, setAds] = useState<Advertisement[]>(mockAds);
    const [filteredAds, setFilteredAds] = useState<Advertisement[]>(mockAds);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'created_at' | 'views_count' | 'expires_at'>('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedAds, setSelectedAds] = useState<number[]>([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adToDelete, setAdToDelete] = useState<number | null>(null);

    useEffect(() => {
        let filtered = ads;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(ad =>
                ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ad.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(ad => ad.status === statusFilter);
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue: any = a[sortBy];
            let bValue: any = b[sortBy];

            if (sortBy === 'created_at' || sortBy === 'expires_at') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredAds(filtered);
    }, [ads, searchTerm, statusFilter, sortBy, sortOrder]);

    const handleDeleteAd = (id: number) => {
        setAdToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (adToDelete) {
            setAds(prev => prev.filter(ad => ad.id !== adToDelete));
            setAdToDelete(null);
            setShowDeleteModal(false);
        }
    };

    const handleBulkAction = (action: 'delete' | 'activate' | 'deactivate') => {
        if (action === 'delete') {
            setAds(prev => prev.filter(ad => !selectedAds.includes(ad.id)));
            setSelectedAds([]);
        }
        // Add other bulk actions here
    };

    const formatPrice = (price: number, currency: string) => {
        return `${currency === 'EUR' ? '€' : currency}${price.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('lv-LV');
    };

    const getDaysUntilExpiry = (expiresAt: string) => {
        const today = new Date();
        const expiry = new Date(expiresAt);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mani sludinājumi</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Pārvaldiet savus sludinājumus un skatiet statistiku
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        to="/create-ad"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Pievienot sludinājumu
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Aktīvi</dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {ads.filter(ad => ad.status === 'active').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Clock className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Gaidīšanā</dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {ads.filter(ad => ad.status === 'pending').length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Eye className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Kopējie skatījumi</dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {ads.reduce((sum, ad) => sum + ad.views_count, 0)}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TrendingUp className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Izceltie</dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                        {ads.filter(ad => ad.featured_until && new Date(ad.featured_until) > new Date()).length}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white shadow rounded-lg mb-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Meklēt sludinājumus..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="all">Visi statusi</option>
                                <option value="active">Aktīvi</option>
                                <option value="pending">Gaidīšanā</option>
                                <option value="draft">Melnraksti</option>
                                <option value="expired">Beigušies</option>
                                <option value="rejected">Noraidīti</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="flex space-x-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="created_at">Izveidošanas datums</option>
                                <option value="views_count">Skatījumi</option>
                                <option value="expires_at">Beigu datums</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedAds.length > 0 && (
                <div className="bg-white shadow rounded-lg mb-6 p-4">
                    <div className="flex items-center justify-between">
                        <div>
              <span className="text-sm text-gray-700">
                Izvēlēti {selectedAds.length} sludinājumi
              </span>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleBulkAction('delete')}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Dzēst
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Ads List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredAds.length === 0 ? (
                        <li className="p-12 text-center">
                            <div className="text-gray-500">
                                <p className="text-lg font-medium">Nav atrasti sludinājumi</p>
                                <p className="mt-1">Mainiet meklēšanas kritērijus vai izveidojiet jaunu sludinājumu</p>
                            </div>
                        </li>
                    ) : (
                        filteredAds.map((ad) => {
                            const StatusIcon = statusConfig[ad.status].icon;
                            const daysUntilExpiry = getDaysUntilExpiry(ad.expires_at);

                            return (
                                <li key={ad.id} className="hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAds.includes(ad.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedAds(prev => [...prev, ad.id]);
                                                        } else {
                                                            setSelectedAds(prev => prev.filter(id => id !== ad.id));
                                                        }
                                                    }}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-4"
                                                />

                                                {ad.images.length > 0 && (
                                                    <img
                                                        src={ad.images[0]}
                                                        alt={ad.title}
                                                        className="h-16 w-16 object-cover rounded-md mr-4"
                                                    />
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center">
                                                        <h3 className="text-lg font-medium text-gray-900 truncate mr-2">
                                                            {ad.title}
                                                        </h3>
                                                        {ad.featured_until && new Date(ad.featured_until) > new Date() && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Izcelt
                              </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <DollarSign className="h-4 w-4 mr-1" />
                                                            {formatPrice(ad.price, ad.currency)}
                                                            {ad.is_negotiable && <span className="ml-1">(par vienošanos)</span>}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <MapPin className="h-4 w-4 mr-1" />
                                                            {ad.location}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            {ad.views_count} skatījumi
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1" />
                                                            Izveidots: {formatDate(ad.created_at)}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock className="h-4 w-4 mr-1" />
                                                            {daysUntilExpiry > 0 ? `Beigsies pēc ${daysUntilExpiry} dienām` : 'Beidzies'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[ad.status].color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig[ad.status].label}
                        </span>

                                                <div className="flex items-center space-x-1">
                                                    <Link
                                                        to={`/ad/${ad.id}`}
                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                        title="Skatīt"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        to={`/edit-ad/${ad.id}`}
                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                        title="Rediģēt"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteAd(ad.id)}
                                                        className="text-gray-400 hover:text-red-600 p-1"
                                                        title="Dzēst"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">Dzēst sludinājumu</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Vai tiešām vēlaties dzēst šo sludinājumu? Šo darbību nevar atsaukt.
                                </p>
                            </div>
                            <div className="items-center px-4 py-3 flex space-x-3 justify-center">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-900 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                >
                                    Atcelt
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    Dzēst
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};