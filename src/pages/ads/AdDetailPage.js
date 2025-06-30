import React from 'react';
import { useParams } from 'react-router-dom';

const AdDetailPage = () => {
    const { id } = useParams();

    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1>Sludinājums #{id}</h1>
            <div className="card">
                <div className="card-body">
                    <p>Šī lapa tiks izstrādāta nākamajā posmā.</p>
                    <p>Šeit būs detalizēta sludinājuma informācija ar:</p>
                    <ul style={{ marginTop: '20px', paddingLeft: '20px' }}>
                        <li>Pilns apraksts</li>
                        <li>Attēlu galerija</li>
                        <li>Cenas informācija</li>
                        <li>Kontaktinformācija</li>
                        <li>Atrašanās vietas karte</li>
                        <li>Līdzīgi sludinājumi</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdDetailPage;