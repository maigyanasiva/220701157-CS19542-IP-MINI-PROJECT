let customers = [];

// Load existing customers from the server
async function loadCustomers() {
  try {
    const response = await fetch('/api/customers');
    const data = await response.json();
    customers = data;
    updateCustomerTable();
  } catch (error) {
    console.error('Error loading customers:', error);
  }
}

// Add Customer
async function addCustomer(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const preferences = document.getElementById("preferences").value;

  const customer = {
    name: name,
    email: email,
    phone: phone,
    preferences: preferences,
    purchaseHistory: []
  };

  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customer)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message); // Log success message
      customers.push(customer); // Add to local array
      updateCustomerTable(); // Refresh the table
      document.getElementById("customerForm").reset(); // Reset the form
    } else {
      console.error('Error adding customer:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding customer:', error);
  }
}

// Update Customer Table
function updateCustomerTable() {
  const customerBody = document.getElementById("customerBody");
  customerBody.innerHTML = "";  // Clear the table

  customers.forEach((customer, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${customer.name}</td>
      <td>${customer.email}</td>
      <td>${customer.phone}</td>
      <td>${customer.preferences || "None"}</td>
      <td>${customer.purchaseHistory.length > 0 ? customer.purchaseHistory.join(", ") : "No purchases"}</td>
      <td>
        <button onclick="viewCustomerHistory(${index})">View History</button>
        <button onclick="removeCustomer(${index})">Remove</button>
      </td>
    `;

    customerBody.appendChild(row);
  });
}

// View Customer Purchase History
function viewCustomerHistory(index) {
  const customer = customers[index];
  alert(`${customer.name}'s Purchase History: ${customer.purchaseHistory.join(", ") || "No purchases"}`);
}

// Remove Customer
function removeCustomer(index) {
  // This function currently does not remove the customer from the server.
  // Implement API call to remove the customer if needed.
  customers.splice(index, 1);
  updateCustomerTable();
}

// Offer Loyalty Program
function offerLoyaltyProgram() {
  customers.forEach(customer => {
    alert(`Loyalty Program offer sent to ${customer.name}`);
  });
}

// Initialize page
window.onload = loadCustomers; // Load customers when the page loads
