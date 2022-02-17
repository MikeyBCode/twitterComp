
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
})
const whitelist = ["http://127.0.0.1","http://localhost:3000", "http://127.0.0.1/5500" ];

const corsOptions = {
	origin: (origin, callback) => {
		if(!origin || whitelist.indexOf(origin) !== -1){
			callback(null,true);
		}else{
			callback(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(limiter);

app.use(express.json());

app.listen(port, () => console.log(`App listening on port ${port}`));

const fetchTweets = async(tweetid) => {
	const api = `https://api.twitter.com/2/tweets/${tweetid}/retweeted_by`;

	try{
		const tweets = await fetch(api,{method: 'get',
		headers: {headers:{ 'Content-Type': 'application/json' } ,"Authorization" : `Bearer ${process.env.TWITTER_API_BEARER}`}});

		const tweetsJson = await tweets.json();
		// console.log(tweets);
		console.log(tweetsJson["data"]);
		return tweetsJson;
	}catch(err){
		return { Error : "no tweet found"}
	}
}

// app.get("/:searchtext",async (req, res) => {
// 	const searchtext = req.params.searchtext;
// 	const data = await fetchTweets(searchtext);
// 	res.json(data);
// });
app.post("/",async (req, res) => {
	const tweetid = req.body.tweetid;
	const data = await fetchTweets(tweetid);
	res.json(data);
});
