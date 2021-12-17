
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
  //img.width=200
  //img.height=200
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

var stringArray=["923456781"];
//document.getElementById("exercise").value=stringArray[0];
if (localStorage.getItem('level')==undefined){
  localStorage.setItem("level", 0);
}
document.getElementById("result").value=localStorage.getItem('level')+"/12";
function loadNumber(){
  fetch("./exercise.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(problem => {
      if(localStorage.getItem("level")==0){
        document.getElementById("exercise").value=stringArray[0];
      }
      if(localStorage.getItem("level")==(`${problem.id}`)){
        document.getElementById("exercise").value=`${problem.work}`;
      }
      else{
        console.log("not matched level ")
      }
    })

  })

}
checkLocalStorage()
loadImages(localStorage.getItem("filter"))
loadNumber();

function update() {
  var solved = false;

  var passed = 0;
  for (var i = 0; i < imagesList.length; i++) {
    if (document.getElementById("exercise").value.charAt(i) == `${imagesList[i].title}`) {
    console.log("match");
    console.log(document.getElementById("exercise").value.charAt(i));
    console.log(`${imagesList[i].title}`);
    passed++;
    }
  }
  if (passed === imagesList.length) {
    solved = true;
    console.log("solved" + ' ..... ');
    console.log(" ");
    var level =localStorage.getItem("level");
    level++;
    level=level%12;
    localStorage.setItem('level',level );
    document.getElementById("result").value=localStorage.getItem('level')+"/12";
    loadNumber();
  }
  else {
    console.log("wrong order");
  }

}


/////////////////////
