let inputVal = document.getElementById("input-data");
let searchBtn = document.getElementById("search-btn");
let showPic = document.getElementById("all-pics");
let showMore = document.getElementById("show-more");

// https://api.unsplash.com/search/photos?page=1&query=office&client_id=5avYHhjkw2sRyj4StFtWyCI5bqEtXtPkSxCoZN2LQCo

let page = 1;
let query = "";

async function loadPic() {
  query = inputVal.value;
  let response = await fetch(
    `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=5avYHhjkw2sRyj4StFtWyCI5bqEtXtPkSxCoZN2LQCo&per_page=12`
  );
  let data = await response.json();
  if(page===1){
showPic.innerHTML=""
  }

  data.results.map((el) => {
    let links = el.urls.small;
    let img = document.createElement("img");
    img.src = links;
    showPic.appendChild(img);
  });
  showMore.style.display = "block";
}
searchBtn.addEventListener("click", () => {
  page = 1
  loadPic();
});
showMore.addEventListener("click", () => {
  page++;
  loadPic();
});
