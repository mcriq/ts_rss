import { type CommandHandler, UserCommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUser } from "./lib/db/queries/users";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const config = readConfig();
    const username = config.currentUserName;
    if (!username) {
      throw new Error(`User not logged in`);
    }

    const user = await getUser(username);
    if (!user) {
      throw new Error(`User ${username} not found`);
    }

    await handler(cmdName, user, ...args);
  }
}
