let cart = [];
let subtotal = 0;

// Load products on document ready
document.addEventListener('DOMContentLoaded', loadProducts);

function loadProducts() {
  fetch('/api/inventory')
    .then(response => {
      if (!response.ok) throw new Error('Error loading products: ' + response.statusText);
      return response.json();
    })
    .then(populateProductSelect)
    .catch(error => {
      console.error(error);
      alert('Failed to load products. Please try again later.');
    });
}

function populateProductSelect(products) {
  const productSelect = document.getElementById('productSelect');
  productSelect.innerHTML = '';  // Clear previous options

  products.forEach(product => {
    const option = document.createElement('option');
    option.value = product._id;
    option.textContent = `${product.productName} - $${product.price ? product.price.toFixed(2) : 'N/A'}`;
    productSelect.appendChild(option);
  });
}

function updateProductDetails() {
  const productId = document.getElementById('productSelect').value;
  if (!productId) return;

  fetch(`/api/inventory/${productId}`)
    .then(response => {
      if (!response.ok) throw new Error('Error fetching product details: ' + response.statusText);
      return response.json();
    })
    .then(product => {
      document.getElementById('productPrice').textContent = product.price ? `$${product.price.toFixed(2)}` : 'Price not available';
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
      alert('Failed to fetch product details. Please try again.');
    });
}

function addToCart(quantity) {
  const productId = document.getElementById('productSelect').value;
  if (!productId) {
    alert("Please select a product first.");
    return;
  }

  fetch(`/api/inventory/${productId}`)
    .then(response => {
      if (!response.ok) throw new Error('Error loading product: ' + response.statusText);
      return response.json();
    })
    .then(product => {
      const price = product.price || 0;
      const total = (price * quantity).toFixed(2);

      const existingItem = cart.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.total = (existingItem.quantity * price).toFixed(2);
      } else {
        cart.push({ productId, quantity, price, total });
      }

      updateCartTable();
      calculateTotals();
    })
    .catch(error => {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart. Please try again.');
    });
}

function updateCartTable() {
  const cartBody = document.getElementById('cartBody');
  cartBody.innerHTML = '';  // Clear the table

  cart.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.productId}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>$${item.total}</td>
    `;
    cartBody.appendChild(row);
  });
}

function calculateTotals() {
  subtotal = cart.reduce((sum, item) => sum + parseFloat(item.total), 0);
  const tax = (subtotal * 0.05).toFixed(2);
  const total = (subtotal + parseFloat(tax)).toFixed(2);

  document.getElementById('subtotal').innerText = subtotal.toFixed(2);
  document.getElementById('tax').innerText = tax;
  document.getElementById('total').innerText = total;
}
