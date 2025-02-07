document.addEventListener('DOMContentLoaded', function() {
    const cartItemsDiv = document.getElementById('cart-items');
    
    // Recupero il carrello dal localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Il tuo carrello è vuoto.</p>';
    } else {
      cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('cart-item');
        
        itemDiv.innerHTML = `
          <p>${item.name}</p>
          <p>Prezzo: €${item.price}</p>
        `;
  
        cartItemsDiv.appendChild(itemDiv);
      });
    }
  });
  