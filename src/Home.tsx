import React from "react";
import { useLocation } from "react-router-dom";
import ReactIcon from "./assets/React.png";
import WebpackIcon from "./assets/webpack.jpg";

function Home() {
  const { pathname } = useLocation();
  return (
    <div>
      <p>{pathname}</p>
      <img src={ReactIcon} />
      <img src={WebpackIcon} />
    </div>
  );
}

export default Home;
