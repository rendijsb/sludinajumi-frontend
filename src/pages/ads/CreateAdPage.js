import React from 'react';

const CreateAdPage = () => {
    return (
        <div className="container" style={{ padding: '40px 20px' }}>
            <h1>Ievietot sludinājumu</h1>
            <div className="card">
                <div className="card-body">
                    <p>Šī lapa tiks izstrādāta nākamajā posmā.</p>
                    <p>Šeit būs forma sludinājuma izveidei ar:</p>
                    <ul style={{ marginTop: '20px', paddingLeft: '20px' }}>
                        <li>Nosaukums un apraksts</li>
                        <li>Kategorijas izvēle</li>
                        <li>Cenas norādīšana</li>
                        <li>Attēlu augšupielāde</li>
                        <li>Kontaktinformācija</li>
                        <li>Atrašanās vietas norādīšana</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CreateAdPage;