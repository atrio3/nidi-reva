import React from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import "./Home.css"

const Home = () => {
    return (
        <div className='home'>
            <Sidebar />
            <div className="homeContainer">
                <h1>Sub-Admin (REVA) </h1>            
            </div>
           
        </div>
    );
}

export default Home;
