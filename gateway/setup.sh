#!/bin/bash

# Quick Start Script for API Gateway
# This script helps set up and run the gateway

set -e  # Exit on error

echo "🚀 Setting up API Gateway..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env and set your JWT_SECRET!"
    echo "   JWT_SECRET should match the one in services/authn/.env"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build TypeScript
echo "🔨 Building TypeScript..."
pnpm build

echo "✅ Gateway setup complete!"
echo ""
echo "To start the gateway:"
echo "  pnpm dev       # Development mode with hot reload"
echo "  pnpm start     # Production mode"
echo ""
echo "Make sure these services are running:"
echo "  - PostgreSQL (docker compose up in root)"
echo "  - Auth Service (pnpm dev in services/authn)"
echo "  - Blog Service (pnpm dev in services/blog)"
echo ""
echo "Gateway will run on: http://localhost:3000"
