import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { n8nService } from '../services/n8nService';

export default function Home() {
    const [plate, setPlate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plate || plate.length < 7) {
            setError('Por favor, digite uma placa válida.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await n8nService.fetchVehicleData(plate);
            navigate('/result', { state: { vehicle: data, plate } });
        } catch (err) {
            setError('Erro ao consultar placa. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Strict formatting: Only Letters and Numbers, max 7 chars. No hyphens.
        // Format: AAA0X00 or AAA9999
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
        setPlate(value);
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>

            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <img src="/logo.png" alt="Logo" style={{ maxHeight: '80px', marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Consultar Placa</h1>
                    <p className="text-secondary">Descubra detalhes de qualquer veículo</p>
                </div>

                <form onSubmit={handleSearch}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="AAA1234"
                            className="plate-input"
                            value={plate}
                            onChange={handleChange}
                            disabled={loading}
                            autoFocus
                        />
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
                            Formato: AAA9999 ou AAA0X00 (Apenas letras e números)
                        </p>
                    </div>

                    {error && (
                        <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Consultando...
                            </>
                        ) : (
                            <>
                                <Search size={20} />
                                Consultar Agora
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p className="text-secondary" style={{ fontSize: '0.8rem' }}>
                        DantasInfo 8198637-2080
                    </p>
                </div>
            </div>
        </div>
    );
}
