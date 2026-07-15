#!/usr/bin/env bash
cleanup() {
    lsof -ti:54321 -ti:3001 2>/dev/null | xargs kill -9 2>/dev/null || true
}
trap cleanup EXIT
cleanup
playwright test "$@"
