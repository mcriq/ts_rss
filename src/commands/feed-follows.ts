import { readConfig } from "../config";
import { createFeedFollow, getFeedFollowsForUser } from "../lib/db/queries/feed-follows";
import { getUser } from "../lib/db/queries/users";
import { getFeedByUrl } from "../lib/db/queries/feeds";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`Usage: ${cmdName} <url>`);
    }

    const config = readConfig();
    const user = await getUser(config.currentUserName);

    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`)
    }

    const url = args[0];
    const feed = await getFeedByUrl(url);

    if (!feed) {
        throw new Error(`Feed not found`);
    }

    const feedFollow = await createFeedFollow(user.id, feed.id);
    
    if (!feedFollow) {
        throw new Error(`Feed follow failed`);
    }

    console.log(`User: ${user.name} successfully followed feed: ${feed.name}`);
}

export async function handlerListFeedFollows(_: string) {
    const config = readConfig();
    const user = await getUser(config.currentUserName);

    if (!user) {
        throw new Error(`User ${config.currentUserName} not found`);
    }

    const feedFollows = await getFeedFollowsForUser(user.id);
    if (feedFollows.length === 0) {
        console.log("No feed follows found for this user.");
    }

    console.log(`Feed follows for user: ${user.id}`);
    for (let ff of feedFollows) {
        console.log(`* ${ff.feedname}`);
    }
}

export function printFeedFollow(username: string, feedname: string) {
    console.log(`* User:            ${username}`);
    console.log(`* Feed:            ${feedname}`);
}