const items = document.querySelectorAll("[data-items]");
const addToCartBtn = document.querySelectorAll("[data-atc]");
const confirmButton = document.querySelector("#confirmButton");
const confirmedPage = document.querySelector("#confirmedPage");
const confirmedProducts = document.querySelector("#confirmedProducts");
let totalPrice;
let totalQuantity;
let cartItems = [];
(async () => {
  const fetchData = await fetch("data.json");
  const dataJson = await fetchData.json();
  receiveData(dataJson);
})();
const receiveData = (data) => {
  items.forEach((elem, index) => {
    if (screen.width <= 425) {
      elem.querySelector("img").src = data[index].image.mobile;
    } else if (screen.width <= 768) {
      elem.querySelector("img").src = data[index].image.tablet;
    } else if (screen.width <= 1024 || screen.width > 1024) {
      elem.querySelector("img").src = data[index].image.desktop;
    }
    elem.querySelector("p").innerText = data[index].category;
    elem.querySelector("h2").innerText = data[index].name;
    elem.querySelector("[data-price]").innerText = `$${data[
      index
    ].price.toFixed(2)}`;
  });
  dataFunc(data);
};
function dataFunc(dataImg) {
  addToCartBtn.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      let buttonImg = dataImg[index].image.thumbnail;
      let buttonCategory =
        element.parentElement.parentElement.parentElement.querySelector("p");
      let buttonTitle =
        element.parentElement.parentElement.parentElement.querySelector("h2");
      let buttonPrice =
        element.parentElement.parentElement.parentElement.querySelector(
          "[data-price]"
        );
      document
        .getElementById("clickInner")
        .classList.add("animate-pulse-color");
      setTimeout(() => {
        document
          .getElementById("clickInner")
          .classList.remove("animate-pulse-color");
      }, 1000);
      getImg(buttonImg, buttonCategory, buttonTitle, buttonPrice);
    });
  });
}
function getImg(buttonImg, buttonCategory, buttonTitle, buttonPrice) {
  document.getElementById("addedItems").classList.add("hidden");
  let existingItemIndex = cartItems.findIndex((item) => {
    return item.title === buttonTitle.innerText;
  });
  if (existingItemIndex !== -1) {
    cartItems[existingItemIndex].quantity += 1;
    cartItems[existingItemIndex].totalPrice += parseFloat(
      buttonPrice.innerText.replace("$", "")
    );
    const cartItem = document.querySelectorAll("#cart")[existingItemIndex];
    cartItem.querySelector(
      ".quantity"
    ).innerText = `${cartItems[existingItemIndex].quantity}x`;
    cartItem.querySelector(".totalPrice").innerText = `$${cartItems[
      existingItemIndex
    ].totalPrice.toFixed(2)}`;
  } else {
    const newCartItem = {
      img: buttonImg,
      title: buttonTitle.innerText,
      price: parseFloat(buttonPrice.innerText.slice(1)),
      quantity: 1,
      totalPrice: parseFloat(buttonPrice.innerText.slice(1)),
    };
    cartItems.push(newCartItem);
    document.getElementById("addItem").insertAdjacentHTML(
      "beforeend",
      `
      <div id="cart">
        <div class="pt-5 pb-4 flex items-center justify-between border-b-2 border-[rgba(0_0_0/.05)]" id="getElem">
          <div id="imgDiv" class="flex items-center gap-x-5">
            <div class="hidden" id="imgContainer">
              <img class="w-[55px] rounded-[5px]" src="${buttonImg}" alt="" />
            </div>
            <div>
              <p class="font-[600] text-Rose900 text-[17px]">${buttonTitle.innerText}</p>
              <div class="flex items-center gap-x-5 mt-[6px]">
                <p class="text-Red font-[600] quantity">1x</p>
                <div class="flex items-center gap-x-3">
                  <p class="text-Rose400">@${buttonPrice.innerText}</p>
                  <p class="text-Rose500 font-[600] totalPrice">${buttonPrice.innerText}</p>
                </div>
              </div>
            </div>
          </div>
          <img class="cursor-pointer border border-Rose400 w-[23px] p-[3px] rounded-full" data-remove="" src="assets/images/icon-remove-item.svg" alt="" />
        </div>
      </div>
    `
    );
  }
  totalQuantity = cartItems.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
  totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  document.querySelector("#totalPri").innerText = `$${totalPrice.toFixed(2)}`;
  document.getElementById("cartItems").innerText = totalQuantity;
  document.getElementById("total").classList.remove("hidden");
  document.querySelector("#addItem").addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-remove")) {
      const cartItemToRemove = e.target.closest("#cart");
      const itemTitle = cartItemToRemove.querySelector("p").innerText;
      cartItems = cartItems.filter((item) => {
        return item.title !== itemTitle;
      });
      cartItemToRemove.remove();
      totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      document.getElementById("cartItems").innerText = totalQuantity;
      checkIfCartIsEmpty();
      totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
      document.querySelector("#totalPri").innerText = `$${totalPrice.toFixed(
        2
      )}`;
    }
  });
}
function checkIfCartIsEmpty() {
  if (cartItems.length === 0) {
    document.getElementById("addedItems").classList.remove("hidden");
    document.getElementById("total").classList.add("hidden");
  } else {
    document.getElementById("total").classList.remove("hidden");
  }
}
confirmButton.addEventListener("click", (e) => {
  confirmedPage.classList.remove("hidden");
  document.getElementById("orderTotal").innerText = `$${totalPrice.toFixed(2)}`;
  const confirmedProducts = document.querySelector("#confirmedProducts");
  confirmedProducts.innerHTML = "";

  document.querySelectorAll("#cart").forEach((elem) => {
    const clonedElem = elem.cloneNode(true);
    clonedElem.firstElementChild.classList.remove("pt-5");
    clonedElem
      .querySelector("#getElem")
      .append(clonedElem.querySelector(".totalPrice"));
    clonedElem.querySelector(".totalPrice").classList.add("text-Rose900");
    clonedElem.querySelector(".totalPrice").classList.add("text-xl");
    clonedElem.querySelector("#imgContainer").classList.remove("hidden");
    clonedElem.querySelector("#getElem [data-remove]").remove();
    confirmedProducts.appendChild(clonedElem);
  });
});
document.getElementById("newOrder").addEventListener("click", (e) => {
  confirmedPage.classList.add("hidden");
  cartItems = [];
  document.querySelector("#addItem").innerHTML = "";
  document.querySelector("#cartItems").innerText = "0";
  document.getElementById("total").classList.add("hidden");
  document.getElementById("addedItems").classList.remove("hidden");
});
document.getElementById("click").addEventListener("click", (e) => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
});
