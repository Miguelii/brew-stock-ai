#!/usr/bin/env bash
set -euo pipefail

# Ports used by the E2E stack: 54321 = mock Supabase/Finnhub, 3001 = Next.js webServer.
PORTS=(54321 3001)

# Free any process a previously interrupted run left bound to those ports.
# Graceful SIGTERM first, then SIGKILL for anything that ignores it.
cleanup() {
    command -v lsof >/dev/null 2>&1 || return 0
    for port in "${PORTS[@]}"; do
        local pids
        pids="$(lsof -ti:"$port" 2>/dev/null || true)"
        [ -n "$pids" ] || continue
        kill $pids 2>/dev/null || true
        sleep 0.2
        kill -9 $pids 2>/dev/null || true
    done
}

# Runs on normal exit AND on Ctrl+C, so the ports are always released.
trap cleanup EXIT
cleanup

playwright test "$@"
