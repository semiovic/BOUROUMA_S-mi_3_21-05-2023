// PAGE DE CONEXION //

// utiliser fetch post //


// validation formulaire connexion + message erreur //
let validation = document.getElementById("button_envoi");
let inputMail = document.getElementById("mail");
let inputPassword = document.getElementById("password");
let errorMail = document.querySelector('#error');
let errorPassword = document.querySelector('#error2');

validation.addEventListener('click', function (event) {
  event.preventDefault();

  // Vérification du champ e-mail
  if (inputMail.value === "") {
    errorMail.textContent = "L'adresse e-mail est requise";
    return;
  } else if (!inputMail.checkValidity()) {
    errorMail.textContent = "Veuillez saisir une adresse e-mail valide";
    return;
  } else {
    errorMail.textContent = "";
  }

  // Vérification du champ mot de passe
  if (inputPassword.value === "") {
    errorPassword.textContent = "Le mot de passe est requis";
    return;
  } else {
    errorPassword.textContent = "";
  }

  // Envoi de la requête
  if (inputMail.value === "sophie.bluel@test.tld" && inputPassword.value === "S0phie") {
    fetch("http://localhost:5678/api/users/login", {
      method: 'POST',
      body: JSON.stringify({
        email: inputMail.value,
        password: inputPassword.value
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((response) => response.json())
      .then((data) => {
        localStorage.setItem('token', data.token);
        window.location.replace('/PROJET3/HTML/index.html');
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    alert("Nom d'utilisateur ou mot de passe incorrect.");
  }
});
