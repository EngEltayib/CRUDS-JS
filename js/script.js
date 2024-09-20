const productName = document.getElementById("productName");
const productPrice = document.getElementById("price");
const productTaxes = document.getElementById("taxes");
const productADS = document.getElementById("ads");
const productDiscount = document.getElementById("discount");
const totalPrice = document.getElementById("total");
const productImage = document.getElementById("image");
let mood = "create";
// get total price
function getTotalPrice() {
  if (productPrice.value == 0) {
    totalPrice.value = null;
  } else {
    totalPrice.value =
      +productPrice.value +
      +productTaxes.value +
      +productADS.value -
      +productDiscount.value;
    return totalPrice.value;
  }
}
// start validation functions ***
const errorMessage = document.getElementById("error-message");

function checkPrice() {
  if (getTotalPrice() < 0 || getTotalPrice() == "") {
    totalPrice.style.backgroundColor = "#ef5f5f";
    return false;
  } else {
    totalPrice.style.backgroundColor = "green";
    return true;
  }
}

function toggleErrorMessage() {
  if (!checkPrice()) {
    errorMessage.classList.remove("heddin");
  } else {
    errorMessage.classList.add("heddin");
  }
}
// check that the input value is more than 0 and the value is only numbers
function checkInputValue(event) {
  if (
    event.target.value < 0 ||
    event.target.value.toString() != parseFloat(event.target.value)
  ) {
    event.target.value = null;
  }
}
// end validation functions ***
// enter and display total price
const priceInputs = [productPrice, productTaxes, productADS, productDiscount];
priceInputs.forEach((input) => {
  input.addEventListener("keyup", (event) => {
    getTotalPrice();
    toggleErrorMessage();
    checkInputValue(event);
  });
});
//html elements references for creat section
const productCountContainer = document.getElementById(
  "product-count-container"
);
const productCount = document.getElementById("count");
const productCategory = document.getElementById("category");
const createButton = document.getElementById("creat");
const requiredMessage = document.getElementById("fill-required-fields");
const requiredFields = [productName, productPrice, productCategory];
// check if required fields have data or not
function checkFields() {
  let check = true;
  for (let counter = 0; counter < requiredFields.length; counter++) {
    if (requiredFields[counter].value != "") {
      requiredFields[counter].classList.add("is-valid");
      requiredFields[counter].classList.remove("is-invalid");
      requiredMessage.classList.add("heddin");
    } else {
      requiredFields[counter].classList.add("is-invalid");
      requiredFields[counter].classList.remove("is-valid");
      check = false;
      requiredMessage.classList.remove("heddin");
    }
  }
  return check;
}
// clear all Data & bootstrap validation classes
function clearData() {
  const inputOldData = [
    productName,
    productCategory,
    productPrice,
    productTaxes,
    productADS,
    productDiscount,
    totalPrice,
  ];
  for (let count = 0; count < inputOldData.length; count++) {
    inputOldData[count].value = "";
  }
}

function clearValidClasses() {
  for (let count = 0; count < requiredFields.length; count++) {
    requiredFields[count].classList.remove("is-valid");
  }
}
// check if there is data in local sotrage or not
let products; //  ALL DATA IS HERE *************************
if (localStorage.getItem("Products") != "") {
  products = JSON.parse(localStorage.Products);
} else {
  products = [];
}
// get number of products which stored
function numberOfProdcuts() {
  localStorage.setItem("productsCount", products.length);
  document.getElementById("products-count").innerHTML = parseInt(
    localStorage.getItem("productsCount")
  );
}

onload = () => {
  numberOfProdcuts();
};
// this variable to make sure if there is a new product added or not
let checkProductItems = true;
// this variable use it to store index of an element we want to update
let updateIndex;
// creat new product or new products & update
createButton.addEventListener("click", () => {
  if (checkFields() && checkPrice()) {
    // validate data before storage
    productADS.value = productADS.value || 0;
    productTaxes.value = productTaxes.value || 0;
    productDiscount.value = productDiscount.value || 0;
    // intialize object to put data on it
    let product = {
      ProductName: `${productName.value}`,
      ProductPrice: `${productPrice.value}`,
      ProductTaxes: `${productTaxes.value}`,
      ProductADS: `${productADS.value}`,
      ProductDiscount: `${productDiscount.value}`,
      ProductTotalPrice: `${totalPrice.value}`,
      ProductCount: `${productCount.value}`,
      ProductCategory: `${productCategory.value}`,
    };

    if (mood === "create") {
      // store new product in array & local storage
      for (let count = 0; count < productCount.value; count++) {
        products.push(product);
      }
    } else {
      products[updateIndex] = product;
      createButton.innerHTML = "Create";
      mood = "create";
      productCountContainer.style.display = "block";
    }

    localStorage.setItem("Products", JSON.stringify(products));
    // clear data & remove valid class
    clearData();
    clearValidClasses();
    // display all prodcuts
    checkProductItems = true;
    showProducts();
    numberOfProdcuts();
  }
});

//function to display data in table
const tableBody = document.getElementById("table-body");
const displayButton = document.getElementById("display");
const hiddeDataButton = document.getElementById("hidde-data");
function showProducts() {
  if (checkProductItems) {
    tableBody.innerHTML = ``;
    for (let counter = 0; counter < products.length; counter++) {
      tableBody.innerHTML += `<tr>
        <td>${counter + 1}</td>
        <td>${products[counter].ProductName}</td>
        <td>${products[counter].ProductPrice}</td>
        <td>${products[counter].ProductTaxes}</td>
        <td>${products[counter].ProductADS}</td>
        <td>${products[counter].ProductDiscount}</td>
        <td>${products[counter].ProductTotalPrice}</td>
        <td>${products[counter].ProductCategory}</td>
        <td>
          <button class="btn text-light" onclick="updateProduct(${counter})">Update</button>
        </td>
        <td>
          <button class="btn text-light" onclick="deleteProduct(${counter})">Delete</button>
        </td>
      </tr>`;
    }
  }
}

displayButton.addEventListener("click", () => {
  showProducts();
  checkProductItems = false;
});

hiddeDataButton.addEventListener("click", () => {
  tableBody.innerHTML = "";
  checkProductItems = true;
});
// function to delete one item or all items
const deleteProductsButton = document.getElementById("delete-all-products");

function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("Products", JSON.stringify(products));
  checkProductItems = true;
  showProducts();
  numberOfProdcuts();
}

function deleteAllProducts() {
  products = [];
  localStorage.setItem("Products", products);
  numberOfProdcuts();
}

deleteProductsButton.addEventListener("click", () => {
  deleteAllProducts();
  tableBody.innerHTML = "";
  numberOfProdcuts();
});
//function to update elment data
const inputFieldsList = ["ProductName"];

function updateProduct(index) {
  productName.value = products[index].ProductName;
  productPrice.value = products[index].ProductPrice;
  productTaxes.value = products[index].ProductTaxes;
  productADS.value = products[index].ProductADS;
  productDiscount.value = products[index].ProductDiscount;
  getTotalPrice();
  productCategory.value = products[index].ProductCategory;
  mood = "update";
  createButton.innerHTML = "Update";
  updateIndex = index;
  productCountContainer.style.display = "none";
  scroll({ top: 0, behavior: "smooth" });
}
//function to search using product name
const searchField = document.getElementById("search");
const searchProductCategoryButton =
  document.getElementById("search-by-category");
const searchProductTitleButton = document.getElementById("search-by-title");
function titleSearch() {
  tableBody.innerHTML = ``;
  for (let count = 0; count < products.length; count++) {
    if (products[count].ProductName.toString().includes(searchField.value)) {
      tableBody.innerHTML += `
      <tr>
        <td>${count + 1}</td>
        <td>${products[count].ProductName}</td>
        <td>${products[count].ProductPrice}</td>
        <td>${products[count].ProductTaxes}</td>
        <td>${products[count].ProductADS}</td>
        <td>${products[count].ProductDiscount}</td>
        <td>${products[count].ProductTotalPrice}</td>
        <td>${products[count].ProductCategory}</td>
        <td>
          <button class="btn text-light" onclick="updateProduct(${count})">Update</button>
        </td>
        <td>
          <button class="btn text-light" onclick="deleteProduct(${count})">Delete</button>
        </td>
      </tr>`;
    } else {
      continue;
    }
  }
}
function categorySearch() {
  tableBody.innerHTML = ``;
  for (let count = 0; count < products.length; count++) {
    if (
      products[count].ProductCategory.toString().includes(searchField.value)
    ) {
      tableBody.innerHTML += `
      <tr>
        <td>${count + 1}</td>
        <td>${products[count].ProductName}</td>
        <td>${products[count].ProductPrice}</td>
        <td>${products[count].ProductTaxes}</td>
        <td>${products[count].ProductADS}</td>
        <td>${products[count].ProductDiscount}</td>
        <td>${products[count].ProductTotalPrice}</td>
        <td>${products[count].ProductCategory}</td>
        <td>
          <button class="btn text-light" onclick="updateProduct(${count})">Update</button>
        </td>
        <td>
          <button class="btn text-light" onclick="deleteProduct(${count})">Delete</button>
        </td>
      </tr>`;
    } else {
      continue;
    }
  }
}
// search every time you enter new charchter
// searchField.addEventListener("keyup", () => {
//   searchAboutProduct();
// });

searchProductTitleButton.addEventListener("click", () => {
  titleSearch();
});

searchProductCategoryButton.addEventListener("click", () => {
  categorySearch();
});
