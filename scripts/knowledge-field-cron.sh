#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

npm run knowledge:doctor
npm run knowledge:sync
npm run knowledge:report -- --write
