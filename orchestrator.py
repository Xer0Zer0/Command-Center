import asyncio
import websockets
import json

async def test_suite():
    uri = "ws://127.0.0.1:8765"
    async with websockets.connect(uri) as websocket:
        print("Connected to Aethel Orchestrator for automated testing...")
        
        tests = [
            {"agent": "System", "action": "ping", "payload": {"test_id": 1}},
            {"agent": "FileAgent", "action": "list_dir", "payload": {"path": "."}},
            {"agent": "DatabaseAgent", "action": "query_logs", "payload": {"limit": 3}},
            {"agent": "SearchAgent", "action": "web_search", "payload": {"query": "Aethel architecture"}},
            {"agent": "WorkerAgent", "action": "dispatch_job", "payload": {"task": "index_vector_store", "priority": "high"}},
            {"agent": "ConfigAgent", "action": "get_config", "payload": {"key": "sovereignty"}},
            {"agent": "MemoryAgent", "action": "store_memory", "payload": {"content": "Automated test memory injection", "tag": "test"}},
            {"agent": "MemoryAgent", "action": "recall_context", "payload": {}},
            {"agent": "AnalyticsAgent", "action": "get_metrics", "payload": {}},
            {"agent": "VectorAgent", "action": "semantic_search", "payload": {"query": "test memory", "top_k": 2}},
        ]
        
        for test in tests:
            print(f"\nSending -> Agent: {test['agent']} | Action: {test['action']}")
            await websocket.send(json.dumps(test))
            response = await websocket.recv()
            print(f"Received -> {json.loads(response)}")
            await asyncio.sleep(0.5)

if __name__ == "__main__":
    asyncio.run(test_suite())
