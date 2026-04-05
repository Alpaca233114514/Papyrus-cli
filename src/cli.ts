#!/usr/bin/env node
/**
 * Papyrus CLI - Main Entry Point
 *
 * A command-line interface for the Papyrus SRS learning system.
 */

import { Command } from "commander";
import chalk from "chalk";
import { displayConfig, resetConfig, setConfig } from "./config.js";
import {
  addCardCommand,
  deleteCardCommand,
  dueCardsCommand,
  editCardCommand,
  exportCardsCommand,
  importCardsCommand,
  listCardsCommand,
  searchCardsCommand,
  showCardCommand,
} from "./commands/cards.js";
import {
  backupCommand,
  cleanBackupsCommand,
  exportCommand,
  importCommand,
  listBackupsCommand,
  restoreCommand,
  statsCommand,
} from "./commands/data.js";
import { quickReviewCommand, reviewCommand, reviewStatsCommand } from "./commands/review.js";
import { docsCommand, serveCommand, statusCommand, stopCommand } from "./commands/serve.js";

// Version - will be replaced by build process
const version = "1.0.0";

// ASCII Art Banner
const ASCII_BANNER = `
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
`;

// Create CLI
const program = new Command()
  .name("papyrus")
  .description("Papyrus CLI - Command line interface for Papyrus SRS")
  .version(version, "-v, --version", "Display version number")
  .configureOutput({
    outputError: (str, write) => write(chalk.red(str)),
  });

// ==================== Card Commands ====================

const cardCmd = program.command("card").alias("cards").description("Manage flashcards");

cardCmd
  .command("list")
  .alias("ls")
  .description("List all cards")
  .option("-l, --limit <number>", "Limit number of results", parseInt)
  .option("-t, --tags <tags>", "Filter by tags (comma-separated)")
  .option("-d, --detailed", "Show detailed information")
  .action(async (options) => {
    try {
      await listCardsCommand(options);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

cardCmd
  .command("show <id>")
  .alias("get")
  .description("Show card details")
  .action(async (id) => {
    try {
      await showCardCommand(id);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

cardCmd
  .command("add <question> <answer>")
  .alias("create")
  .description("Add a new card")
  .option("-t, --tags <tags>", "Add tags (comma-separated)")
  .action(async (question, answer, options) => {
    try {
      await addCardCommand(question, answer, options);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

cardCmd
  .command("edit <id>")
  .alias("update")
  .description("Edit a card")
  .option("-q, --question <text>", "Update question")
  .option("-a, --answer <text>", "Update answer")
  .option("-t, --tags <tags>", "Update tags (comma-separated)")
  .action(async (id, options) => {
    try {
      await editCardCommand(id, options);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

cardCmd
  .command("delete <id>")
  .alias("rm")
  .description("Delete a card")
  .option("-f, --force", "Force deletion without confirmation")
  .action(async (id, options) => {
    try {
      await deleteCardCommand(id, options.force);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

cardCmd
  .command("search <query>")
  .alias("find")
  .description("Search cards")
  .action(async (query) => {
    try {
      await searchCardsCommand(query);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

cardCmd
  .command("import <file>")
  .description("Import cards from text file")
  .action(async (file) => {
    try {
      await importCardsCommand(file);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

cardCmd
  .command("export")
  .description("Export cards to JSON")
  .option("-o, --output <file>", "Output file path")
  .action(async (options) => {
    try {
      await exportCardsCommand(options);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

cardCmd
  .command("due")
  .alias("due-today")
  .description("List cards due for review")
  .action(async () => {
    try {
      await dueCardsCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// ==================== Review Commands ====================

program
  .command("review")
  .alias("study")
  .description("Start a review session")
  .action(async () => {
    try {
      await reviewCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

program
  .command("stats")
  .alias("statistics")
  .description("Show review statistics")
  .action(async () => {
    try {
      await reviewStatsCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// ==================== Data Commands ====================

const dataCmd = program.command("data").description("Manage data and backups");

dataCmd
  .command("backup")
  .description("Create a backup")
  .option("-o, --output <file>", "Output file path")
  .action(async (options) => {
    try {
      await backupCommand(options);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

dataCmd
  .command("restore <file>")
  .description("Restore from backup")
  .option("-f, --force", "Force restore without confirmation")
  .action(async (file, options) => {
    try {
      await restoreCommand(file, options.force);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

dataCmd
  .command("list-backups")
  .alias("backups")
  .description("List all backups")
  .action(async () => {
    try {
      await listBackupsCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

dataCmd
  .command("clean-backups")
  .description("Clean old backups")
  .option("-k, --keep <number>", "Number of backups to keep", parseInt, 10)
  .action(async (options) => {
    try {
      await cleanBackupsCommand(options.keep);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

dataCmd
  .command("export <file>")
  .description("Export data to JSON file")
  .action(async (file) => {
    try {
      await exportCommand(file);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

dataCmd
  .command("import <file>")
  .description("Import data from JSON file")
  .option("-f, --force", "Force import without confirmation")
  .action(async (file, options) => {
    try {
      await importCommand(file, options.force);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

dataCmd
  .command("stats")
  .description("Show data statistics")
  .action(async () => {
    try {
      await statsCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// ==================== Server Commands ====================

program
  .command("serve")
  .alias("server")
  .description("Start the Papyrus API server")
  .option("-p, --port <number>", "Port to listen on", parseInt)
  .option("-h, --host <address>", "Host to bind to")
  .option("-d, --detach", "Run in background")
  .action(async (options) => {
    try {
      await serveCommand(options);
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

program
  .command("status")
  .description("Check server status")
  .action(async () => {
    try {
      await statusCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

program
  .command("stop")
  .description("Stop the Papyrus server")
  .action(async () => {
    try {
      await stopCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

program
  .command("docs")
  .description("Open API documentation")
  .action(async () => {
    try {
      await docsCommand();
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// ==================== Config Commands ====================

program
  .command("config")
  .description("Manage CLI configuration")
  .option("--get <key>", "Get configuration value")
  .option("--set <key=value>", "Set configuration value")
  .option("--reset", "Reset to defaults")
  .action(async (options) => {
    try {
      if (options.reset) {
        resetConfig();
        console.log(chalk.green("Configuration reset to defaults."));
      } else if (options.get) {
        const { loadConfig } = await import("./config.js");
        const config = loadConfig();
        const value = config[options.get as keyof typeof config];
        console.log(`${options.get}: ${value}`);
      } else if (options.set) {
        const [key, value] = options.set.split("=");
        if (!key || value === undefined) {
          console.error(chalk.red("Usage: --set key=value"));
          process.exit(1);
        }
        setConfig(key, value);
        console.log(chalk.green(`Set ${key} = ${value}`));
      } else {
        displayConfig();
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error}`));
      process.exit(1);
    }
  });

// ==================== Help & Info ====================

program
  .command("quickstart")
  .description("Show quick start guide")
  .action(() => {
    console.log(chalk.bold("\n📚 Papyrus CLI Quick Start\n"));
    console.log("1. Start the server:");
    console.log(chalk.cyan("   papyrus serve\n"));
    console.log("2. Add some cards:");
    console.log(chalk.cyan('   papyrus card add "Question?" "Answer!"\n'));
    console.log("3. Start reviewing:");
    console.log(chalk.cyan("   papyrus review\n"));
    console.log("4. Check stats:");
    console.log(chalk.cyan("   papyrus stats\n"));
    console.log("For more help: papyrus --help\n");
  });

// Error handling
program.exitOverride();

async function main() {
  try {
    // Check if no arguments provided - show banner only
    if (process.argv.length <= 2) {
      console.log(chalk.cyan(ASCII_BANNER));
      console.log(chalk.gray(`Version: ${version}`));
      console.log(chalk.dim(`Run "papyrus --help" for available commands.\n`));
      return;
    }
    await program.parseAsync();
  } catch (error) {
    // Commander handles its own errors
    process.exit(1);
  }
}

main();
