import React from 'react';
import { NavLink, Link, useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getSpotReviewsThunk, createNewReviewThunk } from '../../store/reviews'
import { useModal } from '../../context/Modal';
import { getSingleSpotThunk } from '../../store/spots';

function ReviewAddModal({ spotId }) {
  const dispatch = useDispatch();

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [activeStars, setActiveStars] = useState(0)
  const [errors, setErrors] = useState([]);
  const sessionUser = useSelector(state => state.session.user)
  const { closeModal } = useModal();

  const updateReview = (e) => setReview(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = [];
    if (review.length < 10) validationErrors.push('Review must be at least 10 characters');
    if (!stars) validationErrors.push('You must at least put one star')
    if (validationErrors.length) {
      return setErrors(validationErrors)
    }

    const createdReviewDetails = {
      review, stars
    }
    await dispatch(createNewReviewThunk(createdReviewDetails, sessionUser, spotId))
    await dispatch(getSingleSpotThunk(spotId))
    await dispatch(getSpotReviewsThunk(spotId))
    closeModal();
  }

  // use like petRating
  const onChange = (number) => {
    setStars(parseInt(number));
  };

  const starsIcon = (number) => {
    const props = {};
    props.onMouseEnter = () => setActiveStars(number);
    props.onMouseLeave = () => setActiveStars(stars);
    props.onClick = () => onChange(number);
    return (
        <div key={number} className={activeStars >= number ? "filled" : "empty"} {...props}>
            <i className="fa fa-star"></i>
        </div>
    );
};


  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h1>How was your stay?</h1>
        <ul>
          {errors?.map((error, idx) => (<li key={idx}>{error}</li>))}
        </ul>
        <label>
          <input
            type='textarea' placeholder='Leave your review here...' min='10'
            required value={review} onChange={updateReview} className='review-text'
          >
          </input>
        </label>
        <div>
          <div>Stars</div>
          <div>
          {[1, 2, 3, 4, 5].map(number => starsIcon(number))}
          </div>
        </div>
        <button
          disabled={review.length < 10 || !stars}
          type="submit">Submit Your Review!</button>
      </form>
    </section>
  )
}


export default ReviewAddModal