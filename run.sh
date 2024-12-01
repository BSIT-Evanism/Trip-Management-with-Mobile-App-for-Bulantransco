

#!/bin/bash

cd NewBackend && bun run dev &
cd NewFrontend && bun run dev &

wait
