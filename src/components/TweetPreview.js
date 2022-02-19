import { TwitterTweetEmbed } from "react-twitter-embed";

export const TweetPreview = ({ tweet }) => {
  return <TwitterTweetEmbed key={tweet} tweetId={tweet} />;
};

export default TweetPreview;
