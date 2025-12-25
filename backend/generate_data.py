import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_synthetic_data(n_nodes=20, days=30):
    """
    Generates synthetic historical data for pNodes to train ML models.
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    dates = pd.date_range(start=start_date, end=end_date, freq='H')  # Hourly data
    
    data = []
    
    for node_id in range(n_nodes):
        # Base characteristics for this node
        base_reliability = random.uniform(0.8, 0.99)
        base_storage = random.uniform(100, 1000) # GB
        
        # Public key simulation
        pubkey = f"Node_{node_id}_PubKey_{random.randint(1000,9999)}"
        
        for date in dates:
            # Simulate metrics with some randomness and trends
            
            # Anomaly injection: random drops in uptime or storage
            is_anomaly = random.random() < 0.01
            
            uptime = base_reliability + random.uniform(-0.05, 0.05)
            if uptime > 1.0: uptime = 1.0
            if is_anomaly: uptime = random.uniform(0.1, 0.5)
            
            storage_used = base_storage + random.uniform(-10, 50)
            if is_anomaly: storage_used = storage_used * 0.2
            
            latency = random.uniform(20, 100) # ms
            if is_anomaly: latency = random.uniform(500, 2000)
            
            # Simple reward formula (fictional)
            reward = (uptime * storage_used * 0.01) + random.uniform(0, 5)
            
            data.append({
                'timestamp': date,
                'node_id': pubkey,
                'uptime_score': uptime,
                'storage_used_gb': storage_used,
                'latency_ms': latency,
                'epoch_rewards': reward
            })
            
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    print("Generating synthetic Xandeum pNode data...")
    df = generate_synthetic_data()
    df.to_csv("pnode_history.csv", index=False)
    print(f"Generated {len(df)} records. Saved to pnode_history.csv")
