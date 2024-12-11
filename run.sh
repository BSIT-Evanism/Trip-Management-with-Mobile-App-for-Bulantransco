

#!/bin/bash

cd NewBackend && bun run dev &
cd NewFrontend && pnpm run dev &

wait
