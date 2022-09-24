import React, { useState } from "react";
import axios from "axios";

const SignUpForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pseudo, setPseudo] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        const emailError = document.querySelector(".email.error");
        const pseudoError = document.querySelector(".pseudo.error");
        const passwordError = document.querySelector(".password.error");

        axios({
            method: "post",
            url: `http://localhost:8000/api/auth/signup`,
            headers: {
                "Content-Type":"application/json",
            },

            data:{
                email,
                pseudo,
                password,
            },
        })
        .then((res) => {
            if (res){
                window.location = "/";
            }
        })
        .catch((res) => {
            console.log(res.response);

            if (res.response.data.message.includes("Password invalide")) {
                emailError.innerHTML = "";
                pseudoError.innerHTML = "";
                passwordError.innerHTML = res.response.data.message;
            }  
            if (res.response.data.message.includes("Email invalide")) {
                emailError.innerHTML = res.response.data.message;
                pseudoError.innerHTML = "";
                passwordError.innerHTML = "";
            } 
            if (res.response.data.message.includes("Pseudo invalide")) {
                emailError.innerHTML = "";
                pseudoError.innerHTML = res.response.data.message;
                passwordError.innerHTML = "";
            }
        });
    };

    
    return (
        <form action="" onSubmit={handleLogin} id="sing-up-form">

            <label htmlFor="email">Email</label>
            <br />
            <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}
            value={email} />
            <div className="email error"></div>
            <br />

            <label htmlFor="pseudo">Pseudo</label>
            <br />
            <input type="text" name="pseudo" id="pseudo" onChange={(e) => setPseudo(e.target.value)}
            value={pseudo} />
            <div className="pseudo error"></div>
            <br />

            <label htmlFor="password">Mot de passe</label>
            <br />
            <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)}
            value={password} />
            <div className="password error"></div>
            <br />

            <input type="submit" value="s'inscrire" />
        </form>
    );
};

export default SignUpForm;