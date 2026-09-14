import asyncio
import json
import sqlite3
import os
import websockets

def init_db():
    conn = sqlite3.connect("aethel.db")
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS command_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            agent TEXT,
            action TEXT,
            payload TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

async def handle_client(websocket):
    print("Client connected")
    try:
        async for message in websocket:
            data = json.loads(message)
            agent = data.get("agent", "System")
            action = data.get("action")
            payload = data.get("payload", {})
            
            print(f"Routing task -> Agent: {agent} | Action: {action}")
            
            result = {"status": "success", "agent": agent, "action": action}
            
            if agent == "System":
                if action == "ping":
                    result["data"] = {"message": "Aethel orchestrator active and healthy"}
                else:
                    result["data"] = {"message": f"System executed {action}"}
            elif agent == "FileAgent":
                if action == "list_dir":
                    files = os.listdir(".")
                    result["data"] = {"files": files}
                else:
                    result["data"] = {"message": "Unknown file action"}
            else:
                result["data"] = {"message": f"Agent {agent} executed {action}"}
                
            conn = sqlite3.connect("aethel.db")
            conn.execute(
                "INSERT INTO command_logs (agent, action, payload) VALUES (?, ?, ?)",
                (agent, action, json.dumps(payload))
            )
            conn.commit()
            conn.close()
            
            await websocket.send(json.dumps(result))
    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")

async def main():
    init_db()
    server = await websockets.serve(handle_client, "127.0.0.1", 8765)
    print("Aethel Orchestrator running on ws://127.0.0.1:8765")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
    
