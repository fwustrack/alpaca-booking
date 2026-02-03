#!/bin/bash

# Setup script for git hooks
# This script installs the pre-commit hook for code formatting

set -e

echo "🦙 Setting up git hooks for Alpaca Booking project..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy the pre-commit hook
if [ -f ".git/hooks/pre-commit" ]; then
    echo -e "${YELLOW}⚠️  Pre-commit hook already exists. Backing up to pre-commit.backup${NC}"
    cp .git/hooks/pre-commit .git/hooks/pre-commit.backup
fi

# Create the pre-commit hook content
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Pre-commit hook for formatting code
# This hook runs Prettier for frontend files and Ruff for Python files

set -e

echo "🦙 Running pre-commit formatting checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Get list of staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

# Separate frontend and backend files
FE_FILES=""
PYTHON_FILES=""

for file in $STAGED_FILES; do
    if [[ $file == fe/* ]]; then
        # Frontend files (TypeScript, HTML, SCSS, JSON)
        if [[ $file =~ \.(ts|js|html|scss|css|json)$ ]]; then
            FE_FILES="$FE_FILES $file"
        fi
    elif [[ $file =~ \.py$ ]]; then
        # Python files
        PYTHON_FILES="$PYTHON_FILES $file"
    fi
done

# Format frontend files with Prettier
if [ -n "$FE_FILES" ]; then
    echo -e "${YELLOW}📝 Formatting frontend files with Prettier...${NC}"
    
    if ! command_exists npm; then
        echo -e "${RED}❌ npm not found. Please install Node.js and npm.${NC}"
        exit 1
    fi
    
    cd fe
    
    # Check if prettier is installed
    if ! npm list prettier >/dev/null 2>&1; then
        echo -e "${RED}❌ Prettier not found in fe/node_modules. Run 'cd fe && npm install' first.${NC}"
        exit 1
    fi
    
    # Format the files
    echo "$FE_FILES" | xargs -r npm run format --
    
    # Check if formatting changed anything
    cd ..
    for file in $FE_FILES; do
        if git diff --name-only | grep -q "^$file$"; then
            echo -e "${GREEN}✅ Formatted: $file${NC}"
            git add "$file"
        fi
    done
fi

# Format Python files with Ruff
if [ -n "$PYTHON_FILES" ]; then
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
        exit 1
    fi
    
    # Format the files
    echo "$PYTHON_FILES" | xargs -r $RUFF_CMD format
    
    # Run linting and auto-fix
    echo "$PYTHON_FILES" | xargs -r $RUFF_CMD check --fix
    
    # Check if formatting changed anything
    for file in $PYTHON_FILES; do
        if git diff --name-only | grep -q "^$file$"; then
            echo -e "${GREEN}✅ Formatted: $file${NC}"
            git add "$file"
        fi
    done
fi

# Final check - ensure no formatting issues remain
if [ -n "$FE_FILES" ]; then
    echo -e "${YELLOW}🔍 Checking frontend formatting...${NC}"
    cd fe
    if ! echo "$FE_FILES" | xargs -r npm run format:check --; then
        echo -e "${RED}❌ Frontend files still have formatting issues after auto-fix.${NC}"
        exit 1
    fi
    cd ..
fi

if [ -n "$PYTHON_FILES" ]; then
    echo -e "${YELLOW}🔍 Checking Python formatting...${NC}"
    if ! echo "$PYTHON_FILES" | xargs -r $RUFF_CMD format --check; then
        echo -e "${RED}❌ Python files still have formatting issues after auto-fix.${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}🔍 Checking Python linting...${NC}"
    if ! echo "$PYTHON_FILES" | xargs -r $RUFF_CMD check; then
        echo -e "${RED}❌ Python files have linting issues that couldn't be auto-fixed.${NC}"
        echo -e "${YELLOW}💡 Please fix the remaining issues manually and commit again.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ All formatting checks passed!${NC}"
exit 0
EOF

# Make the hook executable
chmod +x .git/hooks/pre-commit

echo -e "${GREEN}✅ Pre-commit hook installed successfully!${NC}"
echo ""
echo "The hook will now:"
echo "  📝 Format frontend files (fe/*) with Prettier"
echo "  🐍 Format Python files with Ruff"
echo "  🔍 Check formatting and linting before each commit"
echo ""
echo "To test the hook, try making a commit with some unformatted code."
echo "To skip the hook temporarily, use: git commit --no-verify"
echo ""
echo -e "${YELLOW}💡 Make sure to run 'cd fe && npm install' to install Prettier dependencies.${NC}"