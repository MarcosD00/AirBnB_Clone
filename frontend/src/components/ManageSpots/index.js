import React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpotsThunk, getUserSpots } from "../../store/spots";
import { Link, useHistory } from "react-router-dom";
import SpotDeleteModal from "../SpotDeleteModal";
import DeleteModal from "./DeleteModal";
import "./ManageSpots.css"


function ManageSpots() {
    const spotsObj = useSelector(state => state.spots.SpotsObject)
    const spots = Object.values(spotsObj)
    const user = useSelector(state => state.session.user)
    
    const obj = useSelector(state => state.spots.SpotsObject)

    const allSpots = Object.values(obj)

    const currUserId = user.id;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch])
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory();


    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const goToCreateSpot = () => {
        let path = `/spots/new`
        history.push(path);
    }

    return (
        <div className="manage-spot-page">
            <p className="magane-tilte">Manage your spots</p>
            <button onClick={goToCreateSpot}>Create a new spot</button>
            <br></br>
            <div className="spot-card">
                {allSpots?.map(spot => {
                    if (spot.ownerId === currUserId)
                        return (
                        <div key={spot.id}>
                            <div className="one-spot">
                                <p>{spot.name}</p>
                                {spot.previewImage !== "No Preview Image Available"
                                    ? <Link to={`${spot.id}`}><img alt="No preview Available"
                                        className="img"
                                        src={spot.previewImage}

                                    /></Link>
                                    : <Link to={`${spot.id}`}>No Preview Image Available</Link>}
                            </div>
                            <div>
                                <div className="spot-place-stars">
                                <p>{spot.city}, {spot.state}</p>
                                    {spot.avgRating === 0.0
                                        ? (<i class="fa-solid fa-star">New</i>)
                                        : (<i class="fa-solid fa-star">{Number.parseFloat(spot.avgRating).toFixed(1)}</i>)
                                    }
                                </div>
                                <div>
                                    ${spot.price} night
                                </div>
                                <div className="update-delete-buttons">
                                    <div>
                                        <Link to={`/spots/${spot.id}/edit`}>
                                            <button id="update-button">Update</button>
                                        </Link>
                                    </div>
                                    <button>
                                        <DeleteModal
                                            itemText="Delete"
                                            modalComponent={<SpotDeleteModal spotId={spot.id}
                                            />}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                        )
                    })}
            </div>
        </div>
    )
}

export default ManageSpots;