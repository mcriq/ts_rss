import { createFeed, getFeeds } from "../lib/db/queries/feeds";
import { getUserById } from "../lib/db/queries/users";
import { type Feed, type User } from "../lib/db/schema";
import { createFeedFollow } from "../lib/db/queries/feed-follows";
import { printFeedFollow } from "./feed-follows";


export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <url>`);
  }

  const feedName = args[0];
  const url = args[1];

  const feed = await createFeed(feedName, url, user.id);

  if (!feed) {
    throw new Error(`Failed to create feed`);
  }

  const feedFollow = await createFeedFollow(user.id, feed.id);

  printFeedFollow(user.name, feedFollow.feedName);

  console.log("Feed created successfully!");
  printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
  console.log(`* ID:            ${feed.id}`);
  console.log(`* Created:       ${feed.createdAt}`);
  console.log(`* Updated:       ${feed.updatedAt}`);
  console.log(`* name:          ${feed.name}`);
  console.log(`* URL:           ${feed.url}`);
  console.log(`* User:          ${user.name}`);
}

export async function handlerListFeeds(cmdName: string, ...args: string[]) {
  const feeds = await getFeeds();

  if (!feeds) {
    throw new Error("Unable to get feeds");
  }

  for (const feed of feeds) {
    const user = await getUserById(feed.userId);
    if (!user) {
      throw new Error(`User not found for feed: ${feed.name}`);
    }
    console.log(`* Name:     ${feed.name}`);
    console.log(`* Url:      ${feed.url}`);
    console.log(`* UserName: ${user.name}`);
  }
}
