import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const createSpot = "create-spot" + (sessionUser ? "" : " hidden")
  return (
    <div className='nav-bar'>
    <ul>
      <li>
        <NavLink exact to="/">
          <img className="bee-logo" src='/assets/beelogo.png' alt="Logo"></img>
        </NavLink>
      </li>
      {isLoaded && (
        <div className='spotC-profileB'>
           <li className={createSpot}>
            <NavLink to="/spots/new">Create a new spot</NavLink>
          </li>
          <li className='profileSqr'>
            <ProfileButton user={sessionUser} />
          </li>
        </div>
      )}
    </ul>
    </div>
  );
}

export default Navigation;
