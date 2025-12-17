import { CONFIG } from '../config';

interface VehicleData {
    marca: string;
    modelo: string;
    ano: string;
    cor: string;
    cidade: string;
    uf: string;
    status: string;
    fipe_valor?: string;
    [key: string]: any; // Allow other fields from N8N
}

export const n8nService = {
    async fetchVehicleData(plate: string): Promise<VehicleData> {
        try {
            // User specified GET request.
            // Using query param 'placa' or 'plate'. Defaulting to 'placa' as it matches app context,
            // but sending both to be safe if N8N structure is unknown.
            const query = new URLSearchParams({ placa: plate, plate: plate }).toString();

            const response = await fetch(`${CONFIG.N8N_WEBHOOK_URL}?${query}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na consulta: ${response.statusText}`);
            }

            const text = await response.text();
            console.log('Resposta Bruta N8N:', text);

            if (!text) {
                throw new Error('N8N retornou uma resposta vazia.');
            }

            const data = JSON.parse(text);
            return data;
        } catch (error) {
            console.error('N8N Service Error:', error);
            throw error;
        }
    }
};
