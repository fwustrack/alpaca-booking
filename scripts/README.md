# Scripts

This directory contains utility scripts for the Alpaca Booking project.

## Available Scripts

### `setup-git-hooks.sh`
Installs a pre-commit git hook that automatically formats code before each commit.

**Usage:**
```bash
./scripts/setup-git-hooks.sh
```

**What it does:**
- Creates a pre-commit hook in `.git/hooks/pre-commit`
- Backs up existing hooks if they exist
- Configures automatic formatting for both frontend and backend code

### `format-code.sh`
Manually formats all code files in the project.

**Usage:**
```bash
./scripts/format-code.sh
```

**What it does:**
- Formats all frontend files (TypeScript, HTML, SCSS, JSON) with Prettier
- Formats all Python files with Ruff
- Runs linting and auto-fixes issues where possible

## Requirements

- **Frontend formatting**: Node.js and npm (run `cd fe && npm install --legacy-peer-deps`)
- **Backend formatting**: Either Docker development environment running or local `uv` installation with Ruff

## Notes

- Scripts are designed to work with both Docker and local development setups
- All scripts provide colored output and clear error messages
- Scripts will automatically detect the best available formatting tools