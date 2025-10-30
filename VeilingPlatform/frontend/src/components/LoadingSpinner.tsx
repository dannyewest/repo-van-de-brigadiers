// src/components/LoadingSpinner.tsx
import React from "react";
import { Spinner } from "react-bootstrap";

type Props = {
  text?: string;
};

export default function LoadingSpinner({ text = "Loading..." }: Props) {
  const containerClass = "d-flex flex-column justify-content-center align-items-center my-5";

  return (
    <div className={containerClass}>
      <Spinner animation="border" role="status" variant="primary" />
      <span className="mt-3 text-muted">{text}</span>
    </div>
  );
}
