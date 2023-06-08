import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSingleSpotThunk } from "../../store/spots";
import { useParams } from 'react-router-dom';
import "./SpotDetail.css"

export default function SpotDetail () {
    const { spotId } = useParams();
    const spotDetails = useSelector((state) => state.spots.singleSpotObject)

    const reserveClick = (e) => {
        e.preventDefault();
        alert('Feature Coming Soon...');
    };
    
    const dispatch = useDispatch()
    
    useEffect(() => {
        dispatch(getSingleSpotThunk(spotId))
    }, [dispatch, spotId])

    return (
        <>
            <div>
                <h1>{spotDetails.name}</h1>
                <p>{spotDetails.city}, {spotDetails.state}, {spotDetails.country}</p>
                <div>
                {spotDetails.SpotImages?.map((image, idx) =>
                    idx === 0 ?
                        <img key={image.id}
                            className="preview-image1"
                            src={image.url}
                        />
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
                    <div>
                            <div>${spotDetails.price} night</div>
                            <div>
                                {
                                    spotDetails.avgRating === null
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
                    <button>
                        post
                    </button>
            </div>
        </>
    )
}
