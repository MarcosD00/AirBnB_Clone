import { useDispatch} from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteSpotThunk } from "../../store/spots";
import "./SpotDeleteModal.css"

function SpotDeleteModal({ spotId }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const history = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(deleteSpotThunk(spotId))
        history.push(`/spots/current`)
        closeModal()
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p className="confirm-spot-delete">Confirm Delete</p>
                <p className="warning">Are you sure you want to remove this spot from the listings?</p>
                <div className="spot-btns">
                    <button type="submit" className="submit">Yes (Delete Spot) </button>
                    <button onClick={closeModal} className="keep">No (Keep Spot)</button>
                </div>
            </form>
        </div>
    );
}


export default SpotDeleteModal