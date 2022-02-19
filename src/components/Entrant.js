import React from "react";
import { Row, Col } from "react-bootstrap";
import format from "date-fns/format";

export const Entrant = ({ entry, isValid = true }) => {
  return (
    <Row
      key={entry.id}
      style={{ fontWeight: "bold" }}
      className={
        isValid
          ? "bg-success border border-dark align-items-center "
          : "bg-danger border border-dark align-items-center "
      }
    >
      {/* <Col>{key}</Col> */}
      <Col>{entry.username}</Col>
      <Col>{!isValid ? "POSSIBLE BOT" : ""}</Col>
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
