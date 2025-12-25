# Xandeum pNode Analytics Platform

A comprehensive analytics dashboard for the Xandeum Gossip Network, featuring an AI-driven assistant and predictive machine learning models.

## 🚀 Features

- **Real-time Dashboard**: Visualize pNode performance metrics (uptime, storage, latency) in a sleek, glassmorphism UI.
- **AI Assistant**: Chat with a specialized AI (powered by Groq Llama 3) to query network data using natural language.
- **Predictive Analytics**:
    - **Reward Prediction**: XGBoost model estimates projected epoch rewards based on node performance.
    - **Anomaly Detection**: Isolation Forest algorithm identifies potentially unhealthy or malicious nodes.
- **Unified Deployment**: Single-service architecture running both FastAPI backend and React frontend.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, TypeScript, Lucide Icons.
- **Backend**: FastAPI, Python 3.11+, Pandas, Scikit-Learn, XGBoost.
- **AI**: LangChain, LangChain-Groq (Llama 3.3).
- **Deployment**: Render (Unified Service).

---

## 📦 Usage Guide

### 1. Dashboard Overview
Upon loading the application, you will see key network statistics:
- **Active pNodes**: Total number of nodes reporting data.
- **Network Capacity**: Aggregated storage capacity.
- **Total Epochs**: Number of historical data points processed (dynamically updated).

### 2. AI Chat Assistant
Click the chat icon in the bottom-right corner to open the AI Assistant.
- **Ask Questions**: "Which node has the highest uptime?", "What is the average reward?", "Show me risky nodes."
- **Data-Driven**: The AI analyzes the `pnode_history.csv` dataset directly.
- **Note**: Requires a valid `GROQ_API_KEY`. Without it, the agent runs in "Offline Mode" with limited rule-based responses.

### 3. Predictive Insights
Each node card displays AI-generated insights:
- **Projected Reward**: Estimated XAND reward for the current epoch.
- **Risk Status**: Nodes flagged as "Risk" by the Anomaly Detector are highlighted with a red warning badge.

---

## ☁️ Deployment Guide

This project is configured for **Unified Deployment** on platforms like Render. The backend serves the built frontend files.

### Prerequisites
- A [Render](https://render.com/) account.
- A [Groq API Key](https://console.groq.com/).
- GitHub repository with this code pushed.

### Step-by-Step Deployment

1.  **Create Web Service**:
    - Go to Render Dashboard -> **New +** -> **Web Service**.
    - Connect your GitHub repository (`Theoph-ay/Xandeum`).

2.  **Configure Settings**:
    - **Name**: `xandeum-analytics`
    - **Root Directory**: `backend` (CRITICAL!)
    - **Runtime**: **Python 3**
    - **Build Command**: `pip install -r requirements.txt`
    - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`

3.  **Environment Variables**:
    - Add `GROQ_API_KEY`: `gsk_...` (Your actual key).
    - Add `PYTHON_VERSION`: `3.11.0` (Recommended for stability).

4.  **Deploy**:
    - Click **Deploy Web Service**.
    - Once live, visit your Render URL (e.g., `https://xandeum-30o9.onrender.com/`).

---

## 💻 Local Development

To run the project on your machine:

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/theoph-ay/xandeum.git
    cd xandeum
    ```

2.  **Build Frontend**:
    ```bash
    npm install
    npm run build
    ```

3.  **Setup Backend**:
    ```bash
    cd backend
    # Create virtual env (optional but recommended)
    python -m venv venv
    # Install dependencies
    pip install -r requirements.txt
    ```

4.  **Configure Environment**:
    - Create a `.env` file in `backend/` and add: `GROQ_API_KEY=your_key_here`

5.  **Run Application**:
    ```bash
    # From within the backend directory
    python main.py
    ```
    - Visit `http://localhost:8001` in your browser.

---

**Built for the Superteam Bounty.**
