import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

export type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export async function fetchFeed(feedURL: string) {
  try {
    const res = await fetch(feedURL, {
      method: "GET",
      headers: {
        "User-Agent": "gator",
      },
    });

    if (!res.ok) {
      throw new Error(`failed to fetch feed: ${res.status} ${res.statusText}`)
    }

    const xml = await res.text();
    const parser = new XMLParser();
    const result = await parser.parse(xml);

    const channel = result.rss?.channel;

    if (!channel) {
      throw new Error("failed to parse channel");
    }

    const channelFields = ["title", "link", "description", "item"];

    for (const field of channelFields) {
      if (!(field in channel)) {
        throw new Error(`${field} not present on feed channel`);
      }
    }

    const items: any[] = Array.isArray(channel.item) ? channel.item : [channel.item];

    const rssItems: RSSItem[] = [];

    for (const item of items) {
      rssItems.push({
        title: item.title,
        link: item.link,
        description: item.description,
        pubDate: item.pubDate,
      });
    }

    const rss: RSSFeed = {
      channel : {
        title: channel.title,
        link: channel.link,
        description: channel.description,
        item: rssItems
      }
    }
    return rss;

  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error fetching feed: ${err.message}`);
    } else {
      console.error(`Error fetching feed: ${err}`);
    }
  }
}


