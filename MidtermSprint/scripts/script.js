// Author: cybrrgrl / Scarlett

// Function to generate and display a random order number
function displayOrderNumber() {
  const orderNumber = Math.floor(100000 + Math.random() * 900000);
  document.getElementById('customOrderNumber').value = orderNumber;
}

// Material prices per unit
const materialPrices = {
  Iron: 15,
  Copper: 20,
  Gold: 30
};

// Function to calculate and display the item price based on quantity and update the order total with tax
function updatePrices() {
  const materialChosen = document.getElementById('customItemMaterial').value;
  const quantityInput = document.getElementById('customItemQuantity').value;
  const itemPriceField = document.getElementById('customItemPrice');
  const orderTotalField = document.getElementById('orderTotal');
  const quantity = parseInt(quantityInput) || 0;

  if (materialChosen in materialPrices && quantity > 0) {
    const pricePerUnit = materialPrices[materialChosen];
    const totalItemPrice = pricePerUnit * quantity;
    const totalWithTax = totalItemPrice * 1.15;

    itemPriceField.value = `$${totalItemPrice.toFixed(2)}`;
    orderTotalField.value = `$${totalWithTax.toFixed(2)}`;
  } else {
    itemPriceField.value = "$0.00";
    orderTotalField.value = "$0.00";
  }
}

// Function to add item details to the order table
function addItemToTable(event) {
  event.preventDefault();

  const itemName = document.getElementById('customOrderName').value.trim();
  const itemMaterial = document.getElementById('customItemMaterial').value;
  const itemQuantity = parseInt(document.getElementById('customItemQuantity').value) || 0;
  const itemPrice = document.getElementById('customItemPrice').value;

  if (!itemName && !itemMaterial && itemQuantity === 0) {
    alert("No item specified. Please try again.");
    return;
  }

  if (!itemName || !itemMaterial || itemQuantity <= 0) {
    alert("No item or quantity specified. Please specify your item and quantity.");
    return;
  }

  const orderListTable = document.getElementById('orderList').getElementsByTagName('tbody')[0];
  const newRow = orderListTable.insertRow();

  newRow.insertCell(0).textContent = itemName;
  newRow.insertCell(1).textContent = itemMaterial;
  newRow.insertCell(2).textContent = itemPrice;
  newRow.insertCell(3).textContent = itemQuantity;

  const removeCell = newRow.insertCell(4);
  const removeButton = document.createElement('button');
  removeButton.textContent = "Remove";
  removeButton.className = "remove-button";
  removeButton.addEventListener('click', function() {
    newRow.remove();
    alert("Item has been removed from cart.");
  });
  removeCell.appendChild(removeButton);

  alert("Item has been added to your cart.");

  document.getElementById('orderForm').reset();
  displayOrderNumber();
  document.getElementById('orderTotal').value = "$0.00";
}

// Store customer and payment info in local storage if "Remember Me" is checked
function storeFormData() {
  const rememberMeChecked = document.getElementById('rememberMe').checked;
  if (rememberMeChecked) {
    const customerData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('emailAddress').value,
      streetAddress: document.getElementById('streetAddress').value,
      apartment: document.getElementById('apartmentNumber').value,
      city: document.getElementById('city').value,
      province: document.getElementById('province').value,
      postalCode: document.getElementById('postalCode').value,
      phoneNumber: document.getElementById('phoneNumber').value,
      cardName: document.getElementById('nameOnCard').value,
      cardNumber: document.getElementById('cardNumber').value,
      securityNumber: document.getElementById('securityNumber').value,
      expirationDate: document.getElementById('cardExpiry').value
    };
    localStorage.setItem('customerData', JSON.stringify(customerData));
  } else {
    localStorage.removeItem('customerData');
  }
}

// Load data from local storage to autofill customer and payment information
function loadStoredData() {
  const storedData = JSON.parse(localStorage.getItem('customerData'));
  if (storedData) {
    document.getElementById('firstName').value = storedData.firstName || '';
    document.getElementById('lastName').value = storedData.lastName || '';
    document.getElementById('emailAddress').value = storedData.email || '';
    document.getElementById('streetAddress').value = storedData.streetAddress || '';
    document.getElementById('apartmentNumber').value = storedData.apartment || '';
    document.getElementById('city').value = storedData.city || '';
    document.getElementById('province').value = storedData.province || '';
    document.getElementById('postalCode').value = storedData.postalCode || '';
    document.getElementById('phoneNumber').value = storedData.phoneNumber || '';
    document.getElementById('nameOnCard').value = storedData.cardName || '';
    document.getElementById('cardNumber').value = storedData.cardNumber || '';
    document.getElementById('securityNumber').value = storedData.securityNumber || '';
    document.getElementById('cardExpiry').value = storedData.expirationDate || '';
  }
}

// Function to check if there are items in the table
function isCartEmpty() {
  const orderListTable = document.getElementById('orderList').getElementsByTagName('tbody')[0];
  return orderListTable.rows.length === 0;
}

// Form submission event handler to validate cart and confirm storing data if "Remember Me" is checked
function handleFormSubmission(event) {
  event.preventDefault();

  if (isCartEmpty()) {
    alert("Please add items to your cart.");
    return;
  }

  const requiredFields = [
    'firstName', 'lastName', 'emailAddress', 'streetAddress', 'city', 
    'province', 'postalCode', 'phoneNumber', 'nameOnCard', 'cardNumber', 
    'securityNumber', 'cardExpiry'
  ];

  for (const field of requiredFields) {
    if (!document.getElementById(field).value) {
      alert("Please fill out all required Customer and Payment Information fields.");
      return;
    }
  }

  storeFormData();
  alert("Order placed.");
}

// Event listeners for DOM manipulation
document.addEventListener('DOMContentLoaded', function() {
  displayOrderNumber();
  loadStoredData();

  document.getElementById('customItemMaterial').addEventListener('change', updatePrices);
  document.getElementById('customItemQuantity').addEventListener('input', updatePrices);

  document.getElementById('orderForm').addEventListener('submit', addItemToTable);
  document.getElementById('customerInfoForm').addEventListener('submit', handleFormSubmission);
});
