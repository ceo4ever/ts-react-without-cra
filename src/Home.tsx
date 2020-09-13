import React from "react";
import { useLocation } from "react-router-dom";
import ReactIcon from "./assets/React.png";
import WebpackIcon from "./assets/webpack.jpg";
import tenKB from "./assets/tenKB.png";

function Home() {
  console.log(process.env.NODE_ENV);
  const { pathname } = useLocation();
  console.log(ReactIcon);
  console.log(tenKB);
  return (
    <div>
      <p>{pathname}</p>
      <img src={ReactIcon} />
      <img src={WebpackIcon} />
      <img src={tenKB} />
    </div>
  );
}

export default Home;
