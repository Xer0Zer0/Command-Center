import asyncio
import json
import logging
import sqlite3
import os
import websockets

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("AethelOrchestrator")

DB_PATH = "aethel.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("PRAGMA journal_mode=WAL;")
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            agent TEXT,
            action TEXT,
            data TEXT
        )
    """)
    conn.commit()
    conn.close()

async def handle_connection(websocket):
    logger.info("Client connected.")
    try:
        await websocket.send(json.dumps({
            "status": "connected",
            "system": "3KIG Command Center",
            "version": "1.0.0"
        }))

        async for message in websocket:
            logger.info(f"Received message: {message}")
            try:
                data = json.loads(message)
                agent = data.get("agent", "System")
                action = data.get("action", "unknown")
                payload = data.get("payload", {})

                conn = sqlite3.connect(DB_PATH)
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO telemetry (agent, action, data) VALUES (?, ?, ?)",
                    (agent, action, json.dumps(payload))
                )
                conn.commit()
                conn.close()

                response = {
                    "status": "success",
                    "agent": agent,
                    "action": action,
                    "echo": payload
                }
                await websocket.send(json.dumps(response))
                
            except json.JSONDecodeError:
                await websocket.send(json.dumps({"status": "error", "message": "Invalid JSON"}))

    except websockets.exceptions.ConnectionClosed as e:
        logger.info(f"Client disconnected: {e}")
    except Exception as e:
        logger.error(f"Error handling connection: {e}")

async def main():
    init_db()
    server = await websockets.serve(handle_connection, "0.0.0.0", 8765)
    logger.info("Aethel Orchestrator running on ws://0.0.0.0:8765")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
