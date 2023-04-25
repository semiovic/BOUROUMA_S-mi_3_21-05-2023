// PAGE DE CONEXION //

// utiliser fetch post //


function login() {
  let username = document.getElementById("username").value; // ?? mettre id dans le html //
  let password = document.getElementById("password").value;

  if (username == "mon_nom_d_utilisateur" && password == "mon_mot_de_passe") {
    alert("Connexion réussie !");
    // rediriger l'utilisateur vers la page de son choix
  } else {
    alert("Nom d'utilisateur ou mot de passe incorrect.");
  }
}


//  validation formulaire conexion + message erreur //

let validation = document.getElementById("button_envoi")

validation.addEventListener('click', function () {

  let inputMail = document.getElementById("mail")
  let inputPassword = document.getElementById("password")

  if (inputMail.value.trim() === "") {
    let myError = document.getElementById('error')
    myError.innerHTML = "E-mail requis!"
    myError.style.color = "red"

  }

  if (inputPassword.value.trim() === "") {
    let myError2 = document.getElementById('error2')
    myError2.innerHTML = "Mot de passe incorrect!"
    myError2.style.color = "red"
    e.preventDefault()
  }

  let email = inputMail.value
  let password = inputPassword.value

  // vider les champs

  


  fetch("http://localhost:5678/api/users/login", {
    method: 'POST',
    body: JSON.stringify({
      email,password
    }),
    headers: {  
      'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => response.json())
    .then((data) => {
      let token = data
      localStorage.setItem('token', token)
      console.log(token)
    })
    .catch((err)=> {
      console.log(err)
    })

    function checkToken() {
      let token = localStorage.getItem('token')
      localStorage.clear() // Vide complètement le stockage local
      let isLoggedIn = false
      if (token) {
        // Si un jeton est présent dans le stockage local, l'utilisateur est connecté
        isLoggedIn = true 
        console.log(token) // Affiche le jeton dans la console
        window.location.replace('/PROJET3/HTML/login.html') // Redirige l'utilisateur vers la page d'accueil
      }
      console.log(isLoggedIn) // Affiche si l'utilisateur est connecté ou non
    }
    
    // Appelle la fonction checkToken() pour vérifier si l'utilisateur est connecté
    checkToken()
})

