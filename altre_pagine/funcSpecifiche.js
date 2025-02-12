document.addEventListener('DOMContentLoaded', async function () {
  try {
    // Carica il file JSON
    const response = await fetch('../altre_pagine/specifiche.json');
    if (!response.ok) {
      throw new Error('Errore nel caricamento del file JSON: ' + response.statusText);
    }
    const data = await response.json();

    // Log per confermare che i dati sono stati caricati
    console.log('Dati JSON caricati:', data);

    // Genera dinamicamente la navbar
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.innerHTML = data.navbar.map((item) => `
        <li class="nav-item">
          <a class="nav-link" href="${item.link}">${item.name}</a>
        </li>
      `).join('');
    }

    // Aggiorna il logo e i titoli
    const logoCarrello = document.getElementById('logoCarrello');
    if (logoCarrello) {
      logoCarrello.innerHTML = `<img class="logo" src="${data.logo}" alt="Logo">`;
    }

    const titoloSport = document.getElementById('titolosport');
    if (titoloSport) {
      titoloSport.classList.add('titolo');
      titoloSport.textContent = data.title;
    }

    // Mostra i dettagli del libro selezionato
    displayBookDetails(data.categories);

  } catch (error) {
    console.error('Errore nel caricamento dei dati:', error);
    alert('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
  }

  // Pulsante Indietro: torna alla pagina precedente
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', function () {
      window.history.back();
    });
  }
});

// Funzione per ottenere il parametro 'title' dalla query string
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  const paramValue = urlParams.get(param);
  console.log(`Valore del parametro '${param}':`, paramValue);  // Aggiungi log per debugging
  return paramValue;
}

// Funzione per mostrare i dettagli del libro
// Funzione per mostrare i dettagli del libro
function displayBookDetails(categories) {
  const bookTitle = getQueryParam('book');  // Ottieni il titolo dalla query string

  const bookDetails = document.getElementById('book-details');
  if (!bookDetails) {
    console.error("Elemento 'book-details' non trovato nel DOM.");
    return;
  }

  // Log per il debug
  console.log("Titolo del libro dalla query string:", bookTitle);
  console.log("Categorie disponibili:", categories);

  // Cerca il libro nella categoria specificata
  let bookFound = null;

  categories.forEach(category => {
    if (bookFound) return; // Se il libro è già trovato, esci dalla ricerca

    // Se stai cercando per 'title'
    if (bookTitle) {
      bookFound = category.library.find(book => book.titolo === bookTitle);
    }
  });

  // Log per vedere se il libro è stato trovato
  console.log("Libro trovato:", bookFound);

  if (bookFound) {
    // Log per vedere se il codice di inserimento HTML viene eseguito
    console.log("Dettagli del libro da inserire:", bookFound);
    
    // Mostra i dettagli del libro
    bookDetails.innerHTML = `
      <h1>${bookFound.titolo}</h1>
      <img src="${bookFound.immagine}" alt="${bookFound.titolo}" class="book-image">
      <p><strong>Autore:</strong> ${bookFound.autore}</p>
      <p><strong>Prezzo:</strong> ${bookFound.prezzo}</p>
      <p><strong>Descrizione:</strong> ${bookFound.descrizione || 'Nessuna descrizione disponibile.'}</p>
      <button class="add-to-cart" data-book="${JSON.stringify(bookFound)}">🛒 Aggiungi al carrello</button>
    `;
    
    // Aggiungi evento per aggiungere al carrello
    const addButton = document.querySelector('.add-to-cart');
    if (addButton) {
      addButton.addEventListener('click', function () {
        addToCart(bookFound);
      });
    }
  } else {
    bookDetails.innerText = "Libro non trovato.";
  }
}


// Funzione per aggiungere libri al carrello e salvarli nel localStorage
function addToCart(book) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(book);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`"${book.titolo}" è stato aggiunto al carrello!`);
}
