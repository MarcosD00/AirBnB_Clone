import { csrfFetch } from './csrf';

const LOAD_SPOT = "spots/LOAD_SPOT";
const LOAD_SINGLE_SPOT = "spots/LOAD_SINGLE_SPOT"
// const ADD_SPOT = "spots/ADD_SPOT"

export const loadSpots = (spots) => ({
  type: LOAD_SPOT,
  spots
});

export const loadSingleSpot = (spot) => ({
    type: LOAD_SINGLE_SPOT,
    spot
})


//Thunk that gets all the users of spots
export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const spotData = await response.json();
    await dispatch(loadSpots(spotData));
    return spotData;
  };
};

//thunk that get detailed information about one spot
export const getSingleSpotThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`);

    if (response.ok) {
      const spotData = await response.json();
      await dispatch(loadSingleSpot(spotData));
      return spotData;
    };
  };

//stores
const initialState = {
  SpotsObject: {},
  singleSpotObject: {},
};

const spotsReducer = (state = initialState, action) => {

  switch (action.type) {
    case LOAD_SPOT: {

      const newState = {
        ...state,
        SpotsObject: { ...state.SpotsObject },
      };

      action.spots.Spots.map(spot => {
        newState.SpotsObject[spot.id] = spot
      });
      return newState;
    }
    case LOAD_SINGLE_SPOT: {
        const newState = { ...state };
        newState.singleSpotObject = { ...action.spot };
        return newState;
      }
    default:
      return state;
  };
};

export default spotsReducer;