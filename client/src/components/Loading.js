import React from "react";
//bootstrap
import Spinner from "react-bootstrap/Spinner";

export default function Loading() {
  return (
    <div className="container w-100 h-100">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
