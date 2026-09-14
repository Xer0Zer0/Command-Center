import asyncio
import json
import sqlite3
import os
import websockets
import urllib.request

task_queue = asyncio.Queue()

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

async def worker_processor():
    while True:
        task_data = await task_queue.get()
        task_name = task_data.get("task")
        priority = task_data.get("priority", "normal")
        print(f"Processing background job -> Task: {task_name} | Priority: {priority}")
        await asyncio.sleep(2) # Simulate background processing
        conn = sqlite3.connect("aethel.db")
        conn.execute(
            "INSERT INTO command_logs (agent, action, payload) VALUES (?, ?, ?)",
            ("WorkerAgent", "complete_job", json.dumps({"task": task_name, "status": "completed"}))
        )
        conn.commit()
        conn.close()
        task_queue.task_done()
        print(f"Background job completed -> Task: {task_name}")

async def background_heartbeat():
    while True:
        await asyncio.sleep(60)
        conn = sqlite3.connect("aethel.db")
        conn.execute(
            "INSERT INTO command_logs (agent, action, payload) VALUES (?, ?, ?)",
            ("System", "heartbeat", json.dumps({"status": "healthy", "mode": "offline"}))
        )
        conn.commit()
        conn.close()
        print("Heartbeat recorded to audit log.")

async def handle_client(websocket):
    print("Client connected")
    try:
        async for message in websocket:
            data = json.loads(message)
            agent = data.get("agent", "System")
            action = data.get("action")
            payload = data.get("payload", {})
            
            print(f"Routing task -> Agent: {agent} | Action: {action} | Payload: {payload}")
            
            result = {"status": "success", "agent": agent, "action": action}
            
            if agent == "System":
                if action == "ping":
                    result["data"] = {"message": "Aethel orchestrator active and healthy", "echo_payload": payload}
                else:
                    result["data"] = {"message": f"System executed {action}", "payload": payload}
            elif agent == "FileAgent":
                if action == "list_dir":
                    target_dir = payload.get("path", ".")
                    files = os.listdir(target_dir)
                    result["data"] = {"path": target_dir, "files": files}
                elif action == "export_logs":
                    conn = sqlite3.connect("aethel.db")
                    cursor = conn.cursor()
                    cursor.execute("SELECT id, agent, action, payload, timestamp FROM command_logs")
                    rows = cursor.fetchall()
                    conn.close()
                    export_path = payload.get("filename", "aethel_export.json")
                    with open(export_path, "w") as f:
                        json.dump(rows, f, indent=2)
                    result["data"] = {"status": "success", "file": export_path, "exported_records": len(rows)}
                else:
                    result["data"] = {"message": "Unknown file action"}
            elif agent == "DatabaseAgent":
                if action == "query_logs":
                    limit = payload.get("limit", 10)
                    conn = sqlite3.connect("aethel.db")
                    cursor = conn.cursor()
                    cursor.execute("SELECT id, agent, action, timestamp FROM command_logs ORDER BY id DESC LIMIT ?", (limit,))
                    logs = cursor.fetchall()
                    conn.close()
                    result["data"] = {"logs": logs, "limit": limit}
                else:
                    result["data"] = {"message": "Unknown database action"}
            elif agent == "SearchAgent":
                if action == "web_search":
                    query = payload.get("query", "Aethel intelligence")
                    result["data"] = {"query": query, "results": [f"Simulated local result for: {query}"]}
                else:
                    result["data"] = {"message": "Unknown search action"}
            elif agent == "WorkerAgent":
                if action == "dispatch_job":
                    task_name = payload.get("task", "sync_index")
                    priority = payload.get("priority", "normal")
                    await task_queue.put({"task": task_name, "priority": priority})
                    result["data"] = {"job": task_name, "priority": priority, "status": "queued", "queue_size": task_queue.qsize()}
                else:
                    result["data"] = {"message": "Unknown worker action"}
            elif agent == "ConfigAgent":
                if action == "get_config":
                    result["data"] = {"mode": "offline", "sovereignty": "strict", "version": "1.0.0", "custom_param": payload.get("key", "none")}
                else:
                    result["data"] = {"message": "Unknown config action"}
            elif agent == "MemoryAgent":
                if action == "recall_context":
                    scope = payload.get("scope", "sovereign")
                    result["data"] = {"context_scope": scope, "stored_items": 12, "status": "active_recall"}
                else:
                    result["data"] = {"message": "Unknown memory action"}
            elif agent == "AnalyticsAgent":
                if action == "get_metrics":
                    result["data"] = {"total_agents": 9, "storage_mode": "WAL", "system_status": "optimal", "active_queue": task_queue.qsize()}
                else:
                    result["data"] = {"message": "Unknown analytics action"}
            elif agent == "LLMAgent":
                if action == "generate":
                    prompt = payload.get("prompt", "Hello Aethel")
                    model = payload.get("model", "llama3")
                    try:
                        req_data = json.dumps({"model": model, "prompt": prompt, "stream": False}).encode("utf-8")
                        req = urllib.request.Request(
                            "http://localhost:11434/api/generate",
                            data=req_data,
                            headers={"Content-Type": "application/json"}
                        )
                        with urllib.request.urlopen(req, timeout=30) as response:
                            res_body = json.loads(response.read().decode("utf-8"))
                            llm_text = res_body.get("response", "No response generated")
                            result["data"] = {"model": model, "prompt": prompt, "response": llm_text}
                    except Exception as e:
                        result["data"] = {"error": str(e), "message": "Failed to connect to local Ollama instance"}
                else:
                    result["data"] = {"message": "Unknown LLM action"}
            elif agent == "VectorAgent":
                if action == "semantic_search":
                    query_text = payload.get("query", "orchestrator state")
                    top_k = payload.get("top_k", 2)
                    result["data"] = {
                        "query": query_text, 
                        "top_k": top_k,
                        "matches": [
                            {"id": 3, "agent": "System", "similarity": 0.94, "content": "Aethel orchestrator active and healthy"},
                            {"id": 7, "agent": "ConfigAgent", "similarity": 0.88, "content": "strict sovereignty offline configuration loaded"}
                        ][:top_k]
                    }
                else:
                    result["data"] = {"message": "Unknown vector action"}
            else:
                result["data"] = {"message": f"Agent {agent} executed {action}", "payload": payload}
                
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
    asyncio.create_task(background_heartbeat())
    asyncio.create_task(worker_processor())
    server = await websockets.serve(handle_client, "127.0.0.1", 8765)
    print("Aethel Orchestrator running on ws://127.0.0.1:8765")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())
    
