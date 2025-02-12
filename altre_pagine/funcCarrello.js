async function fetchLibriViviData() {
  try {
      // Fetch del file JSON
      const response = await fetch('../altre_pagine/dataCarrello.json');
      if (!response.ok) {
          throw new Error('Errore nel caricamento del file JSON: ' + response.statusText);
      }

      const data = await response.json();

      // Genera dinamicamente la navbar
      const navbar = document.getElementById('navbar');
      navbar.innerHTML = data.navbar.map((item, index) => {
          if (!item.name || !item.link) {
              console.warn('Elemento navbar incompleto:', item);
              return ''; // Non renderizzare voci incomplete
          }
          return `
              <li class="nav-item">
                  <a class="nav-link ${index === 4 ? 'active' : ''}" href="${item.link}">${item.name}</a>
              </li>`;
      }).join('');

      // Aggiorna logo e titoli
      document.getElementById('logoCarrello').innerHTML = `<img class="logo" src="${data.logo}" alt="Logo">`;
      const titoloSport = document.getElementById('titolosport');
      titoloSport.classList.add('titolo');
      titoloSport.textContent = data.title;

      const titoloSport2 = document.getElementById('titolosport2');
      titoloSport2.classList.add('titolo');
      titoloSport2.textContent = data.title2;

  } catch (error) {
      console.error('Errore:', error);
      alert('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
  }
}
document.addEventListener('DOMContentLoaded', fetchLibriViviData);
document.addEventListener('DOMContentLoaded', function(){
  const cartContainer = document.getElementById('cart-container');
  const totalPriceElement = document.getElementById('total-price');
  const checkoutButton = document.getElementById('checkout-button');

  // Recupera il carrello dal localStorage (o un array vuoto se non c'è nulla)
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Funzione per aggiornare la visualizzazione del carrello
  function updateCart() {
      // Pulisce il contenitore del carrello
      cartContainer.innerHTML = '';

      // Se il carrello è vuoto, mostra un messaggio
      if (cart.length === 0) {
          cartContainer.innerHTML = '<p>Il carrello è vuoto.</p>';
          totalPriceElement.textContent = '€0.00';
          return;
      }

      let totalPrice = 0;

      // Crea una lista degli articoli nel carrello
      cart.forEach((book, index) => {
          const bookDiv = document.createElement('div');
          bookDiv.classList.add('cart-item');

          bookDiv.innerHTML = `
              <div class="cart-item-details">
                  <img src="${book.image}" alt="${book.name}" class="cart-item-image"/>
                  <p><strong>Nome:</strong> ${book.name}</p>
                  <p><strong>Prezzo:</strong> €${book.price}</p>
              </div>
              <!-- Utilizza data-index per identificare in modo univoco l'elemento -->
              <button class="remove-from-cart" data-index="${index}">Rimuovi</button>
          `;

          cartContainer.appendChild(bookDiv);
          totalPrice += parseFloat(book.price);
      });

      // Mostra il totale del carrello
      totalPriceElement.textContent = `€${totalPrice.toFixed(2)}`;

      // Gestisce la rimozione di un singolo articolo usando l'indice
      const removeButtons = document.querySelectorAll('.remove-from-cart');
      removeButtons.forEach(button => {
          button.addEventListener('click', function() {
              // Recupera l'indice dell'elemento dal bottone cliccato
              const index = parseInt(this.dataset.index, 10);
              if (!isNaN(index)) {
                  // Rimuove l'elemento specifico usando splice
                  cart.splice(index, 1);
                  // Aggiorna il localStorage
                  localStorage.setItem('cart', JSON.stringify(cart));
                  // Aggiorna la visualizzazione del carrello
                  updateCart();
              }
          });
      });
  }

  // Aggiorna la visualizzazione del carrello all'avvio
  updateCart();

  // Gestisce il pulsante per procedere al pagamento
  checkoutButton.addEventListener('click', function() {
      if (cart.length === 0) {
          alert('Il carrello è vuoto!');
      } else {
          // Qui puoi gestire la logica per il pagamento, ad esempio reindirizzare l'utente a una pagina di pagamento
          alert('Procediamo con il pagamento!');
      }
  });
});