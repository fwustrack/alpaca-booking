#!/bin/bash

# Manual code formatting script
# This script formats all code files in the project

set -e

echo "🦙 Formatting all code files in the Alpaca Booking project..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Format frontend files with Prettier
echo -e "${YELLOW}📝 Formatting frontend files with Prettier...${NC}"

if ! command_exists npm; then
    echo -e "${RED}❌ npm not found. Please install Node.js and npm.${NC}"
    exit 1
fi

cd fe

# Check if prettier is installed
if ! npm list prettier >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Prettier not found. Installing dependencies...${NC}"
    npm install --legacy-peer-deps
fi

# Format all frontend files
npm run format

echo -e "${GREEN}✅ Frontend files formatted successfully!${NC}"

cd ..

# Format Python files with Ruff
echo -e "${YELLOW}🐍 Formatting Python files with Ruff...${NC}"

# Check if we're in a Docker environment or have uv available
if command_exists uv; then
    RUFF_CMD="uv run ruff"
elif command_exists docker-compose && docker-compose ps app-dev | grep -q "Up"; then
    RUFF_CMD="docker-compose exec -T app-dev uv run ruff"
elif command_exists ruff; then
    RUFF_CMD="ruff"
else
    echo -e "${RED}❌ Ruff not found. Please install ruff or start the Docker development environment.${NC}"
    echo -e "${YELLOW}💡 To start Docker environment: docker-compose up app-dev${NC}"
    exit 1
fi

# Format all Python files
$RUFF_CMD format .

# Run linting and auto-fix
$RUFF_CMD check --fix .

echo -e "${GREEN}✅ Python files formatted and linted successfully!${NC}"

echo ""
echo -e "${GREEN}🎉 All code formatting completed!${NC}"
echo ""
echo "Summary:"
echo "  📝 Frontend files formatted with Prettier"
echo "  🐍 Python files formatted and linted with Ruff"
echo ""
echo "You can now commit your changes with properly formatted code."