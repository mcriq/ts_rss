import {
  type CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";

import {
  getAllUsers,
  handlerLogin,
  handlerRegister,
  reset,
} from "./commands/users";
import { handlerAgg } from "./commands/aggregate";
import { handlerListFeeds, handlerAddFeed } from "./commands/feeds";
import {
  handlerUnfollow,
  handlerFollow,
  handlerListFeedFollows,
} from "./commands/feed-follows";
import { middlewareLoggedIn } from "./middleware";

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("usage: cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const commandsRegistry: CommandsRegistry = {};

  registerCommand(commandsRegistry, "login", handlerLogin);
  registerCommand(commandsRegistry, "register", handlerRegister);
  registerCommand(commandsRegistry, "reset", reset);
  registerCommand(commandsRegistry, "users", getAllUsers);
  registerCommand(commandsRegistry, "agg", handlerAgg);
  registerCommand(commandsRegistry, "feeds", handlerListFeeds);
  registerCommand(
    commandsRegistry,
    "addfeed",
    middlewareLoggedIn(handlerAddFeed)
  );
  registerCommand(
    commandsRegistry,
    "follow",
    middlewareLoggedIn(handlerFollow)
  );
  registerCommand(
    commandsRegistry,
    "following",
    middlewareLoggedIn(handlerListFeedFollows)
  );
  registerCommand(
    commandsRegistry,
    "unfollow",
    middlewareLoggedIn(handlerUnfollow)
  );

  try {
    await runCommand(commandsRegistry, cmdName, ...cmdArgs);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error running command ${cmdName}: ${err.message}`);
    } else {
      console.error(`Error running command ${cmdName}: ${err}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
