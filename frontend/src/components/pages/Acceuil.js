import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/logo.png";

const Acceuil = () => {
  //on récupèreles infos stockés dans le LocalStorage
  let userIdStorage = localStorage.getItem('userId');
  let tokenStorage = localStorage.getItem("token");
  //si il n'y a pas de token dans le Storage alors on est redirigé automatiquement vers la page de connexion
  if(tokenStorage === null) {
    window.location="/";
  }

  //les infos de tous posts
  const [datas, setDatas] = useState([]);
  //le loader pour rafraichir les données 
  const [loading, setLoading] = useState("");
  //on récup le pseudo du User connecté
  const [pseudo, setPseudo] = useState("");
  //les infos de l'user connecté
  const [isUser, setIsUser] = useState([]);
  //le Array de likes de L'user connecté
  let likesUser = isUser.likes;
  console.log(likesUser);

  //Contacte API pour avoir les infos de l'user en connecté
  useEffect(() => {
    axios({
      method: "GET",
      url: `http://localhost:8000/api/auth/${userIdStorage}`,
      headers: {
        authorization: `Bearer ${tokenStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setPseudo(res.data.pseudo)
        setIsUser(res.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loading]);
  //contacte API pour recuperer tous les posts
  useEffect(() => {

    axios({
      method: "GET",
      url: `http://localhost:8000/api/post/`,
      headers: {
        authorization: `Bearer ${tokenStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setDatas(res.data);
        setLoading("chargement...")
      })
      .catch((err) => {
        console.log(err);
      });

  }, [loading]);
  //contact API pour envoyer un post
  const handlePost = (e) => {
    e.preventDefault();

    const message = document.querySelector('#message').value;
    const image = document.querySelector('.create-post-image').files[0];
    console.log(image);
    const form = document.querySelector("#add-new-post");

    axios({
      method: "post",
      url: `http://localhost:8000/api/post`,
      headers: {
        authorization: `Bearer ${tokenStorage}`,
        "Content-Type": "multipart/form-data",
      },
      data: {
        pseudo,
        message,
        image,
      },
    })

      .then((res) => {
        setLoading(true)
      })
      .catch((res) => {
        console.log(res);
      });
    form.reset()
  };
  //Fonction Update de post
  const updatePost = (id, e) => {
    e.preventDefault();
    const message = e.target[0].value;
    const image = e.target[1].files[0];

    axios({
      method: "put",
      url: `http://localhost:8000/api/post/${id}`,
      headers: {
        authorization: `Bearer ${tokenStorage}`,
        "Content-Type": "multipart/form-data",
      },
      data: {
        message,
        image,
      }
    })
      .then((res) => {
        setLoading(true);
        e.target[0].value = null;
        e.target[1].value = null;
      })
      .catch((err) => {
        console.log(err);
      })


  };
  //contacte API pour supprimer un post
  const delPost = (id, e) => {
    e.preventDefault();

    axios({
      method: "delete",
      url: `http://localhost:8000/api/post/${id}`,
      headers: {
        authorization: `Bearer ${tokenStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setLoading(true)
      })
      .catch((err) => {
        console.log(err);
      })
  };
  //Contacte API pour gestion d'un like
  const like = (e) => {
    e.preventDefault();
    const id = e.target.id;

    axios({
      method: "patch",
      url: `http://localhost:8000/api/post/like-post/${id}`,
      headers: {
        authorization: `Bearer ${tokenStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setLoading(true)
      })
      .catch((err) => {
        console.log(err);
      })
  };
  //Contacte API pour gestion d'un dislike
  const dislike = (e) => {
    e.preventDefault();
    const id = e.target.id;

    axios({
      method: "patch",
      url: `http://localhost:8000/api/post/unlike-post/${id}`,
      headers: {
        authorization: `Bearer ${tokenStorage}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      })
  };
  //Logout 
  const logout = () => {
    localStorage.clear();
    window.location="/";
  };

  return (
    <>
      <div className="acceuil-page">

        <div className="navbar">


          <a href="/Acceuil" className="logo">
            <img src={logo} className="logo-site" alt="logo Groupomania" />
          </a>

          <div className="profil">

            <button className="profil profil-logout" onClick={logout}>Déconnexion<i className="fa-solid fa-right-from-bracket"></i></button>
          </div>

        </div>

        <div className="create-post">

          <p className="create-post create-post-pseudo">pseudo : {pseudo}</p>
          <form action="" onSubmit={handlePost} id="add-new-post">

            <div className="create-post create-post-form">
              <label className="create-post create-post-label" htmlFor="message">Message : </label>
              <br />
              <input
                type="text" maxLength="500" className="create-post create-post-message" name="message" id="message" placeholder="Postez quelque-chose..."
              />
              <br />
              <label className="create-post-image-label" htmlFor="message">Fichier :  </label>
                <br />
              <input type="file" className="create-post-image"></input>
            </div>

            <br />
            <input type="submit" value="Publier" className="create-post-btn" />
          </form>
        </div>

        <div className="fil-actu">
          {datas.map((post) => (
            <div className="post" key={post._id} id={post._id}>

              <div className="post-content">
                <div className="post-pseudo">
                  <p>Publié par : <span className="name">{post.pseudo}</span></p>
                </div>

                <div className="post-text">
                  <p className="post-msg">{post.message}</p>
                  <br />
                  {post.image && (<img src={post.image} alt="imgPost" className="post-img" />)}
                </div>
              </div>

              <div className="likes"  id={post._id}>
              {likesUser.includes(post._id) ? <button className="dislike" onClick={dislike} id={post._id}><i className="fa-solid fa-thumbs-down" id={post._id}></i></button> : <button className="like" onClick={like} id={post._id}><i className="fa-sharp fa-solid fa-thumbs-up" id={post._id}></i></button> }
              </div>

              {(isUser._id === post.userId || isUser.isAdmin === true) && (
                <div className="interact">

                  <form action="" className="interact-form" onSubmit={(e) => updatePost(post._id, e)}>
                    <label htmlFor="message" className="interact-form form-label">Corrigez-vous : </label>
                    <br />
                    <input type="text" maxLength="500" name="message" id="form-update" placeholder="Ecrivez..." />
                    <br />
                    <label htmlFor="file" className="update-img">Uploadez :</label>
                    <br />
                    <input type="file" name="file" id="file-update" />
                    <br />
                    <button type="submit" className="interact-modify"><i className="fa-solid fa-repeat"></i></button>
                  </form>

                  <button className="interact-delete" onClick={(e) => delPost(post._id, e)}><i className="fa-solid fa-trash"></i></button>
                </div>
              )}


            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Acceuil;