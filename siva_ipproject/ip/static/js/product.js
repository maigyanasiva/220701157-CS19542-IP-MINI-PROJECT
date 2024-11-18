// Parallax Effect
window.addEventListener('scroll', function() {
    const parallax = document.querySelector('.parallax-section');
    let scrollPosition = window.pageYOffset;
    
    parallax.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
  });
  
  document.addEventListener('DOMContentLoaded', loadProducts);

function loadProducts() {
    fetch('/api/inventory')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error loading products: ' + response.statusText);
            }
            return response.json();
        })
        .then(products => {
            populateProductCards(products);
        })
        .catch(error => {
            console.error(error);
            alert('Failed to load products. Please try again later.');
        });
}

function populateProductCards(products) {
    const productSection = document.getElementById('productSection');
    productSection.innerHTML = ''; // Clear existing content

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="https://via.placeholder.com/300x400" alt="${product.productName}">
            </div>
            <h2 class="product-title">${product.productName}</h2>
            <p class="product-description">Price: $${product.price ? product.price.toFixed(2) : 'N/A'}</p>
            <button class="buy-now-btn">Buy Now</button>
        `;
        productSection.appendChild(productCard);
    });
}

