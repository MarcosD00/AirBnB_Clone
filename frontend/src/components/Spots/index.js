import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk } from "../../store/spots";
import { Link } from "react-router-dom";
import './spots.css'


export default function Spots() {
    const [hover, setHover] = useState(false);
    const sObj = useSelector((state) => state.spots.SpotsObject)
    const spots = Object.values(sObj)

    const onHover = () => {
        setHover(!hover);
      };

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getAllSpotsThunk())
    }, [dispatch])

    return (
    <div className="spot-card">
        {spots?.map(spot => {
            return (
            <Link to={`spots/${spot.id}`}>
                <div key={spot.id} className="spot-info">
                            <p className="tooltiptext">{spot.name}</p>
                    <div className="one-spot">
                            {spot.previewImage !== "No Preview Image Available"
                            ? <Link to={`spots/${spot.id}`}><img alt="No preview Available"
                            className="img" src={spot.previewImage} 
                            /></Link>
                                : <Link to={`spots/${spot.id}`}>No Preview Image Available</Link>}
                    </div>
                    <div className="one-info-spot">
                        <p>{spot.city}, {spot.state}</p>
                    <p>
                        {spot.avgRating === 0.0
                            ? (<i class="fa-solid fa-star">New</i>)
                            : (<i class="fa-solid fa-star">{Number.parseFloat(spot.avgRating).toFixed(1)}</i>)
                        }
                        </p>
                    </div>
                        <p className="price">
                            ${spot.price} night
                        </p>
                </div>
            </Link>
            )
        })}
    </div>
    );
};