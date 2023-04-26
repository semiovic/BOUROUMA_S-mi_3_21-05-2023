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
console.log(modaleAddPicture)

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

// AJOUT D'IMAGE VIA LA MODALE //

let newImg = document.getElementById("new_img")

let addImg = document.querySelector(".add_photo")

let img = document.createElement('img')

let urlImg =  "\assets\images\appartement-paris-xviii.png"

img.setAttribute("src", urlImg)

newImg.appendChild(img)

console.log(img)