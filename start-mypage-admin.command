#!/bin/zsh
set -eu

ROOT_DIR="${0:A:h}"
ADMIN_DIR="$ROOT_DIR/tools/mypage-admin"

for command_name in node npm git; do
    if ! command -v "$command_name" >/dev/null 2>&1; then
        echo "Missing required command: $command_name"
        echo "Install it, then double-click this launcher again."
        read -r "?Press Return to close..."
        exit 1
    fi
done

for command_name in ssh scp tar; do
    if ! command -v "$command_name" >/dev/null 2>&1; then
        echo "Warning: $command_name is unavailable. Editing works, but VPS deployment will be disabled."
    fi
done

cd "$ADMIN_DIR"

if [[ ! -d node_modules || package-lock.json -nt node_modules/.package-lock.json ]]; then
    echo "Installing content manager dependencies..."
    npm ci
fi

echo "Starting Mypage Publishing Desk..."
echo "Keep this window open while editing. Press Control-C to stop."
exec npm run dev -- --open
