import { useEffect, useState } from 'react';
import { Server, Activity, Database, Network, AlertTriangle, TrendingUp } from 'lucide-react';
import { xandeumService, type PNode } from './services/xandeum';
import { aiService, type AnomalyResponse } from './services/api';
import { ChatWidget } from './components/ChatWidget';
import './App.css';

function App() {
  const [nodes, setNodes] = useState<PNode[]>([]); // Changed type from NodeWithAI to PNode
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodesAndAnalyze = async () => {
      try {
        // 1. Fetch Gossip Nodes
        const data = await xandeumService.getPNodeList();

        // 2. Mock metrics for AI Analysis (since we don't have real live metrics yet)
        const metricsForAI = data.map(() => ({
          uptime_score: 0.9 + Math.random() * 0.1,
          storage_used_gb: 500 + Math.random() * 200,
          latency_ms: 30 + Math.random() * 50
        }));

        // 3. Batch Analyze Anomalies
        const anomalies = await aiService.analyzeAnomalies(metricsForAI);

        // 4. Merge Data
        const enrichedNodes = await Promise.all(data.map(async (node, i) => {
          // Predict reward for each node (parallel)
          const reward = await aiService.predictRewards(
            metricsForAI[i].uptime_score,
            metricsForAI[i].storage_used_gb,
            metricsForAI[i].latency_ms
          );

          return {
            ...node,
            anomalyStatus: anomalies[i]?.status || 'Healthy',
            anomalyScore: anomalies[i]?.anomaly_score,
            projectedReward: reward,
            storageUsed: metricsForAI[i].storage_used_gb
          };
        }));

        setNodes(enrichedNodes);
        xandeumService.logConnectionMethods();
      } catch (err) {
        setError('Failed to fetch pNodes. Ensure you are connected to the network.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNodesAndAnalyze();
  }, []);

  // Calculate Aggregates
  const totalStorageTB = nodes.reduce((acc, node) => acc + (node.storageUsed || 0), 0) / 1024;

  return (
    <div className="app-container">
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>

      <header className="header" style={{ opacity: 1, transform: 'none' }}>
        <div className="logo-section">
          <Database className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Xandeum <span className="text-white">Analytics</span>
          </h1>
        </div>
        <div className="status-badge">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Devnet Active
        </div>
      </header>

      <main>
        {loading ? (
          <div className="loading-state">
            <div style={{ animation: 'spin 1s linear infinite' }}>
              <Network className="w-12 h-12 text-blue-500" />
            </div>
            <p className="mt-4 text-gray-400">Scanning Gossip Network & AI Analysis...</p>
          </div>
        ) : error ? (
          <div className="error-state glass-panel">
            <p className="text-red-400">{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            <div className="stats-grid" style={{ opacity: 1 }}>
              <div className="glass-panel stat-card">
                <h3>Active pNodes</h3>
                <div className="value">{nodes.length}</div>
              </div>
              <div className="glass-panel stat-card">
                <h3>Network Capacity</h3>
                <div className="value">{totalStorageTB.toFixed(2)} TB</div>
              </div>
              <div className="glass-panel stat-card">
                <h3>Total Epochs</h3>
                <div className="value">{new Set(nodes.map(n => n.timestamp || '')).size || 1342}</div>
              </div>
            </div>

            <h2 className="section-title">Network Nodes</h2>

            <div className="nodes-grid">
              {nodes.map((node, index) => (
                <div key={node.pubkey + index} className="glass-panel node-card" style={{ opacity: 1, transform: 'none' }}>
                  <div className="card-header">
                    <Server className="w-5 h-5 text-gray-400" />
                    <div className="flex gap-2">
                      {node.anomalyStatus === 'Risk' && (
                        <span className="version-badge text-red-400 border-red-900 bg-red-900/20 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Risk
                        </span>
                      )}
                      <span className="version-badge">v{node.version || 'Unknown'}</span>
                    </div>
                  </div>

                  <div className="node-details">
                    <div className="detail-row">
                      <span className="label">Public Key</span>
                      <span className="value font-mono text-xs" title={node.pubkey}>
                        {node.pubkey.slice(0, 8)}...{node.pubkey.slice(-8)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Gossip Address</span>
                      <span className="value font-mono text-xs">{node.gossip_addr || 'Hidden'}</span>
                    </div>

                    {/* AI Insights Section */}
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <div className="detail-row">
                        <span className="label text-cyan-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> Proj. Reward
                        </span>
                        <span className="value font-mono text-xs text-cyan-300">
                          {node.projectedReward?.toFixed(4)} XAND
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="status-indicator">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">Active in Gossip</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <ChatWidget />
    </div>
  );
}

export default App;
