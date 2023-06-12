import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Spots from "./components/Spots"
import SpotDetail from "./components/SpotDetail"
import AddSpot from "./components/CreateSpot"
import ManageSpots from "./components/ManageSpots"
import UpdateSpot from "./components/SpotUpdate"

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
          <Route exact path="/spots/new">
            <AddSpot />
          </Route>
          <Route exact path="/spots/current">
            <ManageSpots />
          </Route>
          <Route exact path="/spots/:spotId">
            <SpotDetail />
          </Route>
          <Route  exact path="/spots/:spotId/edit">
            <UpdateSpot />
          </Route>
        </Switch>}
    </>
  );
}

export default App;