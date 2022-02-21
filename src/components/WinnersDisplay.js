import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Entrant from "./Entrant";

export const WinnersDisplay = ({ entrants, mainTweet }) => {
  const [entries, setEntries] = useState(entrants);

  const [selectedWinners, setSelectedWinners] = useState([]);

  const [loadingWinner, setLoadingWinner] = useState();

  useEffect(() => {
    setLoadingWinner(false);
  }, [selectedWinners]);

  const getLast10Tweets = async (userid) => {
    const url = `https://twittercompserver.vercel.app/verify`;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userid: `${userid}` }),
    };
    try {
      const tweets = await fetch(url, config);
      const tweetsJson = await tweets.json();
      const result = tweetsJson["data"];
      return result;
    } catch (err) {
      return null;
    }
  };

  const getRecentRetweetCount = async (previousTweets) => {
    let retweets = 0;

    previousTweets.forEach((tweet) => {
      if (tweet.text.toLowerCase().search("giveaway") !== -1) retweets += 1;
      console.log(tweet.text.toLowerCase());
      console.log(tweet.id);
      console.log(tweet.text.toLowerCase().search("giveaway"));
    });

    return retweets;
  };

  const verifyUserId = async (userid) => {
    try {
      const last10 = await getLast10Tweets(userid);
      const retweetCount = await getRecentRetweetCount(last10);
      console.log(retweetCount);
      return retweetCount;
    } catch (err) {
      return false;
    }
  };

  const randomNum = (arrLength) => {
    return Math.floor(Math.random() * arrLength);
  };

  const displayEntrants = (entrants, mainTweet) => {
    if (entrants !== null && entrants !== undefined) {
      return entrants.map((entrant) => (
        <Entrant
          key={entrant[0].id}
          entry={entrant[0]}
          retweetCount={entrant["retweetCount"]}
        />
      ));
    } else {
      return <>NO RESULTS</>;
    }
  };

  const selectWinner = async () => {
    //get random tweet
    setLoadingWinner(true);
    const arr = [...entries];
    const selectedWinner = arr.splice(randomNum(entries.length), 1);

    setEntries(arr);
    console.log(selectedWinner === undefined);
    const retweetCount = await verifyUserId(selectedWinner[0].id);

    selectedWinner["retweetCount"] = retweetCount;

    const winners = [...selectedWinners];

    winners.push(selectedWinner);

    setSelectedWinners(winners);
  };

  return (
    <>
      {loadingWinner && entries.length > 0 ? (
        <div className="m-auto">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Button onClick={() => selectWinner()}>SELECT WINNER</Button>
      )}
      {displayEntrants(selectedWinners, mainTweet)}
    </>
  );
};

export default WinnersDisplay;
