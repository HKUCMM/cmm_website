import React from "react";
import './MiddleSection.css'

const MiddlePage = () => {
    return (
        <div 
        className = "middle-section"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/background_mainpage.png'})` }}
        >
            <div className = "content">
                <h1>CMM</h1>
                <h2>THE UNIVERSITY OF HONG KONG</h2>
                <h2>KOREAN CODING SOCIETY</h2>

            </div>
        </div>
    )
}

export default MiddlePage;