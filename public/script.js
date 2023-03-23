/** @format */
const inputTag = document.getElementById("uploadFile");
const userInfoTag = document.querySelector(".userInfo");
const uploadButton = document.getElementById("uploadButton");
const myImages = document.getElementById("myImages");
const toggleSwitch = document.querySelector(".toggle");
const toggleButton = document.getElementById("toggle-theme");
const body = document.body;

// for dark mode and light mode
toggleButton.addEventListener("click", () => {
  body.classList.toggle("dark-theme");
  toggleButton.innerHTML = body.classList.contains("dark-theme")
    ? '<ion-icon name="moon-outline"></ion-icon>'
    : '<ion-icon name="sunny-outline"></ion-icon>';
});

// for show images in UI
const appendImages = (images) => {
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("row");
  for (let i = 0; i < images.length; i++) {
    const imageTag = document.createElement("div");
    imageTag.classList.add("col-md-6");
    const imageSrc = encodeURIComponent(images[i].Key);
    const title = images[i].Key.includes("/")
      ? images[i].Key.split("/")[0]
      : images[i].Key.split(".")[0];
    imageTag.innerHTML = `
      <div class="box">
        <div class="imageAndtitleDiv d-flex">
          <img src="http://msquarefdc.sgp1.digitaloceanspaces.com/${imageSrc}" alt="" class="pic" />
          <p class="title">${title}</p>
          <button class="deleteBtn">Delete</button>
        </div>
      </div>
    `;
    const deleteBtn = imageTag.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", async () => {
      const response = await fetch(
        `http://localhost:3000/file/${encodeURIComponent(images[i].Key)}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        imageContainer.removeChild(imageTag);
      }
    });
    imageContainer.append(imageTag);
  }
  myImages.innerHTML = "";
  myImages.append(imageContainer);
};

// appendImages();

// for upload image
const upload = async () => {
  uploadButton.innerHTML = `
  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
  Uploading
  `;
  const inputTag = document.getElementById("uploadFile");
  const data = new FormData();
  data.append("files", inputTag.files[0]);
  data.append("files", inputTag.files[1]);
  const response = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: data,
  });
  const bucketContentsJSON = await response.json();
  const bucketContents = bucketContentsJSON.data;
  const myContents = bucketContents.filter((item) =>
    item.Key.includes("mpps-summer")
  );
  console.log(myContents);
  uploadButton.textContent = "Upload";
  appendImages(myContents);
};
upload();
uploadButton.textContent = "Upload";

// const fetchData = async () => {
//   const response = await fetch("http://localhost:3000");
//   const data = await response.json();
//   appendImages(data);
// };

// fetchData(); // call fetchData on page load
