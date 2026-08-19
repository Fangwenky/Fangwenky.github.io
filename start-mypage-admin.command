#!/bin/zsh
set -eu

ROOT_DIR="${0:A:h}"
ADMIN_DIR="$ROOT_DIR/tools/mypage-admin"
SESSION_FILE="${TMPDIR:-/tmp}/mypage-admin-session-${UID}.json"

for command_name in node npm git; do
    if ! command -v "$command_name" >/dev/null 2>&1; then
        echo "Missing required command: $command_name"
        echo "Install it, then double-click this launcher again."
        read -r "?Press Return to close..."
        exit 1
    fi
done

if ! node -e '
    const [major, minor] = process.versions.node.split(".").map(Number);
    process.exit(major > 22 || (major === 22 && minor >= 12) ? 0 : 1);
'; then
    echo "Node.js 22.12 or newer is required. Current version: $(node --version)"
    echo "Update Node.js, then double-click this launcher again."
    read -r "?Press Return to close..."
    exit 1
fi

for command_name in ssh scp tar; do
    if ! command -v "$command_name" >/dev/null 2>&1; then
        echo "Warning: $command_name is unavailable. Editing works, but VPS deployment will be disabled."
    fi
done

cd "$ADMIN_DIR"

export MYPAGE_ADMIN_SESSION_FILE="$SESSION_FILE"

if [[ -f "$SESSION_FILE" ]]; then
    EXISTING_URL=$(node -e '
        const fs = require("node:fs");
        try {
            const session = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
            process.kill(Number(session.pid), 0);
            if (!/^http:\/\/127\.0\.0\.1:\d+\/\?token=[A-Za-z0-9_-]+$/.test(session.url)) process.exit(1);
            process.stdout.write(session.url);
        } catch { process.exit(1); }
    ' "$SESSION_FILE" 2>/dev/null || true)
    if [[ -n "$EXISTING_URL" ]]; then
        echo "Mypage Publishing Desk is already running. Reopening it now."
        open "$EXISTING_URL"
        exit 0
    fi
    rm -f "$SESSION_FILE"
fi

if lsof -nP -iTCP:8787 -sTCP:LISTEN >/dev/null 2>&1; then
    echo "Port 8787 is already in use by another process."
    echo "Close that process, then double-click this launcher again."
    read -r "?Press Return to close..."
    exit 1
fi

if [[ ! -d node_modules || package-lock.json -nt node_modules/.package-lock.json ]]; then
    echo "Installing content manager dependencies..."
    npm ci
fi

echo "Starting Mypage Publishing Desk..."
echo "Keep this window open while editing. Press Control-C to stop."
exec node src/server.js --open
