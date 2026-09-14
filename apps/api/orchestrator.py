# /opt/aethel/orchestrator.py

import asyncio
import sqlite3
import json
import logging
from datetime import datetime
import websockets

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.FileHandler("/opt/aethel/logs/orchestrator.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("AethelOrchestrator")

DB_PATH = "/opt/aethel/aethel_knowledge.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA journal_mode=WAL;")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_state (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at TIMESTAMP
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS agent_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent_name TEXT,
            payload TEXT,
            timestamp TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()
    logger.info("Database initialized successfully with WAL mode.")

async def handle_connection(websocket):
    client_ip = websocket.remote_address[0]
    logger.info(f"New client connected from {client_ip}")
    try:
        async for raw_message in websocket:
            try:
                data = json.loads(raw_message)
                agent = data.get("agent", "System")
                action = data.get("action", "ping")
                payload = data.get("payload", {})
                
                logger.info(f"Routed action '{action}' to Agent: {agent}")
                
                response = {
                    "status": "success",
                    "agent": agent,
                    "echo": payload,
                    "timestamp": datetime.utcnow().isoformat()
                }
                await websocket.send(json.dumps(response))
                
            except json.JSONDecodeError:
                await websocket.send(json.dumps({"error": "Invalid JSON payload"}))
    except websockets.exceptions.ConnectionClosed as e:
        logger.info(f"Client disconnected: {e}")

async def main():
    init_db()
    server = await websockets.serve(handle_connection, "0.0.0.0", 8765)
    logger.info("Aethel Sovereign Orchestrator running on ws://0.0.0.0:8765")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
                                     
