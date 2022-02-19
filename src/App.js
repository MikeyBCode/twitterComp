import "./App.css";
import fetch from "cross-fetch";
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Spinner,
  Container,
  Row,
  Col,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import twitterlogo from "./twitter.svg";
import Banner from "./components/Banner";
import WinnersDisplay from "./components/WinnersDisplay";
import TweetPreview from "./components/TweetPreview";
function App() {
  const [retweets, setRetweets] = useState(null);
  const [currentTweet, setCurrentTweet] = useState(null);

  const [loadingPreviewTweet, setLoadingPreviewTweet] = useState(false);
  const [loadingRetweets, setLoadingRetweets] = useState(false);

  const [amountOfWinners, setAmountOfWinners] = useState(0);

  const checkUrlRef = useRef(null);
  const checkWinnersRef = useRef(null);

  useEffect(() => {
    setLoadingPreviewTweet(false);
  }, [currentTweet]);
  useEffect(() => {
    setLoadingRetweets(false);
  }, [retweets]);

  const fetchRetweets = async () => {
    if (currentTweet === null) return;
    const tweetid = currentTweet["id"];
    const url = `https://twittercompserver.vercel.app/`;

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tweetid: `${tweetid}` }),
    };

    setLoadingRetweets(true);
    try {
      const tweets = await fetch(url, config);
      const tweetsJson = await tweets.json();
      const filtered = removeOriginalTweeter(tweetsJson);
      setRetweets(filtered);
    } catch (err) {
      setLoadingRetweets(false);
    }
  };

  const fetchTweet = async (tweetid) => {
    const url = `https://twittercompserver.vercel.app/valid`;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tweetid: `${tweetid}` }),
    };
    try {
      const tweets = await fetch(url, config);
      const tweetsJson = await tweets.json();
      const result = tweetsJson["data"][0];
      if (result === undefined || result === null) return null;
      else return result;
    } catch (err) {
      return false;
    }
  };

  const setPreviewTweet = async (tweet) => {
    if (tweet === "" || tweet === undefined) {
      return;
    }
    setLoadingPreviewTweet(true);
    let url = tweet;
    url = url.replace(/\D/g, "");
    if (currentTweet !== null && tweet === currentTweet["id"]) {
      setLoadingPreviewTweet(false);
      return;
    }
    const checkedTweet = await fetchTweet(url);
    if (checkedTweet !== null) {
      setCurrentTweet(checkedTweet);
    }
  };

  const removeOriginalTweeter = (retweets) => {
    if (retweets === null) return null;

    const originalId = currentTweet["author_id"];

    const filteredArray = retweets.filter(
      (tweet) => tweet["id"] !== originalId
    );

    return filteredArray;
  };

  return (
    <Container
      fluid="md"
      className="bg-dark text-white text-center min-vh-100 "
    >
      <Banner />
      <Row>
        {/* TWEET PREVIEW */}
        <Col xl={6} className="bg-dark d-flex justify-content-center">
          {loadingPreviewTweet ? (
            <div className="m-auto">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : currentTweet !== null ? (
            <TweetPreview tweet={currentTweet["id"]} />
          ) : (
            <img alt="Logo" src={twitterlogo} style={{ width: 150 }}></img>
          )}
        </Col>

        {/* SETTINGS */}
        <Col xl={6} className="text-center bg-dark text-dark ">
          <Row className="text-center text-light justify-content-center">
            <Button
              bg="primary"
              onClick={() => {
                setCurrentTweet(null);
                setRetweets(null);
              }}
            >
              RESET
            </Button>
            <InputGroup className="p-0 m-3">
              <FormControl
                ref={checkUrlRef}
                placeholder="Twitter Link"
                aria-label="Twitter Link"
              />
              <Button
                bg="primary"
                onClick={() => setPreviewTweet(checkUrlRef.current.value)}
              >
                Set Tweet
              </Button>
            </InputGroup>
            <FormControl
              type="number"
              ref={checkWinnersRef}
              onChange={() =>
                setAmountOfWinners(parseInt(checkWinnersRef.current.value))
              }
              placeholder="0"
              aria-label="Winners"
            />
            {loadingRetweets ? (
              <div className="m-auto">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <Button
                variant="success"
                style={{
                  width: 250,
                  height: 100,
                  fontSize: 25,
                  margin: 25,
                }}
                type="submit"
                onClick={() => fetchRetweets()}
                disabled={amountOfWinners < 1}
              >
                COLLECT RETWEETERS{amountOfWinners > 1 ? "S" : ""}
              </Button>
            )}
          </Row>
          <Row className="bg-danger justify-content-center">
            current loaded tweet :
            {currentTweet == null ? "undefined" : currentTweet["author_id"]}
            {retweets && (
              <WinnersDisplay
                mainTweet={currentTweet}
                entrants={retweets}
                winners={amountOfWinners}
              />
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
