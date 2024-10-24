//Author: cybrrgrl / Scarlett

//Script using DOM, Fetch API, and localstorage to pull payment info, as well as do calculations.



// Generate a random order number
function generateOrderNumber() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  
  // Material prices
  const materialPrices = {
    Iron: 15,
    Copper: 20,
    Titanium: 30
  };
  
  // Function to calculate and update the total price
  function calculateTotalPrice() {
    const materialChosen = document.getElementById('materialChosen').value;
    const quantity = parseInt(document.getElementById('quantity').value) || 0;
    const totalPriceSpan = document.getElementById('totalPrice');
  
    if (materialPrices[materialChosen] !== undefined) {
      const pricePerUnit = materialPrices[materialChosen];
      const totalPrice = pricePerUnit * quantity;
      totalPriceSpan.textContent = `$${totalPrice.toFixed(2)}`;
    } else {
      totalPriceSpan.textContent = "$0.00";
    }
  }
  
  // Store information on the machine
  function storeFormData() {
    const customerData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      streetAddress: document.getElementById('streetAddress').value,
      apartment: document.getElementById('apartment').value,
      city: document.getElementById('city').value,
      province: document.getElementById('province').value,
      postalCode: document.getElementById('postalCode').value,
      phoneNumber: document.getElementById('phoneNumber').value,
      cardName: document.getElementById('cardName').value,
      cardNumber: document.getElementById('cardNumber').value,
      securityNumber: document.getElementById('securityNumber').value,
      expirationDate: document.getElementById('expirationDate').value
    };
    localStorage.setItem('customerData', JSON.stringify(customerData));
  }
  
  // Pull saved data from the machine
  function loadFormData() {
    const savedData = JSON.parse(localStorage.getItem('customerData'));
    if (savedData) {
      document.getElementById('firstName').value = savedData.firstName;
      document.getElementById('lastName').value = savedData.lastName;
      document.getElementById('email').value = savedData.email;
      document.getElementById('streetAddress').value = savedData.streetAddress;
      document.getElementById('apartment').value = savedData.apartment;
      document.getElementById('city').value = savedData.city;
      document.getElementById('province').value = savedData.province;
      document.getElementById('postalCode').value = savedData.postalCode;
      document.getElementById('phoneNumber').value = savedData.phoneNumber;
      document.getElementById('cardName').value = savedData.cardName;
      document.getElementById('cardNumber').value = savedData.cardNumber;
      document.getElementById('securityNumber').value = savedData.securityNumber;
      document.getElementById('expirationDate').value = savedData.expirationDate;
    }
  }
  
  // Clear stored data from localStorage
  function clearFormData() {
    localStorage.removeItem('customerData');
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Automatically set the order number when the page loads
    const orderNumberInput = document.getElementById('orderNumber');
    orderNumberInput.value = generateOrderNumber();
  
    // Load form data if it exists
    loadFormData();
  
    // Material and quantity checks and inputs
    const materialChosenSelect = document.getElementById('materialChosen');
    const quantityInput = document.getElementById('quantity');
  
    materialChosenSelect.addEventListener('change', calculateTotalPrice);
    quantityInput.addEventListener('input', calculateTotalPrice); // Use 'input' for live updates
  });
  
  document.getElementById('orderForm').addEventListener('submit', function(event) {
    const form = event.target;
    const errorMessageDiv = document.getElementById('error-message');
    const rememberMeChecked = document.getElementById('rememberMe').checked;
  
    // Error stuffs :p
    errorMessageDiv.innerHTML = '';
  
    if (!form.checkValidity()) {
      event.preventDefault(); // Prevent form submission
      errorMessageDiv.innerHTML = 'Please fill in all required fields correctly.';
    } else {
      if (rememberMeChecked) {
        storeFormData(); // Store data if Remember Me is checked
      } else {
        clearFormData(); // Clear data if Remember Me is not checked
      }
    }
  });
  