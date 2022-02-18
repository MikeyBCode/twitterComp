import "./App.css";
import fetch from "cross-fetch";
import React, { useState, useEffect, useRef } from "react";
import {
  Card,
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
import Filters from "./components/Filters";
import Entrants from "./components/Entrants";
import TweetPreview from "./components/TweetPreview";
function App() {
  const [retweets, setRetweets] = useState();
  const [currentTweet, setCurrentTweet] = useState(null);

  const [loadingPreviewTweet, setLoadingPreviewTweet] = useState(false);
  const [loadingRetweets, setLoadingRetweets] = useState(false);

  const [amountOfWinners, setAmountOfWinners] = useState(0);

  const checkUrlRef = useRef(null);
  const checkWinnersRef = useRef(null);

  const compid = "1490746602964852744";

  const retweets200 = "903709298902970368";

  // const ellentweet2mil = "440322224407314432";

  useEffect(() => {
    setLoadingPreviewTweet(false);
  }, [currentTweet]);
  useEffect(() => {
    setLoadingRetweets(false);
  }, [retweets]);

  const fetchRetweets = async (tweetid) => {
    setCurrentTweet(tweetid);
    const url = `http://127.0.0.1:5500/`;

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": true,
      },
      body: JSON.stringify({ tweetid: `${tweetid}` }),
    };
    setLoadingRetweets(true);
    try {
      const tweets = await fetch(url, config);
      const tweetsJson = await tweets.json();
      setRetweets(tweetsJson);
    } catch (err) {
      setLoadingRetweets(false);
    }
  };

  const removeOriginalTweeter = (tweets) => {
    if (tweets == null) {
      console.log("no tweets found");
    }
  };

  const loadTweet = async (tweetid) => {
    const url = `http://127.0.0.1:5500/valid`;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": true,
      },
      body: JSON.stringify({ tweetid: `${tweetid}` }),
    };
    try {
      const tweets = await fetch(url, config);
      const tweetsJson = await tweets.json();

      const result = tweetsJson["data"][0]["id"];

      if (result === undefined) return null;
      else return result;
    } catch (err) {
      console.log("no tweet");
      return false;
    }
  };

  const setPreviewTweet = async (tweet) => {
    if (!tweet) {
      setCurrentTweet(null);
      return;
    }
    setLoadingPreviewTweet(true);
    let url = tweet;
    url = url.replace(/\D/g, "");
    const checkedTweet = await loadTweet(url);
    if (checkedTweet !== null) setCurrentTweet(checkedTweet);
  };

  const randomNumber = (max) => {
    return Math.floor(Math.random() * max);
  };
  return (
    <Container
      fluid="md"
      className="bg-dark text-white text-center min-vh-100 min-vw-100"
    >
      <Banner />
      <Row>
        {/* TWEET PREVIEW */}
        <Col xl={6} className="bg-primary d-flex justify-content-center">
          {loadingPreviewTweet ? (
            <div className="m-auto">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : currentTweet !== null ? (
            <TweetPreview tweet={currentTweet} />
          ) : (
            <img src={twitterlogo} style={{ width: 150 }}></img>
          )}
        </Col>

        {/* SETTINGS */}
        <Col xl={6} className="text-center bg-warning text-dark ">
          <Row className="text-center text-dark justify-content-center px-5">
            haz{compid}
            <br></br>
            retweet{retweets200}
            <Button
              bg="primary"
              onClick={() => {
                setPreviewTweet();
                setRetweets([]);
              }}
            >
              Remove Tweet
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
              onChange={() => setAmountOfWinners(checkWinnersRef.current.value)}
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
                variant="danger"
                style={{
                  width: 250,
                  height: 100,
                  fontSize: 25,
                  margin: 25,
                }}
                type="submit"
                onClick={() => fetchRetweets(currentTweet)}
                disabled={amountOfWinners < 1}
              >
                SELECT WINNER{amountOfWinners > 1 ? "S" : ""}
              </Button>
            )}
          </Row>
          <Row
            className="bg-danger justify-content-center"
            style={{ height: 300 }}
          >
            row
          </Row>
          {/* {retweets ? <Entrants entrants={retweets} /> : ""} */}
          {/* current loaded tweet : {currentTweet} */}
        </Col>
      </Row>
    </Container>
  );
}
// https://twitter.com/Lethal_HT/status/1490746602964852744
export default App;
