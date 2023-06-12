import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk, getSpotReviewsThunk } from "../../store/reviews";
import {getSingleSpotThunk} from "../../store/spots"
import "./ReviewDelete.css"


function ReviewDeleteModal({reviewId}) {
    const dispatch = useDispatch()
    const {closeModal} = useModal();
    const history = useHistory();
    const spot = useSelector(state => state.spots.singleSpotObject)
    
    const handleSubmit = (e) => {
        e.preventDefault();
        closeModal()
        
        dispatch(deleteReviewThunk(reviewId))
        dispatch(getSingleSpotThunk(spot.id))
        dispatch(getSpotReviewsThunk(spot.id))
    }
    return (
        <div className="delete-modal">
            <form onSubmit={handleSubmit}>
                <p className="confirm-delete">Confirm Delete</p>
                <p className="warning">Are you sure you want to remove this review?</p>
                <div className="two-btns">
                    <button className="submit" type="submit">Yes (Delete Review) </button>
                    <button className="keep"onClick={closeModal}>No (Keep Review)</button>
                </div>
            </form>
        </div>
    );
}

export default ReviewDeleteModal