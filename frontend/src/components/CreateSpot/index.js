import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useState, } from 'react';
import { addSpotThunk } from '../../store/spots';
import './createSpot.css'

export default function AddSpot() {

    const dispatch = useDispatch();
    const history = useHistory();

    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imgURL, setImgUrl] = useState("");
    const [imgTwo, setImgTwo] = useState("");
    const [imgThree, setImgThree] = useState("");
    const [imgFour, setImgFour] = useState("");
    const [imgFive, setImgFive] = useState("");
    const [errors, setErrors] = useState([]);

    const updateCountry = (e) => setCountry(e.target.value);
    const updateAddress = (e) => setAddress(e.target.value);
    const updateCity = (e) => setCity(e.target.value);
    const updateState = (e) => setState(e.target.value);
    const updateName = (e) => setName(e.target.value);
    const updateDescription = (e) => setDescription(e.target.value);
    const updatePrice = (e) => setPrice(parseInt(e.target.value));
    const updateImageURL = (e) => setImgUrl(e.target.value);
    const updateImageTwo = (e) => setImgTwo(e.target.value);
    const updateImageThree = (e) => setImgThree(e.target.value);
    const updateImageFour = (e) => setImgFour(e.target.value);
    const updateImageFive = (e) => setImgFive(e.target.value);


    const handleSubmit = async (e) => {
        // e.preventDefault()

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
        if (!imgURL.length) {
            validationErrors.push('Preview photo is required')
        }
        if (validationErrors.length) {
            return setErrors(validationErrors)
        }

        const imgSpot = [
            { url: imgURL, preview: true },
            { url: imgTwo, preview: false },
            { url: imgThree, preview: false },
            { url: imgFour, preview: false },
            { url: imgFive, preview: false },
        ]
        const createdSpot = {
            country, address, city, state, description, price, name, 
            lat: 1, lng: 1
        } 
        const newSpot = await dispatch(addSpotThunk(createdSpot, imgSpot))
        
        history.push(`/spots/${newSpot.id}`)
    }

    return (
        <section>
            <div>
                <form onSubmit={handleSubmit}>
                        <p>Create a new Spot</p>
                        <p>Where's your place located?</p>
                    <ul>
                        {errors?.map((error, idx) => (<li key={idx}>{error}</li>))}
                    </ul>
                    <div>
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
                        <div>
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
                        </div>
                        <div>*Guests will only get your exact address once they booked a reservation.*</div>
                    </div>
                    <label>
                        <p>Describe your place to guests</p>
                        <div>Mention the best features of your space, any special amenities like fast wifi or parking,
                            and what you love about the neighborhood.</div>
                        <textarea
                            type='textarea' placeholder='Please write at least 30 characters' min='30'
                            required value={description} onChange={updateDescription}
                        />
                    </label>
                    <label>
                        <p>Create a title for your spot</p>
                        <div>
                            Catch guests' attention with a spot tile that
                            highlights your place special.
                        </div>
                        <input
                            type='text' placeholder='Name of your spot' min='1'
                            required value={name} onChange={updateName}
                        />
                    </label>
                    <label>
                        <p>Set a base price for your spot</p>
                        <div>Competitive pricing can help your listing stand out and rank
                            higher in search results.</div>
                        <div>
                            $
                            <input
                                type='number' placeholder='Price per night (USD)' min='1'
                                required value={price} onChange={updatePrice}
                            />
                        </div>
                    </label>
                    <label>
                        <p>Liven up your spot with photos</p>
                        <p>Submit a link to at least one photo to publish your spot</p>
                        <input
                            type='url' placeholder='Preview Image URL' min='1'
                            required value={imgURL} onChange={updateImageURL}
                        />
                        <input
                            type='url' placeholder='imageURL' min='1'
                            value={imgTwo} onChange={updateImageTwo}
                        />
                        <input
                            type='url' placeholder='imageURL' min='1'
                            value={imgThree} onChange={updateImageThree}
                        />
                        <input
                            type='url' placeholder='imageURL' min='1'
                            value={imgFour} onChange={updateImageFour}
                        />
                        <input
                            type='url' placeholder='imageURL' min='1'
                            value={imgFive} onChange={updateImageFive}
                        />
                    </label>
                </form>
                    <button
                        disabled={
                            country.length < 1 || address.length < 1 || city.length < 1 ||
                            state.length < 1 || description.length < 30 || name.length < 0 ||
                            price.length < 1 || imgURL.length < 1
                        }
                        onClick={handleSubmit}
                        type="submit">Create Spot</button>
            </div>
        </section>
    )
}