let inventory = [];

// Load Inventory Data
async function loadInventory() {
  const tbody = document.getElementById("inventoryBody");
  tbody.innerHTML = ""; // Clear table

  try {
    const response = await fetch('/api/inventory');
    if (!response.ok) throw new Error('Network response was not ok');
    inventory = await response.json(); // Update local inventory from database
    inventory.forEach((item, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.productName}</td>
        <td>${item.category}</td>
        <td>${item.location}</td>
        <td class="${getStockLevelClass(item.stock, item.reorderLevel)}">${item.stock}</td>
        <td>${item.reorderLevel}</td>
        <td>
          <button onclick="reorderProduct('${item.productName}')">Reorder</button>
          <button onclick="deleteProduct(${index})">Delete</button>
        </td>
      `;
      tbody.appendChild(row);
    });
    updateFilters();
  } catch (error) {
    console.error('Error loading inventory:', error);
  }
}

// Add Product
async function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("productName").value;
  const category = document.getElementById("category").value;
  const location = document.getElementById("location").value;
  const stock = parseInt(document.getElementById("stock").value);
  const reorderLevel = parseInt(document.getElementById("reorderLevel").value);

  const newProduct = {
    productName: name,
    category,
    location,
    stock,
    reorderLevel
  };

  try {
    const response = await fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProduct)
    });

    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    console.log(data.message); // Show success message
    loadInventory(); // Refresh the table
    hideAddProductForm(); // Hide the form
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Delete Product
function deleteProduct(index) {
  // Placeholder for delete functionality, which requires a DELETE API endpoint in Flask.
  inventory.splice(index, 1); // Remove product from inventory
  loadInventory(); // Refresh table
}

// Show Add Product Form
function showAddProductForm() {
  document.getElementById("addProductForm").style.display = "block";
}

// Hide Add Product Form
function hideAddProductForm() {
  document.getElementById("addProductForm").style.display = "none";
  document.getElementById("productForm").reset(); // Clear the form
}

// Determine stock level status
function getStockLevelClass(stock, reorderLevel) {
  if (stock <= reorderLevel) {
    return 'stock-low';
  } else if (stock > reorderLevel && stock < reorderLevel * 2) {
    return 'stock-ok';
  } else {
    return 'stock-high';
  }
}

// Generate Purchase Orders
function generatePurchaseOrder() {
  const purchaseOrderBody = document.getElementById("purchaseOrderBody");
  purchaseOrderBody.innerHTML = ''; // Clear existing orders
  let needReorder = false;

  inventory.forEach(item => {
    if (item.stock <= item.reorderLevel) {
      needReorder = true;
      const row = document.createElement('tr');
      const reorderQuantity = item.reorderLevel * 2 - item.stock; // Example logic for reorder quantity
      row.innerHTML = `
        <td>${item.productName}</td>
        <td>${item.category}</td>
        <td>${reorderQuantity}</td>
      `;
      purchaseOrderBody.appendChild(row);
    }
  });

  if (needReorder) {
    document.getElementById("purchaseOrderSection").style.display = "block";
  } else {
    alert("No items need reordering at the moment.");
    document.getElementById("purchaseOrderSection").style.display = "none";
  }
}

// Reorder product (mock functionality)
function reorderProduct(productName) {
  alert(`Reorder placed for ${productName}`);
}

// Filter inventory by category
function filterByCategory() {
  const category = document.getElementById("categoryFilter").value;
  const filteredInventory = category === "all" ? inventory : inventory.filter(item => item.category === category);
  displayFilteredInventory(filteredInventory);
}

// Filter inventory by location
function filterByLocation() {
  const location = document.getElementById("locationFilter").value;
  const filteredInventory = location === "all" ? inventory : inventory.filter(item => item.location === location);
  displayFilteredInventory(filteredInventory);
}

// Helper to display filtered inventory
function displayFilteredInventory(filteredInventory) {
  const tbody = document.getElementById("inventoryBody");
  tbody.innerHTML = '';
  filteredInventory.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.productName}</td>
      <td>${item.category}</td>
      <td>${item.location}</td>
      <td class="${getStockLevelClass(item.stock, item.reorderLevel)}">${item.stock}</td>
      <td>${item.reorderLevel}</td>
      <td>
        <button onclick="reorderProduct('${item.productName}')">Reorder</button>
        <button onclick="deleteProduct(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Update category and location filters dynamically based on the added products
function updateFilters() {
  const categories = [...new Set(inventory.map(item => item.category))];
  const locations = [...new Set(inventory.map(item => item.location))];

  const categoryFilter = document.getElementById("categoryFilter");
  const locationFilter = document.getElementById("locationFilter");

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  locationFilter.innerHTML = '<option value="all">All Locations</option>';

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.text = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });

  locations.forEach(location => {
    const option = document.createElement("option");
    option.value = location;
    option.text = location;
    locationFilter.appendChild(option);
  });
}

// Initialize page
window.onload = loadInventory;
