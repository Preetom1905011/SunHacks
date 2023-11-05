import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import "../styles/codespace.scss"

export default function Codespace() {
    const location = useLocation();
    const { id, diff, userName} = location.state;
  return (
    <div>
        <div className='topbar'>
            <h1>{diff}: Level {id}</h1>
            <Link to={`/levels/login-success?username=${userName}`} className='login-button links back-bt'>Back</Link>
        </div>
    </div>
  )
}
