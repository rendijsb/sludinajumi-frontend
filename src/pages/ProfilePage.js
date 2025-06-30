import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1>Mans profils</h1>
            <div className="grid grid-cols-2" style={{ gap: '30px' }}>
                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Personīgā informācija</h2>
                    </div>
                    <div className="card-body">
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Vārds:</strong> {user?.name}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <strong>E-pasts:</strong> {user?.email}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Telefons:</strong> {user?.phone || 'Nav norādīts'}
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Loma:</strong> {user?.role?.display_name || 'Lietotājs'}
                        </div>
                        <button className="btn btn-primary">Rediģēt profilu</button>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h2 className="card-title">Mani sludinājumi</h2>
                    </div>
                    <div className="card-body">
                        <p>Šeit būs redzami visi jūsu ievietotie sludinājumi.</p>
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Aktīvi:</strong> 0
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Neaktīvi:</strong> 0
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Kopā:</strong> 0
                            </div>
                        </div>
                        <button className="btn btn-outline">Skatīt visus</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;