#!/bin/sh

echo "Aguardar DB..."

sleep 10

echo "Executando migrations..."

npx prisma migrate dev

echo "Iniciando..."

npm run start