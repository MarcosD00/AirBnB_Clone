import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'reviews/GET_REVIEWS'
const ADD_REVIEW = 'reviews/ADD_REVIEW'
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'


const getReviewsAction = (reviews) => ({
    type: GET_REVIEWS,
    reviews
})

const addReviewAction = (review) => {
    return {
        type: ADD_REVIEW,
        review
    }
}

const deleteReviewAction = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})

//Thunk that GETs the reviews of each spot
export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    if (response.ok) {
        const data = await response.json()
        dispatch(getReviewsAction(data))
    }
}

//Thunk that ADDs a review to a spot
export const createNewReviewThunk = (review, user, spotId) => async (dispatch) => {

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
    })

    if (response.ok) {
        const createdReview = await response.json()
        createdReview.User = user;
        await dispatch(addReviewAction(createdReview))
        return createdReview;
    }
}

//Thunk that DELETEs a review
export const deleteReviewThunk = (reviewId) => async dispatch => {

    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
        dispatch(deleteReviewAction(reviewId));
        return response
    }
}


const initialState = [];


const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_REVIEWS: {
            const reviews = action.reviews.Reviews
            const newState = [ ...reviews ];
            console.log(reviews)
            return newState
        }
    
        case ADD_REVIEW: {
            const newState = [...state]

            newState.push(action.review)
            console.log(newState)
            return newState
        }

        case DELETE_REVIEW:

            const newState = [ ...state ].filter(review => review.id !== action.reviewId)
            // delete newState.spotObject[action.reviewId]
            return newState;
        default:
            return state;
    }
}

export default reviewReducer