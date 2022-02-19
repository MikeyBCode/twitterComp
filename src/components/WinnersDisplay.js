import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import Entrant from "./Entrant";

export const WinnersDisplay = ({ entrants, mainTweet, winners }) => {
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

  const isPossibleBot = async (previousTweets) => {
    let retweets = 0;
    const maxRetweets = 2;

    previousTweets.forEach((tweet) => {
      if (tweet.text.toLowerCase().search("giveaway") !== -1) retweets += 1;
    });

    if (retweets > maxRetweets) return true;
    else return false;
  };

  const verifyUserId = async (userid) => {
    try {
      const last10 = await getLast10Tweets(userid);
      const isBot = await isPossibleBot(last10);
      return isBot;
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
          isValid={entrant["isBot"] == null}
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
    const isPossibleBot = await verifyUserId(selectedWinner[0].id);

    if (isPossibleBot) selectedWinner["isBot"] = true;

    const winners = [...selectedWinners];

    winners.push(selectedWinner);

    setSelectedWinners(winners);
  };

  return (
    <>
      {loadingWinner ? (
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
