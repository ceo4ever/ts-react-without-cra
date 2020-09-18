import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import GlobalStyle from "./GlobalStyles";

function App() {
  console.log(process.env);
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Header />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/one" component={Home} />
          <Route path="/two" component={Home} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
