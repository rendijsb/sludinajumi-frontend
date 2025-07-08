import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Save,
    Edit3,
    CheckCircle,
    AlertCircle,
    Activity,
    Calendar,
} from 'lucide-react';

interface ProfileFormData {
    name: string;
    email: string;
    phone: string;
}

interface PasswordFormData {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export const Profile: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'activity'>('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [profileData, setProfileData] = useState<ProfileFormData>({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const [passwordData, setPasswordData] = useState<PasswordFormData>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: [] }));
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: [] }));
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setMessage(null);

        try {
            // Here you would make API call to update profile
            console.log('Updating profile:', profileData);

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setMessage({ type: 'success', text: 'Profils veiksmīgi atjaunināts!' });
            setIsEditing(false);
        } catch (err: any) {
            const responseErrors = err.response?.data?.errors || {};
            setErrors(responseErrors);
            setMessage({ type: 'error', text: 'Neizdevās atjaunināt profilu' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setMessage(null);

        // Client-side validation
        const newErrors: Record<string, string[]> = {};

        if (passwordData.password !== passwordData.password_confirmation) {
            newErrors.password_confirmation = ['Paroles nesakrīt'];
        }

        if (passwordData.password.length < 8) {
            newErrors.password = ['Parolei jābūt vismaz 8 simbolus garai'];
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            // Here you would make API call to update password
            console.log('Updating password');

            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setMessage({ type: 'success', text: 'Parole veiksmīgi nomainīta!' });
            setPasswordData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        } catch (err: any) {
            const responseErrors = err.response?.data?.errors || {};
            setErrors(responseErrors);
            setMessage({ type: 'error', text: 'Neizdevās nomainīt paroli' });
        } finally {
            setLoading(false);
        }
    };

    const getFieldError = (fieldName: string) => {
        return errors[fieldName]?.[0];
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Mock activity data
    const activityData = [
        { id: 1, action: 'Izveidots sludinājums', details: 'Toyota Corolla 2020', date: '2025-01-07', time: '14:30' },
        { id: 2, action: 'Atjaunināts profils', details: 'Mainīts telefona numurs', date: '2025-01-06', time: '10:15' },
        { id: 3, action: 'Pieteicies sistēmā', details: 'Veiksmīga autentifikācija', date: '2025-01-06', time: '09:45' },
        { id: 4, action: 'Izveidots sludinājums', details: 'iPhone 14 Pro pārdošana', date: '2025-01-05', time: '16:20' },
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                        <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                        </div>
                        <div className="ml-4">
                            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                            <div className="flex items-center text-sm text-gray-500">
                                <Mail className="h-4 w-4 mr-1" />
                                {user?.email}
                                {user?.email_verified_at && (
                                    <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                                )}
                            </div>
                            {user?.phone && (
                                <div className="flex items-center text-sm text-gray-500 mt-1">
                                    <Phone className="h-4 w-4 mr-1" />
                                    {user.phone}
                                    {user?.phone_verified_at && (
                                        <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                activeTab === 'profile'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Profila informācija
                        </button>
                        <button
                            onClick={() => setActiveTab('password')}
                            className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                activeTab === 'password'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Mainīt paroli
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`py-2 px-4 border-b-2 font-medium text-sm ${
                                activeTab === 'activity'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Aktivitāte
                        </button>
                    </nav>
                </div>

                {/* Message */}
                {message && (
                    <div className={`p-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {message.type === 'success' ? (
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                ) : (
                                    <AlertCircle className="h-5 w-5 text-red-400" />
                                )}
                            </div>
                            <div className="ml-3">
                                <p className={`text-sm font-medium ${
                                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {message.text}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'profile' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">Profila informācija</h2>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Rediģēt
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleProfileSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Vārds, uzvārds
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={profileData.name}
                                                onChange={handleProfileChange}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full px-3 py-2 border ${
                                                    getFieldError('name') ? 'border-red-300' : 'border-gray-300'
                                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                                    !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                            />
                                        </div>
                                        {getFieldError('name') && (
                                            <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            E-pasta adrese
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleProfileChange}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full px-3 py-2 border ${
                                                    getFieldError('email') ? 'border-red-300' : 'border-gray-300'
                                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                                    !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                            />
                                        </div>
                                        {getFieldError('email') && (
                                            <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefona numurs
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleProfileChange}
                                                disabled={!isEditing}
                                                className={`pl-10 block w-full px-3 py-2 border ${
                                                    getFieldError('phone') ? 'border-red-300' : 'border-gray-300'
                                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                                    !isEditing ? 'bg-gray-50 text-gray-500' : ''
                                                }`}
                                            />
                                        </div>
                                        {getFieldError('phone') && (
                                            <p className="mt-1 text-sm text-red-600">{getFieldError('phone')}</p>
                                        )}
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setProfileData({
                                                    name: user?.name || '',
                                                    email: user?.email || '',
                                                    phone: user?.phone || '',
                                                });
                                                setErrors({});
                                                setMessage(null);
                                            }}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Atcelt
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Saglabājam...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Saglabāt
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Mainīt paroli</h2>

                            <form onSubmit={handlePasswordSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Pašreizējā parole
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showPasswords.current ? 'text' : 'password'}
                                                id="current_password"
                                                name="current_password"
                                                value={passwordData.current_password}
                                                onChange={handlePasswordChange}
                                                className={`pl-10 pr-10 block w-full px-3 py-2 border ${
                                                    getFieldError('current_password') ? 'border-red-300' : 'border-gray-300'
                                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility('current')}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.current ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        {getFieldError('current_password') && (
                                            <p className="mt-1 text-sm text-red-600">{getFieldError('current_password')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                            Jaunā parole
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showPasswords.new ? 'text' : 'password'}
                                                id="password"
                                                name="password"
                                                value={passwordData.password}
                                                onChange={handlePasswordChange}
                                                className={`pl-10 pr-10 block w-full px-3 py-2 border ${
                                                    getFieldError('password') ? 'border-red-300' : 'border-gray-300'
                                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility('new')}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.new ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        {getFieldError('password') && (
                                            <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                            Apstiprināt jauno paroli
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type={showPasswords.confirm ? 'text' : 'password'}
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                value={passwordData.password_confirmation}
                                                onChange={handlePasswordChange}
                                                className={`pl-10 pr-10 block w-full px-3 py-2 border ${
                                                    getFieldError('password_confirmation') ? 'border-red-300' : 'border-gray-300'
                                                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility('confirm')}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    {showPasswords.confirm ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        {getFieldError('password_confirmation') && (
                                            <p className="mt-1 text-sm text-red-600">{getFieldError('password_confirmation')}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Nomainām...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-4 w-4 mr-2" />
                                                Nomainīt paroli
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div>
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Aktivitātes vēsture</h2>

                            <div className="flow-root">
                                <ul className="-mb-8">
                                    {activityData.map((activity, index) => (
                                        <li key={activity.id}>
                                            <div className="relative pb-8">
                                                {index !== activityData.length - 1 ? (
                                                    <span
                                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                        aria-hidden="true"
                                                    />
                                                ) : null}
                                                <div className="relative flex space-x-3">
                                                    <div>
                            <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                              <Activity className="h-4 w-4 text-white" />
                            </span>
                                                    </div>
                                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                        <div>
                                                            <p className="text-sm text-gray-900 font-medium">{activity.action}</p>
                                                            <p className="text-sm text-gray-500">{activity.details}</p>
                                                        </div>
                                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                            <div className="flex items-center">
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                {activity.date}
                                                            </div>
                                                            <time>{activity.time}</time>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};