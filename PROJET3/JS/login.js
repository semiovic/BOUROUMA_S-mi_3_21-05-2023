// FILTRE GALLERY //

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

//open modale//
const modale = document.querySelector(".modale")


const editOpenModale = document.querySelector(".modale_edit")

editOpenModale.addEventListener("click", toggleModale)

function toggleModale(){
modale.classList.toggle("active")
}


//in modale open ajout photo//

let modaleAddPicture = document.querySelector(".modale_add_picture")

let addPictureButton = document.querySelector(".modale_footer_button")

addPictureButton.addEventListener("click", toggleModalePicture)
 
function toggleModalePicture(){
  modaleAddPicture.classList.toggle("active")
  modale.classList.remove("active")
}

// FERMETURE DES DEUX MODALES  + retour// 

const modaleTrigger = document.querySelector(".modale_header_x")

const modaleTrigger2 = document.querySelector(".modale_header_close")

modaleTrigger.addEventListener("click", closeModale)

modaleTrigger2.addEventListener("click", closeModale)

function closeModale(){
  modale.classList.remove("active")
  modaleAddPicture.classList.remove("active")
}

// retour en arriere //

let returnModale = document.querySelector(".icone_retour")

returnModale.addEventListener("click", backModale)

function backModale(){
  modaleAddPicture.classList.remove("active")
  modale.classList.toggle("active")
}

// PREVISUALISATION IMG + RECUPERATION IMG VIA MODAL // 

function previewImg(){
  let inputValue = document.querySelector(".modale_photo[type=file]").files

  let previewImg = document.querySelector("#preview_img")
  console.log(inputValue)

  if (inputValue.length > 0){
    let fileReader = new FileReader()
    fileReader.onload = function(event){
      document
      .getElementById("preview_img")
      .setAttribute("src", event.target.result)
      
    }
    fileReader.readAsDataURL(inputValue[0])
    
  }
  
}

// DESING PREVIEW //

let modalPic = document.querySelector(".modale_picture")

let clikclick = document.querySelector(".modale_photo")

clikclick.addEventListener("click", desingImg)
 
function desingImg(){
modalPic.classList.add("active")
}

// ENVOI DE LIMAGE VERS L'API //

function uploadImage() {
  // Récupérer l'élément input de type file de votre modale
  const fileInput = document.querySelector('.modale_photo[type="file"]');
  
  // Créer un objet FormData
  const formData = new FormData();
  
  // Ajouter l'image sélectionnée à l'objet FormData
  formData.append('image', fileInput.files[0]);

  // Envoyer l'objet FormData à l'API
  fetch('http://localhost:5678/api/works', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    console.log('Image envoyée');
  })
  .catch(error => {
    console.error('Erreur lors de l\'envoi de l\'image', error);
  });
}

let sendImgButton = document.querySelector(".modale_footer_photo")

sendImgButton.addEventListener("click", uploadImage) // PAS AUTORISE A ENVOYEZ LIMG VERS LAPI ?? // 


