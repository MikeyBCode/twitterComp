require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const fetch = require("cross-fetch");
const app = express();
const port = 5500;

const limiter = rateLimit({
  windowMs: 1000,
  max: 1,
});
const whitelist = [
  "http://127.0.0.1",
  "http://localhost:3000",
  "http://127.0.0.1/5500",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(limiter);

app.use(express.json());

app.listen(port, () => console.log(`App listening on port ${port}`));

const collectAllRetweets = async (tweetid) => {
  console.log("collecting all tweets");

  let TweetArray = [];
  let lastResult = await fetchTweets(tweetid, null);

  while (lastResult.nextToken != null) {
    TweetArray = [...TweetArray, ...lastResult.retweets];
    console.log(TweetArray.length + " tweets loaded so far");
    lastResult = await fetchTweets(tweetid, lastResult.nextToken);
  }
  return TweetArray;
};

const fetchTweets = async (tweetid, nextToken) => {
  let apiurl = `https://api.twitter.com/2/tweets/${tweetid}/retweeted_by?user.fields=created_at&expansions=pinned_tweet_id&tweet.fields=created_at`;
  if (nextToken != null) {
    apiurl = `https://api.twitter.com/2/tweets/${tweetid}/retweeted_by?user.fields=created_at&expansions=pinned_tweet_id&tweet.fields=created_at&pagination_token=${nextToken}`;
  }

  try {
    const tweets = await fetch(apiurl, {
      method: "get",
      headers: {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${process.env.TWITTER_API_BEARER}`,
      },
    });

    const tweetsJson = await tweets.json();

    const retweets = tweetsJson["data"];
    const nextToken = tweetsJson["meta"]["next_token"];
    return { retweets, nextToken };
  } catch (err) {
    return { Error: "no tweet found" };
  }
};

const fetchTweet = async (tweetid) => {
  const apiurl = `https://api.twitter.com/2/tweets?ids=${tweetid}`;
  try {
    console.log("is valid tweet?");
    const tweet = await fetch(apiurl, {
      method: "get",
      headers: {
        headers: { "Content-Type": "application/json" },
        Authorization: `Bearer ${process.env.TWITTER_API_BEARER}`,
      },
    });
    const tweetJson = await tweet.json();

    console.log(tweetJson["data"]);
    return tweetJson;
  } catch (err) {
    return { Error: "no tweet found" };
  }
};

app.post("/", async (req, res) => {
  const tweetid = req.body.tweetid;
  let data = await collectAllRetweets(tweetid);
  res.json(data);
});

app.post("/valid", async (req, res) => {
  const tweetid = req.body.tweetid;
  let data = await fetchTweet(tweetid);
  res.json(data);
});
