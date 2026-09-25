#!/data/data/com.termux/files/usr/bin/bash
echo "=== HITL Prompt ==="
read -p "Authorize request? (y/N): " response
if [[ "$response" =~ ^[Yy]$ ]]; then
    touch .hitl_approved
    echo "Approval lock file (.hitl_approved) created."
else
    echo "Request authorization cancelled."
fi
