import { fetchFeed } from "../lib/rss";

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 0) {
        throw new Error(`usage: ${cmdName}`);
    }
    const url = "https://www.wagslane.dev/index.xml";
    const feedData = await fetchFeed(url);
    const feedDataStr = JSON.stringify(feedData, null, 2);
    console.log(feedDataStr);
}