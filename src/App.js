import logo from './logo.svg';
import './App.css';
import fetch from 'cross-fetch';
import React,{useEffect} from 'react'
function App() {

  

  const tweetid = "1490746602964852744";

  const fetchTweets = async(tweetid) => {

  const url = `http://127.0.0.1:5500/`;


    const config = {method : "POST", headers:{ 'Content-Type': 'application/json',"Access-Control-Allow-Origin" : true}, body: JSON.stringify({ "tweetid" : `${tweetid}`}) };

    try{
      const tweets = await fetch(url,config);
      const tweetJson = await tweets.json();
      return await tweets;
    }catch(err){
      console.log(err.data);
      return { Error : "no tweet found"}
    }
  }
   

   useEffect(() => {
    fetchTweets(tweetid);
  },[]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>    tweets:
        {/* {result} */}
        </p>
      </header>
    </div>
  );
}

export default App;
