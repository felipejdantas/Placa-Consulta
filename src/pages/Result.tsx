import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Car } from 'lucide-react';

export default function Result() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const vehicle = state?.vehicle;
    const plate = state?.plate;

    if (!vehicle) {
        return (
            <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                <p>Nenhum dado encontrado.</p>
                <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '1rem', width: 'auto' }}>
                    Voltar
                </button>
            </div>
        );
    }

    // Normalize vehicle data (handle array or nested structure)
    const rawData = vehicle;
    const data = Array.isArray(rawData) ? rawData[0] : (rawData?.data || rawData);

    console.log('Dados do Veículo (Processado):', data);

    // Helper to safely access properties ignoring case
    const getField = (obj: any, key: string) => {
        if (!obj) return '';
        return obj[key] || obj[key.toUpperCase()] || obj[key.toLowerCase()] || '';
    };

    const marca = getField(data, 'brand') || getField(data, 'marca');

    // Prioritize texto_modelo from FIPE as requested, then fallback to standard fields
    let modelo = data.fipe?.dados?.[0]?.texto_modelo;
    if (!modelo) {
        modelo = getField(data, 'model') || getField(data, 'modelo');
    }

    const yearModel = data.anoModelo || getField(data, 'anoModelo') || '';
    const yearFab = data.ano || getField(data, 'year') || '';
    const cor = getField(data, 'color') || getField(data, 'cor');

    // Extract Chassi
    const chassi = getField(data, 'chassi') || getField(data, 'chassis');

    return (
        <div className="container animate-fade-in">
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '1rem'
                }}
            >
                <ArrowLeft size={20} /> Voltar para busca
            </button>

            <div className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ background: 'var(--accent-color)', padding: '1rem', borderRadius: '50%' }}>
                        <Car size={32} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{plate}</h2>
                        <p className="text-secondary">{modelo || 'Modelo Desconhecido'}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                    <InfoItem label="Marca" value={marca} />
                    <InfoItem label="Modelo" value={modelo} />
                    <InfoItem label="Ano Fab." value={yearFab} />
                    <InfoItem label="Ano Modelo" value={yearModel} />
                    <InfoItem label="Cor" value={cor} />
                    <InfoItem label="Chassi" value={chassi} highlight />
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
    return (
        <div style={{ padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-sm)' }}>
            <p className="text-secondary" style={{ fontSize: '0.8rem', marginBottom: '0.2rem' }}>{label}</p>
            <p style={{ fontWeight: '600', color: highlight ? '#ef4444' : 'var(--text-primary)' }}>{value || '--'}</p>
        </div>
    );
}
