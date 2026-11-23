#!/usr/bin/env bash
# Uji skema + RLS di Postgres lokal sementara (tanpa Supabase). Pakai: bash supabase/uji-lokal.sh
set -euo pipefail
DIR=$(cd "$(dirname "$0")" && pwd)
TMP=$(mktemp -d /tmp/udcation-pg-XXXX); chmod 777 "$TMP"
BIN=/usr/lib/postgresql/16/bin
jalan() { if [ "$(id -u)" = 0 ]; then su postgres -s /bin/bash -c "$*"; else bash -c "$*"; fi; }
jalan "$BIN/initdb -D $TMP/data -A trust -U postgres >/dev/null"
jalan "$BIN/pg_ctl -D $TMP/data -o '-p 54329 -k $TMP -c listen_addresses=' -l $TMP/log -w start >/dev/null"
trap 'jalan "$BIN/pg_ctl -D $TMP/data -m immediate stop >/dev/null" || true' EXIT
P="psql -h $TMP -p 54329 -U postgres -v ON_ERROR_STOP=1 -q"
$P -f "$DIR/stub-auth-lokal.sql" >/dev/null
$P -f "$DIR/skema.sql" >/dev/null
$P -c "grant all on all tables in schema public to anon, authenticated; grant execute on all functions in schema public to anon, authenticated;" >/dev/null
$P -f "$DIR/uji-rls.sql" 2>&1 | grep -E "NOTICE|ERROR|exception" || true
