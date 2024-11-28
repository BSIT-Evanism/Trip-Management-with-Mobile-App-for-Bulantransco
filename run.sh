

#!/bin/bash

cd NewBackend && bun run dev &
cd NewFrontend && npm run dev &

wait
