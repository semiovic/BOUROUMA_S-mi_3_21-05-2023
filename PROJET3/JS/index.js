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
