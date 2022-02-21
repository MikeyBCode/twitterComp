import React from "react";
import { Row, Col } from "react-bootstrap";
import format from "date-fns/format";

export const Entrant = ({ entry, retweetCount }) => {
  return (
    <Row
      key={entry.id}
      style={{ fontWeight: "bold" }}
      className={
        parseInt(retweetCount) < 3
          ? "bg-success border border-dark align-items-center "
          : "bg-danger border border-dark align-items-center "
      }
    >
      {console.log(retweetCount)}
      {/* <Col>{key}</Col> */}
      <Col>{entry.username}</Col>
      <Col>{retweetCount}</Col>
      (RETWEETED ON<br></br>
      {format(new Date(entry.created_at), "dd/MMMM")})
      <Col>
        <a href={"https://twitter.com/intent/user?user_id=" + entry.id}>
          {" "}
          LINK
        </a>
      </Col>
    </Row>
  );
};

export default Entrant;
