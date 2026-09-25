#!/data/data/com.termux/files/usr/bin/bash

echo "=== HITL Authorization Prompt ==="
read -p "Do you want to authorize the pending request? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    touch .hitl_approved
    echo "Approval lock file (.hitl_approved) created."
else
    echo "Request authorization cancelled."
fi
