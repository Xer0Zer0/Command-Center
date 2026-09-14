import asyncio
import websockets
import json

async def run_integration_tests():
    uri = "ws://127.0.0.1:8765"
    async with websockets.connect(uri) as websocket:
        print("Connected to Aethel Orchestrator. Running verification suite...")
        
        test_payloads = [
            {"agent": "System", "action": "ping", "payload": {"status_check": True}},
            {"agent": "FileAgent", "action": "list_dir", "payload": {"path": "."}},
            {"agent": "DatabaseAgent", "action": "query_logs", "payload": {"limit": 5}},
            {"agent": "SearchAgent", "action": "web_search", "payload": {"query": "3KIG Co orchestrator"}},
            {"agent": "WorkerAgent", "action": "dispatch_job", "payload": {"task": "system_audit", "priority": "high"}},
            {"agent": "ConfigAgent", "action": "get_config", "payload": {"key": "sovereignty"}},
            {"agent": "MemoryAgent", "action": "store_memory", "payload": {"content": "Test run execution successful", "tag": "verification"}},
            {"agent": "MemoryAgent", "action": "recall_context", "payload": {}},
            {"agent": "AnalyticsAgent", "action": "get_metrics", "payload": {}},
            {"agent": "VectorAgent", "action": "semantic_search", "payload": {"query": "test run", "top_k": 2}}
        ]
        
        passed = 0
        failed = 0
        
        for i, test in enumerate(test_payloads, 1):
            try:
                await websocket.send(json.dumps(test))
                raw_response = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                res = json.loads(raw_response)
                
                if res.get("status") == "success":
                    print(f"[TEST {i:02d}] PASS -> Agent: {test['agent']} | Action: {test['action']}")
                    passed += 1
                else:
                    print(f"[TEST {i:02d}] FAIL -> Agent: {test['agent']} | Action: {test['action']} | Response: {res}")
                    failed += 1
            except Exception as e:
                print(f"[TEST {i:02d}] ERROR -> Agent: {test['agent']} | Action: {test['action']} | Exception: {str(e)}")
                failed += 1
            
            await asyncio.sleep(0.2)
            
        print(f"\nTest Summary: {passed} Passed, {failed} Failed.")

if __name__ == "__main__":
    asyncio.run(run_integration_tests())
                                     
