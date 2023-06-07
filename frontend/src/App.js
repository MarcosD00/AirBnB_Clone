import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && 
        <Switch>
          <Route exact path="/">
            <Spots />
          </Route>
          <Route path="/spots/:spotId">
            <></>
          </Route>
          <Route  exact path="/spots/:spotId/edit">
            <></>
          </Route>
          <Route path="/spots/new">
            <></>
          </Route>
          <Route path="/spots/current">
            <></>
          </Route>
        </Switch>}
    </>
  );
}

export default App;