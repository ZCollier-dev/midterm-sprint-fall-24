//AUTHORS: Zachary Collier, Sarah Elizabeth Murphy, Kyle/Scarlett Budgell
//END DATE: October 26th 2024
//DESCRIPTION: Script for the Ordering Page for Molten Metalworks.-->

// Alert Handler

function alertHandler(message, type) {
  document.querySelector("#alertBox").innerHTML = `<div>${message}</div>`;
  if (type === true) {
    document.getElementById("alertBox").style.background = "green";
  } else {
    document.getElementById("alertBox").style.background = "red";
  }
  setTimeout(function () {
    document.querySelector("#alertBox").innerHTML = "";
    document.getElementById("alertBox").style.background = "rgba(0, 0, 0, 0)";
  }, 3000);
}

// Function to generate and display a random order number
function displayOrderNumber() {
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  document.getElementById("customOrderNumber").value = orderNumber;
}

// Material prices per unit
const materialPrices = {
  Iron: 15,
  Copper: 20,
  Gold: 30,
};

// Function to calculate and display the item price based on quantity
function updatePrices() {
  const materialChosen = document.getElementById("customItemMaterial").value;
  const quantityInput = document.getElementById("customItemQuantity").value;
  const itemPriceField = document.getElementById("customItemPrice");
  const quantity = parseInt(quantityInput) || 0;

  if (materialChosen in materialPrices && quantity > 0) {
    const pricePerUnit = materialPrices[materialChosen];
    const totalItemPrice = pricePerUnit * quantity;
    itemPriceField.value = `$${totalItemPrice.toFixed(2)}`;
  } else {
    itemPriceField.value = "$0.00";
  }
}

// Function to calculate and display the total of all items with tax
function calculateOrderTotal() {
  const orderListTable = document
    .getElementById("orderList")
    .getElementsByTagName("tbody")[0];
  let total = 0;

  // Sum up each item's price in the table
  for (let row of orderListTable.rows) {
    const itemPriceText = row.cells[2].textContent.replace("$", ""); // Remove $ symbol
    const itemPrice = parseFloat(itemPriceText);
    if (!isNaN(itemPrice)) {
      total += itemPrice;
    }
  }

  // Apply 15% tax to the total
  const totalWithTax = total * 1.15;
  document.getElementById("orderTotal").value = `$${totalWithTax.toFixed(2)}`;
}

// Function to add item details to the order table
function addItemToTable(event) {
  event.preventDefault();

  const itemName = document.getElementById("customOrderName").value.trim();
  const itemMaterial = document.getElementById("customItemMaterial").value;
  const itemQuantity =
    parseInt(document.getElementById("customItemQuantity").value) || 0;
  const itemPrice = document.getElementById("customItemPrice").value;

  if (!itemName && !itemMaterial && itemQuantity === 0) {
    alertHandler("No item specified. Please try again.", false);
    return;
  }

  if (!itemName || !itemMaterial || itemQuantity <= 0) {
    alertHandler(
      "No item or quantity specified. Please specify your item and quantity.",
      false
    );
    return;
  }

  const orderListTable = document
    .getElementById("orderList")
    .getElementsByTagName("tbody")[0];
  const newRow = orderListTable.insertRow();

  newRow.insertCell(0).textContent = itemName;
  newRow.insertCell(1).textContent = itemMaterial;
  newRow.insertCell(2).textContent = itemPrice;
  newRow.insertCell(3).textContent = itemQuantity;

  const removeCell = newRow.insertCell(4);
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.className = "remove-button";
  removeButton.addEventListener("click", function () {
    newRow.remove();
    alertHandler("Item has been removed from cart.", true);
    calculateOrderTotal(); // Recalculate total after removing an item
  });
  removeCell.appendChild(removeButton);

  alertHandler("Item has been added to your cart.", true);

  document.getElementById("orderForm").reset();
  displayOrderNumber();
  calculateOrderTotal(); // Calculate total after adding an item
}

// Store customer and payment info in local storage if "Remember Me" is checked
function storeFormData() {
  const rememberMeChecked = document.getElementById("rememberMe").checked;
  if (rememberMeChecked) {
    const customerData = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("emailAddress").value,
      streetAddress: document.getElementById("streetAddress").value,
      apartment: document.getElementById("apartmentNumber").value,
      city: document.getElementById("city").value,
      province: document.getElementById("province").value,
      postalCode: document.getElementById("postalCode").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      cardName: document.getElementById("nameOnCard").value,
      cardNumber: document.getElementById("cardNumber").value,
      securityNumber: document.getElementById("securityNumber").value,
      expirationDate: document.getElementById("cardExpiry").value,
    };
    localStorage.setItem("customerData", JSON.stringify(customerData));
  } else {
    localStorage.removeItem("customerData");
  }
}

// Load data from local storage to autofill customer and payment information
function loadStoredData() {
  const storedData = JSON.parse(localStorage.getItem("customerData"));
  if (storedData) {
    document.getElementById("firstName").value = storedData.firstName || "";
    document.getElementById("lastName").value = storedData.lastName || "";
    document.getElementById("emailAddress").value = storedData.email || "";
    document.getElementById("streetAddress").value =
      storedData.streetAddress || "";
    document.getElementById("apartmentNumber").value =
      storedData.apartment || "";
    document.getElementById("city").value = storedData.city || "";
    document.getElementById("province").value = storedData.province || "";
    document.getElementById("postalCode").value = storedData.postalCode || "";
    document.getElementById("phoneNumber").value = storedData.phoneNumber || "";
    document.getElementById("nameOnCard").value = storedData.cardName || "";
    document.getElementById("cardNumber").value = storedData.cardNumber || "";
    document.getElementById("securityNumber").value =
      storedData.securityNumber || "";
    document.getElementById("cardExpiry").value =
      storedData.expirationDate || "";
  }
}

// Function to check if there are items in the table
function isCartEmpty() {
  const orderListTable = document
    .getElementById("orderList")
    .getElementsByTagName("tbody")[0];
  return orderListTable.rows.length === 0;
}

// Form submission event handler to validate cart and confirm storing data if "Remember Me" is checked
function handleFormSubmission(event) {
  event.preventDefault();

  if (isCartEmpty()) {
    alertHandler("Please add items to your cart.", false);
    return;
  }

  const requiredFields = [
    "firstName",
    "lastName",
    "emailAddress",
    "streetAddress",
    "city",
    "province",
    "postalCode",
    "phoneNumber",
    "nameOnCard",
    "cardNumber",
    "securityNumber",
    "cardExpiry",
  ];

  for (const field of requiredFields) {
    if (!document.getElementById(field).value) {
      alertHandler(
        "Please fill out all required Customer and Payment Information fields.",
        false
      );
      return;
    }
  }

  storeFormData();
  alertHandler("Order placed.", true);
}

// Event listeners for DOM manipulation
document.addEventListener("DOMContentLoaded", function () {
  displayOrderNumber();
  loadStoredData();

  document
    .getElementById("customItemMaterial")
    .addEventListener("change", updatePrices);
  document
    .getElementById("customItemQuantity")
    .addEventListener("input", updatePrices);

  document
    .getElementById("orderForm")
    .addEventListener("submit", addItemToTable);
  document
    .getElementById("customerInfoForm")
    .addEventListener("submit", handleFormSubmission);
});
