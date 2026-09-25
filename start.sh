#!/bin/bash
fuser -k 3333/tcp 2>/dev/null || true
python3 -m http.server 3333
