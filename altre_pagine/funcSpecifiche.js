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

// Funzione per ottenere il parametro dalla query string
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Funzione per mostrare i dettagli del libro
// Funzione per mostrare i dettagli del libro
function displayBookDetails(categories) {
  const bookTitle = getQueryParam('book'); // Ottieni il titolo dalla query string

  const bookDetails = document.getElementById('book-details');
  if (!bookDetails) {
    console.error("Elemento 'book-details' non trovato nel DOM.");
    return;
  }

  // Cerca il libro nelle categorie
  let bookFound = null;

  for (let category of categories) {
    bookFound = category.library.find(book => book.titolo === bookTitle);
    if (bookFound) break; // Se il libro è trovato, interrompi il ciclo
  }

  if (bookFound) {
    bookDetails.innerHTML = `
      <h1>${bookFound.titolo}</h1>
      <img src="${bookFound.image}" alt="${bookFound.titolo}" class="book-image">
      <p><strong>Autore:</strong> ${bookFound.autore}</p>
      <p><strong>Prezzo:</strong> ${bookFound.prezzo}</p>
      <p><strong>Descrizione:</strong> ${bookFound.descrizione || 'Nessuna descrizione disponibile.'}</p>
      <button id="btnFisico" class="btn btn-versione active">📖 Versione Fisica</button>
      <button id="btnEbook" class="btn btn-versione">📱 eBook</button>
      <button class="add-to-cart">🛒 Aggiungi al carrello</button>
    `;

    // Variabile per tracciare la versione selezionata (default: Fisica)
    let versioneSelezionata = "Fisica";

    // Seleziona i bottoni
    const btnFisico = document.getElementById("btnFisico");
    const btnEbook = document.getElementById("btnEbook");

    if (btnFisico && btnEbook) {
      btnFisico.addEventListener("click", function () {
        btnFisico.classList.add("active");
        btnEbook.classList.remove("active");
        versioneSelezionata = "Fisica"; // Cambia la versione
      });

      btnEbook.addEventListener("click", function () {
        btnEbook.classList.add("active");
        btnFisico.classList.remove("active");
        versioneSelezionata = "eBook"; // Cambia la versione
      });
    }

    // Aggiungi evento per aggiungere al carrello con la versione scelta
    const addButton = document.querySelector('.add-to-cart');
    addButton.addEventListener('click', function () {
      addToCart(bookFound, versioneSelezionata);
    });
  } else {
    bookDetails.innerText = "Libro non trovato.";
  }
}

// Funzione per aggiungere libri al carrello e salvarli nel localStorage con la versione scelta
function addToCart(book, versione) {
  if (!book || !book.titolo) {
    console.error("Errore: Tentativo di aggiungere un libro nullo o incompleto al carrello.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  const newBook = {
    name: book.titolo || "Sconosciuto",
    autore: book.autore || "Autore non disponibile",
    price: book.prezzo || "Prezzo non disponibile",
    image: book.image || "placeholder.jpg",
    versione: versione // Aggiunge la versione scelta
  };

  console.log("Prima di aggiungere:", cart);
  console.log("Libro da aggiungere:", newBook);
  
  cart.push(newBook);
  localStorage.setItem('cart', JSON.stringify(cart));

  alert(`"${newBook.name}" (${newBook.versione}) è stato aggiunto al carrello!`);
}

