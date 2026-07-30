#!/bin/sh
set -e

LOCK_HASH="$(sha256sum package-lock.json | awk '{print $1}')"
LOCK_HASH_FILE="node_modules/.package-lock.sha256"

if [ ! -f "$LOCK_HASH_FILE" ] || [ "$(cat "$LOCK_HASH_FILE")" != "$LOCK_HASH" ]; then
  npm ci --no-fund
  printf '%s\n' "$LOCK_HASH" > "$LOCK_HASH_FILE"
fi

exec "$@"
