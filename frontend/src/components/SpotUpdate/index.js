import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState, } from 'react';

import { updateSpot } from '../../store/spots';

export default function UpdateSpot() {

    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const spot = useSelector((state) => state.spots.SpotsObject[spotId] || {})
    // console.log('spots =>', spot)
    const thisState = useSelector(state => state)
    // console.log("this is og state", thisState)
    const [country, setCountry] = useState(spot.country)
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [name, setName] = useState(spot.name);
    const [description, setDescription] = useState(spot.description);
    const [price, setPrice] = useState(spot.price);
    const [id] = useState(spot.id)

    const [errors, setErrors] = useState([]);

    const updateAddress = (e) => setAddress(e.target.value);
    const updateCountry = (e) => setCountry(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(parseInt(e.target.value));

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = [];
        if (!country.length){
             validationErrors.push('Country is required')
            }
        if (!address.length) {
            validationErrors.push('Address is required')
        }
        if (!city.length) {
            validationErrors.push('City is required')
        }
        if (!state.length) {
            validationErrors.push('State is required')
        }
        if (!description.length) {
            validationErrors.push('Description is required')
        }
        if (description.length < 30) {
            validationErrors.push('Description needs at least 30 characters')
        }
        if (!name.length) {
            validationErrors.push('Title is required')
        }
        if (typeof price !== 'number') {
            validationErrors.push('Price must be a number')
        }
        if (!price) {
            validationErrors.push('Price is required')
        }
        if (validationErrors.length) {
            return setErrors(validationErrors)
        }


        if (validationErrors.length) return setErrors(validationErrors)

        const updatedSpotDetails = {
            country, address, city, state, description, price, name, id, lat: 1, lng: 1
        }

        const newSpot = await dispatch(updateSpot(updatedSpotDetails))

        history.push(`/spots/${spotId}`)
    }

    return (
        <section className='edit-form-spots'>
            <form className="edit-form" onSubmit={handleSubmit}>
                <p>Update your Spot</p>
                <p>Where's your place located?</p>
                <p>Guests will only get your exact address once they booked a reservation</p>
                <ul>
                    {errors?.map((error, idx) => (<li key={idx}>{error}</li>))}
                </ul>
                <label>
                    Country
                    <input
                        type='text' placeholder='country' min='1'
                        required value={country} onChange={updateCountry}
                    />
                </label>
                <label>
                    Street Address
                    <input
                        type='text' placeholder='address' min='1'
                        required value={address} onChange={updateAddress}
                    ></input>
                </label>
                <label>
                    City
                    <input
                        type='text' placeholder='city' min='1'
                        required value={city} onChange={updateCity}
                    />
                    <label>
                    </label>
                </label>
                <label>
                    State
                    <input
                        type='text' placeholder='state' min='1'
                        required value={state} onChange={updateState}
                    />
                </label>
                <hr></hr>
                <label>
                    <p>Describe your place to guests</p>
                    <div>Mention the best features of your space, any special amenities like fast wifi or parking,
                        and what you love about the neighborhood.</div>
                    <textarea
                        type='textarea' placeholder='Please write at least 30 characters' min='30'
                        required value={description} onChange={updateDescription} className='description-box'
                    />
                </label>
                <hr></hr>
                <label>
                    <p>Create a title for your spot</p>
                    <div>
                        Catch guests' attention with a spot tile that
                        highlights your place special.
                    </div>
                    <input
                        type='text' placeholder='name' min='1'
                        required value={name} onChange={updateName}
                    />
                </label>
                <hr></hr>
                <label>
                    <p>Set a base price for your spot</p>
                    <div>Competitive pricing can help your listing stand out and rank
                        higher in search results.</div>
                    <div className='money-input'>
                        $
                        <input
                            type='number' placeholder='price' min='1'
                            required value={price} onChange={updatePrice}
                        />
                    </div>
                </label>
                <hr></hr>
            </form>
                <button 
                 disabled={
                    country.length < 1 || address.length < 1 || city.length < 1 ||
                    state.length < 1 || description.length < 30 || name.length < 0 ||
                    price.length < 1
                }
                onClick={handleSubmit} type="submit">Update spot!</button>
        </section>
    )
}