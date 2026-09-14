async function runDashboardTestSuite() {
    const testCases = [
        { agent: "System", action: "ping", payload: { origin: "dashboard_ui" } },
        { agent: "FileAgent", action: "list_dir", payload: { path: "." } },
        { agent: "MemoryAgent", action: "store_memory", payload: { content: "UI test injection", tag: "dashboard" } },
        { agent: "VectorAgent", action: "semantic_search", payload: { query: "UI test", top_k: 1 } }
    ];

    document.getElementById("output").innerText = "Running browser-based test suite...\n\n";
    
    for (const test of testCases) {
        sendAgentCommand(test.agent, test.action, test.payload);
        await new Promise(resolve => setTimeout(resolve, 600));
    }
}
