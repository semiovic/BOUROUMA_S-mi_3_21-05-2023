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
  // Si la modale est déjà ouverte, on ne fait rien
  if (worksContainer.children.length > 0) {
    return;
  }
  const works = await fetchWorks();
  buildWorks(works);
  modal.style.display = "block";

  let overlay = document.querySelector(".overlay")
  overlay.style.display = "block"

}

// Fonction pour fermer la modale et vider le contenu
function closeModal() {
  modal.style.display = "none";
  worksContainer.innerHTML = "";

  let modale_picture = document.querySelector(".modale_picture_container")
  modale_picture.style.display = "none"

  let overlay = document.querySelector(".overlay")
  overlay.style.display = "none"


  let inputLabel = document.querySelector(".label_input_img")
  inputLabel.style.display = "block"

  imgPreview.style.display = "none"
  imgPreview.src = ''
  bodyPicture.style.display = "flex"

  // TODO VIDER LES INPUT (3) QUAND ON FERME MODALE //

}

// OVERLAY CLOSE //

let overlay = document.querySelector(".overlay")
overlay.addEventListener("click", closeModal)


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
  if (closeModal) {
    location.reload
  }
});

// SUPRESSION IMG VIA MODALE //

works = works.filter(work => work.id !== workId);

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

      // Mettre à jour le tableau `works`
      works = works.filter(work => work.id !== workId);

      // Mettre à jour l'affichage
      displayWorks();
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
  closeModal()
});

// PREVIEW IMG //

// Sélectionnez l'élément d'entrée de fichier
let input = document.querySelector('#image-input');
// Sélectionnez l'élément d'image de prévisualisation
let imgPreview = document.querySelector('#preview_img');
let inputLabel = document.querySelector(".label_input_img")
let imgFa = document.querySelector(".fa fa-image")
let bodyPicture = document.querySelector(".modale_picture_body")
let imgDiv = document.querySelector(".img_div")
let validateButton = document.querySelector(".modale_footer_photo")

// Ajoutez un écouteur d'événement de changement de fichier
input.addEventListener('change', function () {
  // Vérifiez si l'utilisateur a sélectionné un fichier
  if (input.files && input.files[0]) {
    // Créez un objet URL pour l'image sélectionnée
    validateButton.style.backgroundColor = '#1D6154'
    const imgURL = URL.createObjectURL(input.files[0]);
    // Afficher l'image dans l'élément img de prévisualisation
    imgPreview.src = imgURL;
    inputLabel.style.display = "none"
    bodyPicture.style.display = "none"
  } else {
    imgPreview.style.display = 'none'
    imgDiv.style.display = 'none'

  }
});


//in modale open ajout photo//


let modale = document.querySelector(".modale")

let modaleAddPicture = document.querySelector(".modale_add_picture")

let addPictureButton = document.querySelector(".modale_footer_button")

addPictureButton.addEventListener("click", toggleModalePicture)


function toggleModalePicture() {
  modaleAddPicture.classList.add("active")
  modale.classList.remove("active")

  let modale_picture = document.querySelector(".modale_picture_container")
  modale_picture.style.display = "block"

  let inputLabel = document.querySelector(".label_input_img")
  inputLabel.style.display = "block"

  let imgPreview = document.querySelector('#preview_img')
  imgPreview.style.display = "block"

}



// retour en arriere //

let returnModale = document.querySelector(".icone_retour")

returnModale.addEventListener("click", backModale)

function backModale() {
  modaleAddPicture.classList.remove("active")
  modale.classList.add("active")
}


// ENVOI DE LIMAGE VERS L'API //

const addPhotoChoice = document.querySelector(".modale_footer_photo");



addPhotoChoice.addEventListener("click", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title-input").value;
  const image = document.getElementById("image-input");
  const categorySelect = document.getElementById("category");
  const selectedOption = categorySelect.options[categorySelect.selectedIndex];
  const categoryId = selectedOption.getAttribute("data-id");
  let bodyPicture = document.querySelector(".modale_picture_body")

  if (!title || !categoryId || image.files.length === 0) {
    alert('Formulaire incomplet')
    return
  }
  else
  bodyPicture.style.display = "flex"
  console.log(image); // imprimer la valeur de l'élément HTML pour le champ de fichier

  let imgPreview = document.querySelector('#preview_img')
  imgPreview.style.display = "none"
  imgPreview.src = ''


  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", categoryId);
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

    // LA PHOTO SAJOUTE SANS RELOAD LA PAGE
    const newWork = await response.json()
    works.push(newWork)
    displayWorks()
    closeModal()
  } catch (error) {
    console.error(error);
  }
});




// Vérifiez si le token est présent dans le localStorage
const token = localStorage.getItem('token');


// Si le token est présent, afficher la modale
if (token) {
  // Afficher la barre de la modale
  const modalBar = document.querySelector('.modale_bar')
  modalBar.classList.toggle("active")

  let linkLogin = document.querySelector('.login')
  linkLogin.classList.toggle("active")

  let linkLogout = document.querySelector(".logout")
  linkLogout.classList.toggle("active")
  linkLogout.addEventListener("click", function () {
    localStorage.clear()
  })

  let filters = document.querySelector("#filters")
  filters.classList.toggle("active")

  linkLogout.addEventListener("click", function () {
    localStorage.clear();
    window.location.replace("index.html")
  })

  let modifier1 = document.querySelector(".modifier1")
  let modifier2 = document.querySelector(".modifier2")

  modifier1.classList.toggle("active")
  modifier2.classList.toggle("active")

  modifier1.addEventListener("click", openModal)
  modifier2.addEventListener("click", openModal)

} else {
  // Si le token n'est pas présent, masquer la modale
  const modal = document.querySelector(".modale_bar")
  modal.classList.remove("active")
}
