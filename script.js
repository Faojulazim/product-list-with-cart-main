const items = document.querySelectorAll("[data-items]");
const addToCartBtn = document.querySelectorAll("[data-addtocartbtn]");
const confirmButton = document.querySelector("#confirmButton");
const confirmedPage = document.querySelector("#confirmedPage");
const confirmedProducts = document.querySelector("#confirmedProducts");
let totalPrice;
let totalQuantity;
let cartItems = [];
let newCartItem;
let buttonTitle;
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
    elem.querySelector("[data-rose").innerText = data[index].category;
    elem.querySelector("h2").innerText = data[index].name;
    elem.querySelector("[data-price]").innerText = `$${data[
      index
    ].price.toFixed(2)}`;
  });
  dataFunc(data);
};
function checkIfCartIsEmpty() {
  if (cartItems.length == 0) {
    document.getElementById("addedItems").classList.remove("hidden");
    document.getElementById("total").classList.add("hidden");
    document.querySelectorAll("[data-dec]").forEach((elem) => {
      elem.parentElement.parentElement
        .querySelector("[data-incquantitydec]")
        .classList.add("hidden");
      elem.parentElement.parentElement
        .querySelector("[data-addtocartbtn]")
        .classList.remove("hidden");
    });
  } else {
    document.getElementById("total").classList.remove("hidden");
  }
}

function dataFunc(dataImg) {
  addToCartBtn.forEach((element, index) => {
    element.addEventListener("click", (e) => {
      checkIfCartIsEmpty();
      element.parentElement
        .querySelector("[data-incquantitydec]")
        .classList.remove("hidden");
      element.parentElement
        .querySelector("[data-addtocartbtn]")
        .classList.add("hidden");
      element.parentElement.querySelector(
        "[data-incquantitydec] p"
      ).innerText = 1;

      let buttonImg = dataImg[index].image.thumbnail;
      let buttonCategory =
        element.parentElement.parentElement.parentElement.querySelector("p");
      buttonTitle =
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
      newCartItem = {
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
      getImg(buttonImg, buttonCategory, buttonTitle, buttonPrice);
    });
  });
}
function getImg(buttonImg, buttonCategory, buttonTitle, buttonPrice) {
  document.getElementById("addedItems").classList.add("hidden");
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
confirmButton.addEventListener("click", (e) => {
  confirmedPage.classList.remove("hidden");
  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
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
  document.querySelector("#addItem").innerHTML = "";
  document.querySelector("#cartItems").innerText = "0";
  document.getElementById("total").classList.add("hidden");
  document.getElementById("addedItems").classList.remove("hidden");
  document.querySelectorAll("[data-incquantitydec]").forEach((element) => {
    element.parentElement
      .querySelector("[data-incquantitydec]")
      .classList.add("hidden");
    element.parentElement
      .querySelector("[data-addtocartbtn]")
      .classList.remove("hidden");
  });
  cartItems = [];
});
document.getElementById("click").addEventListener("click", (e) => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
});
document.querySelectorAll("[data-inc]").forEach((elem, index) => {
  elem.addEventListener("click", (e) => {
    let val = Number(elem.previousElementSibling.innerText);
    val++;
    let existingItemIndex = cartItems.findIndex((item) => {
      return item.title === buttonTitle.innerText;
    });
    cartItems[existingItemIndex].quantity += 1;
    elem.previousElementSibling.innerText = val;
    document.querySelectorAll("#cart").forEach((eleme, index) => {
      if (
        elem.parentElement.parentElement.parentElement.parentElement.querySelector(
          "h2"
        ).innerText === eleme.querySelector("p").innerText
      ) {
        let cartPrice = cartItems[existingItemIndex].price;

        eleme.querySelector(".quantity").innerText = `${val}x`;
        eleme.querySelector(".totalPrice").innerText = `$${(
          val * cartPrice
        ).toFixed(2)}`;
      }
    });
    inc(val, existingItemIndex);
  });
});
document.querySelectorAll("[data-dec]").forEach((elem) => {
  elem.addEventListener("click", (e) => {
    let val = Number(elem.nextElementSibling.innerText);
    val--;
    let existingItemIndex = cartItems.findIndex((item) => {
      return item.title === buttonTitle.innerText;
    });
    cartItems[existingItemIndex].quantity -= 1;
    elem.nextElementSibling.innerText = val;
    document.querySelectorAll("#cart").forEach((eleme, index) => {
      if (
        elem.parentElement.parentElement.parentElement.parentElement.querySelector(
          "h2"
        ).innerText === eleme.querySelector("p").innerText
      ) {
        let cartPrice = cartItems[existingItemIndex].price;

        eleme.querySelector(".quantity").innerText = `${val}x`;
        eleme.querySelector(".totalPrice").innerText = `$${(
          val * cartPrice
        ).toFixed(2)}`;
      }
      if (val == 0) {
        elem.parentElement.parentElement
          .querySelector("[data-addtocartbtn]")
          .classList.remove("hidden");
        elem.parentElement.parentElement
          .querySelector("[data-incquantitydec]")
          .classList.add("hidden");
      }
    });
    inc(val, existingItemIndex);
  });
});
function inc(val, exist) {
  const cartPrice = cartItems[exist].price;
  cartItems[exist].totalPrice = val * cartPrice;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  document.getElementById("cartItems").innerText = totalQuantity;
  document.querySelector("#totalPri").innerText = `$${totalPrice.toFixed(2)}`;
  document.querySelectorAll("#cart").forEach((elem, index) => {
    if (elem.querySelector(".quantity").innerText == "0x") {
      elem.remove();
    }
    document.getElementById("clickInner").classList.add("animate-pulse-color");
    setTimeout(() => {
      document
        .getElementById("clickInner")
        .classList.remove("animate-pulse-color");
    }, 1000);
    if (document.querySelectorAll("#cart").length == 0) {
      cartItems = [];
      checkIfCartIsEmpty();
    }
  });
}
