import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ChatBox from "./Components/ChatBox";
import RenderChatRoom from "./Components/RenderChatRoom";
import Home from "./Components/Home/Home";
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/chat_room">
            <RenderChatRoom />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
