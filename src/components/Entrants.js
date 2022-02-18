import React from "react";
import { Card } from "react-bootstrap";
import format from "date-fns/format";

const displayTweets = (entrants) => {
  if (entrants !== null && entrants !== undefined) {
    return entrants.map((entrant) => (
      <div key={entrant.id} bg="success" className="entrant">
        <div>{entrant.username}</div>
        <div>
          retweeted on :{format(new Date(entrant.created_at), "dd/MM/yyyy")}
        </div>
      </div>
    ));
  } else {
    return;
  }
};

export const Entrant = ({ entrants }) => {
  return <>{displayTweets(entrants)}</>;
};

export default Entrant;
