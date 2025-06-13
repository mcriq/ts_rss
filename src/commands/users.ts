import { readConfig, setUser } from "../config";
import { createUser, deleteAllUsers, getUser, getUsers } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  
  const userName = args[0];
  const user = await getUser(userName);

  if (!user) {
    throw new Error(`user: ${userName} does not exist`);
  }
  setUser(userName);
  console.log(`Username has been set to: ${userName}`);
}

export async function getAllUsers(cmdName: string, ...args: string[]) {
  const result = await getUsers();
  const { currentUserName: currUser } = readConfig();
  for (const user of result) {
    if (user.name === currUser) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <name>`);
  }

  const userName = args[0];
  const user = await createUser(userName);
  if (!user) {
    throw new Error(`User: ${userName} not found`);
  }

  setUser(user.name);
  console.log("User created successfully!");
}

export async function reset(cmdName: string, ...args: string[]) {
  const result = await deleteAllUsers();
  console.log("Users data has been reset!");
}