import React, { useState } from 'react';
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const Log = (props) => {
    const [signUpModal, setSignUpModal] = useState(props.signup);
    const [signInModal, setSignInModal] = useState(props.signin);

    const HandleModals = (e) => {
        if (e.target.id === "register") {
            setSignInModal(false);
            setSignUpModal(true);
        } else if (e.target.id === "login") {
            setSignUpModal(false);
            setSignInModal(true);
        };
    }

    return (
        <div className="connection-form">
            <div className="form-container">

                <ul>
                    <li onClick={HandleModals} id="register" className={signUpModal ? "active-btn" : null}>S'inscrire</li>

                    <li onClick={HandleModals} id="login" className={signInModal ? "active-btn" : null}>Se connecter</li>
                </ul>

                {signUpModal && <SignUpForm />}
                {signInModal && <SignInForm />}
            </div>
        </div> 
    );
};

export default Log;