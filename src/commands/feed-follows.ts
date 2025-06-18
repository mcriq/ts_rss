import {
  createFeedFollow,
  deleteFeedFollow,
  getFeedFollowsForUser,
} from "../lib/db/queries/feed-follows";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { User } from "../lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <url>`);
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

export async function handlerListFeedFollows(_: string, user: User) {
  const feedFollows = await getFeedFollowsForUser(user.id);
  if (feedFollows.length === 0) {
    console.log("No feed follows found for this user.");
  }

  console.log(`Feed follows for user: ${user.id}`);
  for (let ff of feedFollows) {
    console.log(`* ${ff.feedname}`);
  }
}

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`Usage: ${cmdName} <feed_url>`);
  }

  const feedURL = args[0];
  const feed = await getFeedByUrl(feedURL);

  if (!feed) {
    throw new Error(`Feed not found for url: ${feedURL}`);
  }
  const result = await deleteFeedFollow(user.id, feed.id);
  if (!result) {
    throw new Error(`Failed to unfollow feed: ${feedURL}`);
  }
  console.log(`${feed.name} unfollowed successfully!`);
}

export function printFeedFollow(username: string, feedname: string) {
  console.log(`* User:            ${username}`);
  console.log(`* Feed:            ${feedname}`);
}
