// Search functionality
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      
      productCards.forEach(card => {
        const productName = card.querySelector('.caption').textContent.toLowerCase();
        const isVisible = productName.includes(searchTerm);
        card.style.display = isVisible ? 'flex' : 'none';
      });
    });
  }

  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      productCards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';
        } else {
          const category = card.getAttribute('data-category');
          card.style.display = category === filter ? 'flex' : 'none';
        }
      });
    });
  });

  // Wishlist functionality
  const wishlistButtons = document.querySelectorAll('.wishlist-btn');
  wishlistButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      button.classList.toggle('active');
      
      if (button.classList.contains('active')) {
        button.textContent = '❤️';
        // You can add wishlist logic here
      } else {
        button.textContent = '🤍';
      }
    });
  });

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const productCard = button.closest('.product-card');
      const productName = productCard.querySelector('.caption').textContent;
      const productPrice = productCard.querySelector('.price').textContent;
      
      // Visual feedback
      const originalText = button.textContent;
      button.textContent = 'Added! ✓';
      button.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
      
      // You can add cart logic here
      console.log(`Added to cart: ${productName} - ${productPrice}`);
    });
  });
});

