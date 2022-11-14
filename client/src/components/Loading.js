import React from "react";
//bootstrap
import Spinner from "react-bootstrap/Spinner";

export default function Loading() {
  return (
      <Spinner animation="border" role="status" className="text-center d-block m-auto p-auto">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
  );
}
