"use strict";

const toastAlert = (message, status) => {
  Toastify({
    text: "This is a toast",
    duration: 3000,
    destination: "https://github.com/apvarun/toastify-js",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: status === "active" ? "green" : "red",
      borderRadius: "10px",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
};

const baseUrl = "http://localhost:3001";

const grid = document.querySelector(".users__container-grid");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".close");
const btnsOpenModal = document.querySelectorAll(".add");
const btnPost = document.querySelector(".post");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++) {
  btnsOpenModal[i].addEventListener("click", openModal);
}

btnCloseModal.addEventListener("click", closeModal);

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

const getDataByCB = async (endPoint, cb) => {
  let response = await fetch(`${baseUrl}/${endPoint}`).then((res) =>
    res.json()
  );

  cb(response);
};

const postData = async (endPoint, data) => {
  let response = await fetch(`${baseUrl}/${endPoint}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
};

const deleteData = async (endPoint, id) => {
  let response = await fetch(`${baseUrl}/${endPoint}/${id}`, {
    method: "DELETE",
  });
  return response;
};

getDataByCB("data", (datas) => {
  datas.map((data) => {
    grid.innerHTML += `
      <div class="users__container-grid__item">
        <div>
          <img
            src="${data.picsUrl}"
            alt=""
          />
        </div>
        <div>
          <div>
            <h2>${data.name} ${data.surname}</h2>
            <div class="${data.status}"></div>
          </div>
          <p>${data.profession}</p>
          <button class="delete" data-id="${data.id}">Delete</button>
        </div>
      </div>
    `;
  });

  const btns = document.querySelectorAll(".delete");

  btns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      let attrID = btn.getAttribute("data-id");

      deleteData("data", attrID);
    });
  });
});

const picUrl = document.querySelector("#profile__image");
const name = document.querySelector("#name");
const surname = document.querySelector("#surname");
const profession = document.querySelector("#profession");
const status = document.querySelector("#status");

btnPost.addEventListener("click", async (e) => {
  e.preventDefault();

  const userObj = {
    id: self.crypto.randomUUID(),
    picsUrl: picUrl.value,
    name: name.value,
    surname: surname.value,
    profession: profession.value,
    status: status.value,
  };

  await postData("data", userObj)
    .then((res) => {
      if (res.status === 201) {
        toastAlert("User Added Successfully", "active");
      }
    })
    .catch((err) => {
      toastAlert("User Added Failed", "error");
    });
});
