
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").then(registration =>{
    console.log("SW Registered!");
    console.log(registration);
  }).catch(error =>{
    console.log("SW Registration Failed!");
    console.log(error);
  })
}

//////////////
const findImageIndex = (list, image) => {
  for (let i = 0; i < list.length; i++) {
    imageId = i
    if (list[i].id == image.id)
      return imageId
  }
}

const titleText = (title, description, imageId, images) => {
  return `Nazov: ${title}  <br> Popis: ${description} <br> Obrázok:  ${imageId + 1} z ${images.length}`
}
const modal = document.getElementById('modal')
const imageModal = document.createElement('img')
const backdrop = document.getElementById('backdrop')


const openModal = (e, curentImg, imagesList) => {
  modal.innerHTML = ''
  const imageModal = document.createElement('img')
  const closeBtn = document.createElement('button')
  const prevBtn = document.createElement('a')
  const nextBtn = document.createElement('a')
  const title = document.createElement('span')
  const pauseBtn = document.createElement('button')
  const head = document.createElement('div')
  let imageId = findImageIndex(imagesList, curentImg)
  var show = false;
  head.className = 'head'
  pauseBtn.className = "modalBtn"
  pauseBtn.innerHTML = `play`
  closeBtn.className="closeBtn"
  closeBtn.innerHTML="     X"
  prevBtn.className = "prev"
  prevBtn.innerHTML='<'
  nextBtn.className = "next"
  nextBtn.innerHTML='>'
  backdrop.style.display = "grid"
  imageModal.src = e.target.src
  title.innerHTML = titleText(imagesList[imageId].title, imagesList[imageId].description, imageId, imagesList)
 
  var timer;

  pauseBtn.addEventListener('click', ()=>{
    if(show == false){
       timer = setInterval(() => {
        if ((imageId) >= imagesList.length-1)
          imageId = -1
        imageId++
        imageModal.src = `./images/${imagesList[imageId].filename}`
        title.innerHTML = titleText(imagesList[imageId].title, imagesList[imageId].description, imageId, imagesList)
      }, 2000);
      show=true;
      pauseBtn.innerHTML='pause'
      console.log('slideshow started')
    }
    else{
      clearInterval(timer)
      console.log(timer)
      show=false;
      pauseBtn.innerHTML='play'
      console.log('slideshow stopped')
    }
  })

  closeBtn.addEventListener('click', () =>{
    
      backdrop.style.display = "none"
  })
  prevBtn.addEventListener('click', () => {
    if ((imageId) <= 0){
      return
    }
    imageId--
    imageModal.src = `./images/${imagesList[imageId].filename}`
    title.innerHTML = titleText(imagesList[imageId].title, imagesList[imageId].description, imageId, imagesList)
  })

  nextBtn.addEventListener('click', () => {
    if ((imageId) >= imagesList.length -1 ){
      return
    }
    imageId++
    imageModal.src = `./images/${imagesList[imageId].filename}`
    title.innerHTML = titleText(imagesList[imageId].title, imagesList[imageId].description, imageId, imagesList)
  })

  modal.appendChild(prevBtn)
  modal.appendChild(imageModal)
  modal.appendChild(nextBtn)
  head.appendChild(pauseBtn)
  head.appendChild(title)
  modal.appendChild(head)
  modal.appendChild(closeBtn)

  //////
  //////

  //////
  //////
}
const imagesSection = document.getElementById('images')
const filter = document.getElementById('filter')

let imagesList = []
let target

const checkLocalStorage = () => {
  if (localStorage.getItem("filter") !== null) {
    filter.value = localStorage.getItem("filter") 
    return
  }

  localStorage.setItem("filter", "")
  filter.value = ""
}

const dragOver = (e) => (target = e.target)

const dragStop = (e) => {
  let temp = e.target.src
  e.target.src = target.src
  target.src = temp

  let url = e.target.baseURI
  url = url.replace('index.html', '')

  let filename1 = temp.replace(`${url}images/`, '')
  let element1 = imagesList.find(item => item.filename === filename1)

  let filename2 = e.target.src.replace(`${url}images/`, '')
  let element2 = imagesList.find(item => item.filename === filename2)

  let img1 = findImageIndex(imagesList, element1)
  let img2 = findImageIndex(imagesList, element2)


  let tempImg = imagesList[img1]
  imagesList[img1] = imagesList[img2]
  imagesList[img2] = tempImg

  if (localStorage.getItem("filter") != "")
    return
  localStorage.setItem('imagesList', JSON.stringify(imagesList))
  loadImages(localStorage.getItem("filter"))
}

const createGallery = (image, filterString) => {
  if (image.title.indexOf(filterString) == -1) {
    return
  }

  const img = document.createElement("img")
  img.src = `./images/${image.filename}`
  //if(image.id<6){
  //  img.width = 120
  //  img.height = 240
 // }
 // else{
    //img.width = 240
   // img.height = 120
//  }
  img.width=200
  img.height=200
  img.alt="picture";
  //img.style = "object-fit:cover"
  img.addEventListener('dragover', e => dragOver(e))
  img.addEventListener('dragend', (e) => dragStop(e))

  //img.addEventListener('click', (e) => openModal(e, image, imagesList))
  imagesSection.appendChild(img)
  imagesList.push(image)
}

const loadImages = (filterString) => {
  imagesSection.innerHTML = ''
  imagesList = []

  if (localStorage.getItem('imagesList') !== null) {
    let storedImages = JSON.parse(localStorage.getItem("imagesList"));
    storedImages.forEach(image => createGallery(image, filterString))
    return
  }

  fetch("./images.json")
    .then(res => res.json())
    .then(data => {
      data.forEach(image => createGallery(image, filterString))
    })
}

filter.addEventListener('input', (e) => {
  localStorage.setItem("filter", e.target.value)
  loadImages(e.target.value)
})
checkLocalStorage()
loadImages(localStorage.getItem("filter"))



/////////////////////
