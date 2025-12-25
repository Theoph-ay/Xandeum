import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import os

class RewardPredictor:
    def __init__(self):
        self.model = XGBRegressor(n_estimators=100, learning_rate=0.1)
        self.is_trained = False
        
    def train(self, df):
        """
        Train the model on historical data.
        df should have columns: ['uptime_score', 'storage_used_gb', 'latency_ms', 'epoch_rewards']
        """
        X = df[['uptime_score', 'storage_used_gb', 'latency_ms']]
        y = df['epoch_rewards']
        self.model.fit(X, y)
        self.is_trained = True
        return {"status": "trained", "score": float(self.model.score(X, y))}

    def predict(self, uptime, storage, latency):
        if not self.is_trained:
            return 0.0
        
        input_data = pd.DataFrame([[uptime, storage, latency]], 
                                columns=['uptime_score', 'storage_used_gb', 'latency_ms'])
        prediction = self.model.predict(input_data)[0]
        return float(prediction)

class AnomalyDetector:
    def __init__(self):
        self.model = IsolationForest(contamination=0.05, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        
    def train(self, df):
        """
        Train anomaly detector on metrics.
        """
        X = df[['uptime_score', 'storage_used_gb', 'latency_ms']]
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)
        self.is_trained = True
        return {"status": "trained"}
    
    def analyze(self, current_metrics):
        """
        Returns anomaly status (-1 for anomaly, 1 for normal) and score.
        current_metrics: list of dicts or DataFrame
        """
        if not self.is_trained:
            return []
            
        df = pd.DataFrame(current_metrics)
        X = df[['uptime_score', 'storage_used_gb', 'latency_ms']]
        X_scaled = self.scaler.transform(X)
        
        preds = self.model.predict(X_scaled)
        scores = self.model.decision_function(X_scaled)
        
        results = []
        for i, pred in enumerate(preds):
            status = "Risk" if pred == -1 else "Healthy"
            results.append({
                "status": status,
                "anomaly_score": float(scores[i])
            })
        return results
