#!/bin/bash
echo "=== Aethel Terminal Chat (Port 3002) ==="
echo "Type 'exit' to quit."
echo ""

while true; do
    if [ -t 0 ]; then
        printf "You: "
    fi
    
    if ! read -r user_message; then
        echo ""
        break
    fi
    
    if [ "$user_message" = "exit" ]; then
        echo "Exiting chat."
        break
    fi

    if [ -z "$user_message" ]; then
        continue
    fi

    response=$(curl -s -X POST http://localhost:3002/api/chat \
        -H "Content-Type: application/json" \
        -d "$(jq -n --arg msg "$user_message" '{message: $msg}')")

    echo "Aethel: $(echo "$response" | jq -r '.reply')"
    echo ""
done
