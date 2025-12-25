export const API_URL = 'http://localhost:8001';

export interface PredictionResponse {
    projected_epoch_reward: number;
}

export interface AnomalyResponse {
    status: 'Healthy' | 'Risk';
    anomaly_score: number;
}

export interface ChatResponse {
    response: string;
}

export const aiService = {
    async predictRewards(uptime: number, storage: number, latency: number): Promise<number> {
        try {
            const res = await fetch(`${API_URL}/predict/rewards`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uptime_score: uptime,
                    storage_used_gb: storage,
                    latency_ms: latency
                })
            });
            if (!res.ok) throw new Error('Prediction failed');
            const data: PredictionResponse = await res.json();
            return data.projected_epoch_reward;
        } catch (e) {
            console.error(e);
            return 0;
        }
    },

    async analyzeAnomalies(metrics: any[]): Promise<AnomalyResponse[]> {
        try {
            const res = await fetch(`${API_URL}/analyze/anomalies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metrics)
            });
            if (!res.ok) throw new Error('Analysis failed');
            return await res.json();
        } catch (e) {
            console.error(e);
            return [];
        }
    },

    async chat(query: string): Promise<string> {
        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            if (!res.ok) throw new Error('Chat failed');
            const data: ChatResponse = await res.json();
            return data.response;
        } catch (e) {
            console.error(e);
            return "I'm having trouble connecting to the AI brain right now.";
        }
    }
};
