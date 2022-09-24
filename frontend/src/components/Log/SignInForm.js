import React, { useState } from "react";
import axios from "axios";

const SignInForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        const emailError = document.querySelector(".email.error");
        const passwordError = document.querySelector(".password.error");

        axios({
            method: "post",
            url: `http://localhost:8000/api/auth/login`,
            headers: {
                "Content-Type":"application/json",
            },

            data:{
                email,
                password,
            },
        })
        .then((res) => {
            if (res) {
                console.log(res);
                let userId =res.data.userId;
                let token = res.data.token;
                localStorage.setItem("userId", userId)
                localStorage.setItem("token", token)

                window.location = "/Acceuil";
              }
        })
        .catch((res) => {
            console.log(res.response);
            if (res.response.data.message.includes("Utilisateur introuvable")) {
                emailError.innerHTML = res.response.data.message;
                passwordError.innerHTML = "";
            } if (res.response.data.message.includes("Paire identifiant/mot de passe incorrecte ")){
                emailError.innerHTML = "";
                passwordError.innerHTML = res.response.data.message;
            }
        });
    };

    
    return (
        <form action="" onSubmit={handleLogin} id="sing-in-form">

            <label htmlFor="email">Email</label>
            <br />
            <input type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}
            value={email} />
            <div className="email error"></div>
            <br />

            <label htmlFor="password">Mot de passe</label>
            <br />
            <input type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)}
            value={password} />
            <div className="password error"></div>
            <br />

            <input type="submit" value="se connecter" />
        </form>
    );
};

export default SignInForm;