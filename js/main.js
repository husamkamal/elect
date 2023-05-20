const row = document.getElementById("card_container");
const getProducts = () => {
  fetch("http://localhost:4000/devices")
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      result.forEach((element) => {
        const newDiv = document.createElement("div");
        newDiv.className = "col-sm-3";
        row.appendChild(newDiv);
        const card = document.createElement("div");
        card.className = "card";
        newDiv.appendChild(card);
        const img = document.createElement("img");
        img.src = element.picture;
        img.className = "card-img-top";
        img.style.height = "10rem";
        img.style.objectFit = "contain";
        card.appendChild(img);
        const newDiv2 = document.createElement("div");
        newDiv2.className = "card-body";
        card.appendChild(newDiv2);
        const title = document.createElement("h1");
        title.className = "card-title";
        title.textContent = element.name;
        newDiv2.appendChild(title);
        const pargra = document.createElement("p");
        newDiv2.appendChild(pargra);
        pargra.className = "card-text";
        pargra.textContent = element.description;
        const newDiv3 = document.createElement("div");
        newDiv3.className = "card-footer text-success";
        newDiv3.textContent = `ر.س${element.price} لمدة 7 ايام`;
        newDiv2.appendChild(newDiv3);
        const a = document.createElement("a");
        a.className = "btn btn-primary";
        a.textContent = "استجار";
        newDiv2.appendChild(a);
      });
    });
};
getProducts();

const form = document.getElementById("form");
const username = document.getElementById("username");
const password = document.getElementById("password");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(username.value, password.value);
  const response = await fetch("http://localhost:4000/login", {
    method: "POST",
    Headers: {
    //   Accept: "application.json",
      "Content-Type": "application/json",
    },
    Body: JSON.stringify({
      username: username.value,
      password: password.value,
    }),
  })
  console.log(response,55)
    // .then((res) => res.json())
    // .then(console.log())
    // .catch((err) => {
    //   console.log(err, 11);
    // });
});
const formRegister = document.getElementById("formRegister");
const usernameRegister = document.getElementById("usernameRegister");
const passwordRegister = document.getElementById("passwordRegister");
const PhoneRegister = document.getElementById("PhoneRegister");

formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  const response = await fetch("http://localhost:4000/register", {
    method: "post",
    Headers: {
    //   Accept: "application.json",
      "Content-Type": "application/json",
    },
    Body: JSON.stringify({
      username: usernameRegister.value,
      password: passwordRegister.value,
      phoneNumber:PhoneRegister.value
    }),
  })
//   window.location.href = "http://127.0.0.1:5500/login.html"
  console.log(response,55)
    // .then((res) => res.json())
    // .then(console.log())
    // .catch((err) => {
    //   console.log(err, 11);
    // });
});
