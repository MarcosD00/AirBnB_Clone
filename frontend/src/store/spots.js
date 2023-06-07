import { csrfFetch } from './csrf';

const LOAD_SPOT = "spots/LOAD_SPOT";

export const loadSpots = (spots) => ({
  type: LOAD_SPOT,
  spots
});

//Thunk that gets all the users of spots
export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  if (response.ok) {
    const spotData = await response.json();
    await dispatch(loadSpots(spotData));
    return spotData;
  };
};

//stores
const initialState = {
  SpotsObject: {},
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
    default:
      return state;
  };
};

export default spotsReducer;