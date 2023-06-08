import React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots, getUserSpots } from "../../store/spots";
import { Link, useHistory } from "react-router-dom";
import './ManageSpots.css';
import DeleteSpotModal from "../DeleteSpotModal";
import OpenModalDelete from "./OpenModalDelete";
import LoaderIcon from "../LoaderIcon";
function ManageSpots() {
    const spotsObj = useSelector(state => state.spots.userSpots)
    const spots = Object.values(spotsObj)
    const user = useSelector(state => state.session.user)

    const obj = useSelector(state => state.spots.allSpots)
    // console.log("what is this", obj)
    const allSpots = Object.values(obj)
    // console.log("should be spots", allSpots)

    // console.log("spots => ", spots)
    // console.log("user =>", user)
    const currUserId = user.id;
    // console.log(currUserId)

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllSpots());
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

    // const goToEditSpot = () => {
    //     let path = `/spots/${spots.id}`
    //     history.push(path)
    // }
    // debugger
    if (!spots) return <LoaderIcon/>;
    return (
        <div className="manage-spots-page">
            <div className="header">
                <h1>Manage your spots</h1>
                <button onClick={goToCreateSpot}>Create a new spot</button>
                <br></br>
            </div>
            <div className="manage-place">
                <div className="user-spots">
                    {allSpots?.map(spot => {
                        if (spot.ownerId === currUserId)
                            return (
                        <div key={spot.id} className="spot-place">
                            <div className="spot-image-container">
                                <span className="toolTipText">{spot.name}</span>
                                {spot.previewImage !== "No Preview Image Available"
                                    ? <Link to={`${spot.id}`}><img alt="No preview Available"
                                        className="img"
                                        src={spot.previewImage}

                                    /></Link>
                                    : <Link to={`${spot.id}`}>No Preview Image Available</Link>}
                            </div>
                            <div>
                                <div>
                                    <div>
                                        <p>{spot.city}, {spot.state}</p>
                                        <div>
                                            {spot.avgRating === 0.0
                                                ? (<i className="fa-solid fa-star">New</i>)
                                                : (<i className="fa-solid fa-star">{Number.parseFloat(spot.avgRating).toFixed(1)}</i>)
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="price">
                                    ${spot.price} night
                                </div>
                                <div className="update-delete-container">
                                    <div className="update">
                                        <Link to={`/spots/${spot.id}/edit`}>
                                            <button id="update-button">Update</button>
                                        </Link>
                                    </div>
                                    <div className="delete-spot">
                                        <button className="delete-button">
                                            <OpenModalDelete
                                                itemText="Delete"
                                                modalComponent={<DeleteSpotModal spotId={spot.id}
                                                />}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}