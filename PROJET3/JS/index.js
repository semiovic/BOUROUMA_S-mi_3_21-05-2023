'use strict'
const galleryHtmlElement = document.querySelector('.gallery')

let works = [] // variable global qui contient tout le contenue dans un array //

let filteredWorks = []

async function getWorks() { // fonction qui recupere les données dans l'api //
  await fetch('http://localhost:5678/api/works')
    .then((res) => res.json())
    .then((data) => {
      works = data
      filteredWorks = data
    })
}

function buildWork(work) {
  let imgElement = document.createElement('img')
  imgElement.src = work.imageUrl
  imgElement.alt = work.title

  let figcaptionElement = document.createElement('figcaption')
  figcaptionElement.textContent = work.title

  let figureElement = document.createElement('figure')
  figureElement.appendChild(imgElement)
  figureElement.appendChild(figcaptionElement)
  galleryHtmlElement.appendChild(figureElement)
}

function filterWorks(categoryId) {
  return works.filter(work => work.categoryId.toString() === categoryId)
}


function displayWorks(categoryId) { // Fonction qui appel la fonction de recuperation et use une boucle for pour creer html //
  if (categoryId) {
    filteredWorks = filterWorks(categoryId)
  } else {
    filteredWorks = works
  }
  // filteredWorks = categoryId ? filterWorks(categoryId) : works

  galleryHtmlElement.innerHTML = ''
  for (let i = 0; i < filteredWorks.length; i++) {
    buildWork(filteredWorks[i])
  }
}


const filters = document.querySelectorAll('#filters div') // je recupere les filtre ( les 4 div du html)
filters.forEach(filter => {
  filter.addEventListener('click', (event) => { // quand je console log tag j'ai biens les noms qui apparaissent au click //
    const categoryId = event.target.dataset.categoryid
    displayWorks(categoryId)
  })
})
getWorks().then(() => displayWorks())

// MODALE // 

const modal = document.querySelector(".modale")
const openModalBtn = document.querySelector(".modale_edit")
const worksContainer = document.getElementById("works-container");

// Fonction pour récupérer les works de l'API
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
  } catch (error) {
    console.error(error);
  }
}

// Fonction pour créer et ajouter les éléments HTML des works dans la modale
function buildWorks(works) {
  works.forEach((work) => {
    const workDiv = document.createElement("div");
    const workImg = document.createElement("img");
    const deleteIcon = document.createElement("span");

    workImg.setAttribute("src", work.imageUrl);
    workImg.setAttribute("alt", "work image");
    workImg.classList.add("work-img");

    deleteIcon.classList.add("delete-icon");
    deleteIcon.innerHTML = '<i class="fas fa-trash"></i>';
    deleteIcon.addEventListener("click", () => {  // supression poubelle // 
      deleteWork(work.id, workDiv);
    });


    workDiv.appendChild(deleteIcon);
    workDiv.appendChild(workImg);
    workDiv.classList.add("work-thumbnail"); // Ajout de la classe "work-thumbnail" pour chaque workDiv
    worksContainer.appendChild(workDiv);

    // Ajout des styles pour positionner l'icône dans le coin droit
    workDiv.style.position = "relative";
    deleteIcon.style.position = "absolute";
    deleteIcon.style.top = "5px";
    deleteIcon.style.right = "5px";
    deleteIcon.style.transform = "translate(50%, -50%)";
    deleteIcon.style.fontSize = "10px";
    deleteIcon.style.color = "black";
  });
}

// Fonction pour ouvrir la modale et afficher les works
async function openModal() {
  const works = await fetchWorks();
  buildWorks(works);
  modal.style.display = "block";
}

// Fonction pour fermer la modale et vider le contenu
function closeModal() {
  modal.style.display = "none";
  worksContainer.innerHTML = "";
}

// Événement pour ouvrir la modale
openModalBtn.addEventListener("click", openModal);

// Événement pour fermer la modale
const modaleTrigger = document.querySelector(".modale_header_x")

const modaleTrigger2 = document.querySelector(".modale_header_close")

modaleTrigger.addEventListener("click", closeModal)

modaleTrigger2.addEventListener("click", closeModal)

// Événement pour fermer la modale avec la touche Escape
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// SUPRESSION IMG VIA MODALE //


async function deleteWork(workId, workDiv) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    if (response.ok) {
      // Supprimer l'élément parent de l'icône
      workDiv.parentNode.removeChild(workDiv);
    } else {
      console.error("Une erreur est survenue lors de la suppression de l'image.");
    }
  } catch (error) {
    console.error(error);
  }
}

// BOUTTON SuPRESSION GALERI QUI REFRESH PAGE // 

const supprimerViaModale = document.querySelector(".modale_footer_delete");

supprimerViaModale.addEventListener("click", () => {
  location.reload();
});



//in modale open ajout photo//

let modale = document.querySelector(".modale")

let modaleAddPicture = document.querySelector(".modale_add_picture")

let addPictureButton = document.querySelector(".modale_footer_button")

addPictureButton.addEventListener("click", toggleModalePicture)
 
function toggleModalePicture(){
  modaleAddPicture.classList.toggle("active")
  modale.classList.remove("active")
}



// retour en arriere //

let returnModale = document.querySelector(".icone_retour")

returnModale.addEventListener("click", backModale)

function backModale(){
  modaleAddPicture.classList.remove("active")
  modale.classList.toggle("active")
}


// ENVOI DE LIMAGE VERS L'API //

const addPhotoChoice = document.querySelector(".modale_footer_photo");

addPhotoChoice.addEventListener("click", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title-input").value;
  const category = document.getElementById("category").value;
  const image = document.getElementById("image-input");
  console.log(image); // imprimer la valeur de l'élément HTML pour le champ de fichier

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image.files[0]);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log(errorMessage);
      throw new Error("Erreur lors de l'ajout de la photo");
    }

    // Rafraîchir la page pour afficher la nouvelle photo
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
});
 

  

// Vérifiez si le token est présent dans le localStorage
const token = localStorage.getItem('token');
console.log(token)

// Si le token est présent, afficher la modale
if (token) {
  // Afficher la barre de la modale
  const modalBar = document.querySelector('.modale_bar')
  modalBar.classList.toggle("active")

  let linkLogin = document.querySelector('.login')
  linkLogin.classList.toggle("active")

  let linkLogout = document.querySelector(".logout")
  linkLogout.classList.toggle("active")


} else {
  // Si le token n'est pas présent, masquer la modale
  const modal = document.querySelector(".modale_bar")
  modal.classList.remove("active")
}
