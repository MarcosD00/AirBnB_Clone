import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotReviewsThunk } from "../../store/reviews";
import { getSingleSpotThunk } from "../../store/spots";
import { useParams } from 'react-router-dom'
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import ReviewDeleteModal from "../ReviewDeleteModal"
import ReviewAddModal from "../ReviewAddModal"
import "./SpotDetail.css"

export default function SpotDetail () {
    const { spotId } = useParams();
    const spotDetails = useSelector((state) => state.spots.singleSpotObject)

    const reviews = useSelector(state => (state.reviews))
    
    

    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
    }

    const spotReviews = reviews.filter(review => review.spotId === Number(spotId))
    

    const owner = (spotDetails.Owner)
    console.log(owner)
    const sessionUser = useSelector(state => state.session.user)

    let createBtnRef = null


    let createReviewButton = "create-button" + (sessionUser && sessionUser?.id !== owner?.id ? "" : " hidden")
    const currReviewsForSpot = []

    
    const reserveClick = (e) => {
        e.preventDefault();
        alert('Feature Coming Soon...');
    };
    
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSingleSpotThunk(spotId))
        dispatch(getSpotReviewsThunk(spotId))
    }, [dispatch, spotId])
    
    return (
        <>
            <div className="spot-details-page">
                <p className="title-name">{spotDetails.name}</p>
                <p>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</p>

                <div className="various-images">
                {spotDetails.SpotImages?.map((image, idx) =>
                    idx === 0 ?
                        <div className="img-1"><img key={image.id}
                            src={image.url}
                        /></div>
                        :
                        <img key={image.id}
                            className="other-images"
                            src={image.url === "" ? `no image` : image.url}
                            alt="no image yet"
                        />
                    )
                    }
                </div>
                <div>
                    <div>
                        <p>{spotDetails.description}</p>
                    </div>
                    {/* <div className="owner-description-container">
                        <h3 className="name-description">Hosted by {owner.firstName} {owner.lastName}</h3>
                        <div className="description">{spotDetails.description}</div>
                    </div> */}
                    <div>
                            <div>${spotDetails.price} night</div>
                            <div>
                                {
                                    spotDetails.avgRating === 0.0
                                        ? <i className="fa-solid fa-star">NEW</i>
                                        : <i className="fa-solid fa-star">{Number.parseFloat(spotDetails.avgRating).toFixed(1)}</i>
                                }
                                <div>
                                    {spotDetails.numReviews > 0
                                        ? Number(spotDetails.numReviews) === 1 ? `${spotDetails.numReviews} review`
                                            : `${spotDetails.numReviews} reviews`
                                        : null}
                                </div>
                            </div>
                        </div>
                        <button className="reserve-click" onClick={reserveClick}> Reserve
                        </button>
                </div>
            </div>
                  <div>
                     <button ref= { ref => createBtnRef = ref } className={createReviewButton}>
                        <OpenModalMenuItem
                            itemText={"Post Your Review"}
                            modalComponent={<ReviewAddModal spotId={spotId} />}
                        />
                    </button>
                    <div>
                    {spotReviews?.length > 0 ? spotReviews.map((review, i) => {
                        const date = new Date(review.createdAt)
                        const month = months[date.getMonth()];
                        const day = date.getDate();
                        const year = date.getFullYear();
                        return (
                            
                            <div key={`${review.id} ${i}`}>
                                <p>{review.review}</p>
                                    <div>
                                        <p>{review.User.firstName}</p>
                                        <p className="review-month-year">{month} {day}, {year}</p>
                                        <div>
                                            {review.User.id === sessionUser?.id
                                                ? <button>
                                                    <OpenModalMenuItem
                                                        itemText={"Delete Your Review"}
                                                        modalComponent={<ReviewDeleteModal reviewId={review.id} spotId={spotId} />}
                                                    />
                                                </button>
                                                : <></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                    }): null}
                </div>
            </div>
        </>
    )
}
