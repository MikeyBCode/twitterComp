import './App.css';
import fetch from 'cross-fetch';
import React,{useState} from 'react'
import {Card,Button} from "react-bootstrap";
import {TwitterTweetEmbed} from "react-twitter-embed";
import format from 'date-fns/format';

function App() {

  const [tweets,setTweets] = useState(null);

  //const compid = "1490746602964852744";

  const retweets200 = "903709298902970368";

  //const ellentweet2mil = "440322224407314432";

  const fetchTweets = async(tweetid) => {

  const url = `http://127.0.0.1:5500/`;

  const config = {method : "POST", headers:{ 'Content-Type': 'application/json',"Access-Control-Allow-Origin" : true}, body: JSON.stringify({ "tweetid" : `${tweetid}`}) };

    try{
      const tweets = await fetch(url,config);
      const tweetsJson = await tweets.json();

      console.log(tweetsJson);
      console.log(tweetsJson.length);
      setTweets(tweetsJson);
      // return tweetsJson;
    }catch(err){
      console.log(err.data);
      // return { Error : "no tweet found"}
    }
  }

  const displayTweets = () => {


    if(tweets !== null && tweets !== undefined){
      
      return tweets.map(tweet =>
      <Card key={tweet.id}style={{ width: '18rem'}} bg="success">
        <Card.Body>
        <Card.Title>{tweet.username}</Card.Title>
        <Card.Text>
            {tweet.id}
            {tweet.created_at}
        </Card.Text>
        </Card.Body>
      </Card>);
    }else{
      return <h1>no tweets</h1>
    }
  }

  return (
    <div className="App">
      <header className="container">
        <div className="AppBody">
          <div style={{width:"50%"}}>
          <TwitterTweetEmbed style={{width: "auto"}} tweetId={retweets200}/>
          </div>
          <div>
          <Button variant="success" type="submit" onClick={() => fetchTweets(retweets200)}>LOAD RETWEETS</Button>
          {displayTweets()}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
