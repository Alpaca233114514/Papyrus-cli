```
╔═══════════════════════════════════════════════════════════════╗
║                          PAPYRUS CLI                          ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║ █████████████████████████████████████████████████████████████ ║
║ █                    •                                      █ ║
║ █               •          •∙                       ·       █ ║
║ █  ▓▓▓▓▓▓▓  ▓▓▓▓▓  ▓▓▓▓▓▓▓ ▓▓   ▓▓ ▓▓▓▓▓▓▓ ▓▓   ▓▓  ▓▓▓▓▓▓  █ ║
║ █  ▓▓   ▓▓ ▓▓   ▓▓ ▓▓   ▓▓ ▓▓   ▓▓ ▓▓   ▓▓ ▓▓   ▓▓ ▓▓       █ ║
║ █  ▓▓   ▓▓ ▓▓   ▓▓ ▓▓   ▓▓ ▓▓   ▓▓ ▓▓   ▓▓ ▓▓   ▓▓ ▓▓       █ ║
║ █  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓∙ ▓▓▓▓▓  ▓▓▓▓▓▓▓ ▓▓   ▓▓  ▓▓▓▓▓   █ ║
║ █  ▓▓      ▓▓   ▓▓ ▓▓         ▓▓   ▓▓ ▓▓  ∙▓▓·  ▓▓      ▓▓  █ ║
║ █ ·▓▓   ·  ▓▓   ▓▓ ▓▓         ▓▓ • ▓▓  ▓▓∙ ▓▓∙  ▓▓      ▓▓  █ ║
║ █  ▓▓ ·    ▓▓   ▓▓ ▓▓         ▓▓   ▓▓   ▓▓  ▓▓▓▓▓  ▓▓▓▓▓▓   █ ║
║ █                      ·       ∙                            █ ║
║ █       ·                                   ·               █ ║
║ █       •    •     ▓▓▓▓▓▓  ▓▓       ▓▓▓▓▓▓▓                 █ ║
║ █•              · ▓▓       ▓▓        ·▓▓▓           ·•      █ ║
║ █  ∙              ▓▓       ▓▓         ▓▓▓    ••         •   █ ║
║ █       ·         ▓▓       ▓▓         ▓▓▓         ∙         █ ║
║ █  ·              ▓▓       ▓▓ ·  ·    ▓▓▓               ·   █ ║
║ █              ∙  ▓▓•      ▓▓         ▓▓▓                   █ ║
║ █               •  ▓▓▓▓▓▓  ▓▓▓▓▓▓▓ ·▓▓▓▓▓▓▓          ∙ •  · █ ║
║ █             •              •          ·•·           ·     █ ║
║ █       ·                     •             •          ∙    █ ║
║ █████████████████████████████████████████████████████████████ ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

[![npm version](https://img.shields.io/npm/v/@alpacali/papyrus-cli)](https://www.npmjs.com/package/@alpacali/papyrus-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)

A powerful command-line interface for [Papyrus](https://github.com/Papyrus/Papyrus) - the SRS (Spaced Repetition System) learning application.

Running `papyrus` without any arguments will display the ASCII art banner above.

## ✨ Features

- 🎴 **Card Management** - Create, edit, delete, and search flashcards
- 📚 **Interactive Review** - Terminal-based review sessions with SM-2 algorithm
- 📊 **Statistics** - Track your learning progress
- 💾 **Data Management** - Backup, restore, import, and export your data
- 🚀 **Server Control** - Start and manage the Papyrus API server
- ⚙️ **Configuration** - Flexible CLI configuration

## 📦 Installation

```bash
npm install -g @alpacali/papyrus-cli
```

Or use with npx:

```bash
npx @alpacali/papyrus-cli <command>
```

## 🚀 Quick Start

```bash
# 1. Start the Papyrus server
papyrus serve

# 2. Add a card
papyrus card add "What is the capital of France?" "Paris"

# 3. Start reviewing
papyrus review

# 4. Check your stats
papyrus stats
```

## 📖 Commands

### Card Management

```bash
# List all cards
papyrus card list
papyrus card list --tags "language" --detailed

# Show card details
papyrus card show <id>

# Add a new card
papyrus card add "Question" "Answer" --tags "tag1,tag2"

# Edit a card
papyrus card edit <id> --question "New question" --tags "updated"

# Delete a card
papyrus card delete <id>
papyrus card delete <id> --force

# Search cards
papyrus card search "keyword"

# Import from text file
papyrus card import cards.txt

# Export to JSON
papyrus card export --output cards.json

# List due cards
papyrus card due
```

### Review

```bash
# Start interactive review session
papyrus review

# Show review statistics
papyrus stats
```

### Data Management

```bash
# Create backup
papyrus data backup
papyrus data backup --output my-backup.db

# Restore from backup
papyrus data restore my-backup.db

# List backups
papyrus data list-backups

# Clean old backups
papyrus data clean-backups --keep 5

# Export data
papyrus data export data.json

# Import data
papyrus data import data.json

# Show data stats
papyrus data stats
```

### Server Management

```bash
# Start server
papyrus serve
papyrus serve --port 8080 --detach

# Check server status
papyrus status

# Stop server
papyrus stop

# Open API docs
papyrus docs
```

### Configuration

```bash
# Show configuration
papyrus config

# Get specific value
papyrus config --get apiUrl

# Set value
papyrus config --set apiUrl=http://localhost:8080

# Reset to defaults
papyrus config --reset
```

## 📝 Import Format

When importing cards from a text file, use the following format:

```
Question 1 === Answer 1

Question 2 === Answer 2

# Lines starting with # are ignored
Question 3 === Answer 3
```

## ⚙️ Configuration

Configuration is stored in `~/.papyrus/config.json`:

```json
{
  "apiUrl": "http://127.0.0.1:8000",
  "dataDir": "~/Documents/Papyrus"
}
```

## 🛠️ Development

```bash
# Clone repository
git clone https://github.com/Papyrus/Papyrus-cli.git
cd Papyrus-cli

# Install dependencies
npm install

# Run in development mode
npm run dev

# Run quality checks
npm run quality

# Build
npm run build
```

## 🔧 Requirements

- Node.js 18+
- Papyrus API server running

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

---

**Papyrus CLI** - Learn smarter, remember longer.
