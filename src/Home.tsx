import React from "react";
import { useLocation } from "react-router-dom";

function Home() {
  const { pathname } = useLocation();
  return (
    <div>
      <p>{pathname}</p>
    </div>
  );
}

export default Home;
