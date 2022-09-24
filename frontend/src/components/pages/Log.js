import React from "react";
import Log from "../Log";

const Profil = () => {
    return (
        <div className='profil-page'>
            <div className="log-container">
                <Log signin={false} signup={true} />
            </div>
        </div>
    );
};

export default Profil;