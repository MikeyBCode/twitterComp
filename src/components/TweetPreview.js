import React, { useEffect, useState } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

export const TweetPreview = ({ tweet }) => {
  console.log("render");
  return <TwitterTweetEmbed key={tweet} tweetId={tweet} />;
};

export default TweetPreview;
