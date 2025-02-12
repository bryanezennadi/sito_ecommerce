async function fetchLibriViviData() {
    try {
        // Fetch del file JSON
        const response = await fetch('../altre_pagine/dataSport.json');
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
                    <a class="nav-link ${index === 2 ? 'active' : ''}" href="${item.link}">${item.name}</a>
                </li>`;
        }).join('');

        // Aggiorna logo e titoli
        document.getElementById('logo').innerHTML = `<img class="logo" src="${data.logo}" alt="Logo">`;
        const titoloSport = document.getElementById('titolosport');
        titoloSport.classList.add('titolo');
        titoloSport.textContent = data.title;

        const titoloSport2 = document.getElementById('titolosport2');
        titoloSport2.classList.add('titolo');
        titoloSport2.textContent = data.title2;

        // Chiamata alla funzione per mostrare i libri
        displayBooks(data.library);

    } catch (error) {
        console.error('Errore:', error);
        alert('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
    }
}

// Funzione per mostrare i libri
function displayBooks(library) {
    const container = document.getElementById("book-container");
    if (!container) {
        console.error("Elemento #book-container non trovato nel DOM.");
        return;
    }

    container.innerHTML = ''; // Pulisce il contenitore prima di riempirlo
    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row"); // Crea una nuova riga
    container.appendChild(rowDiv);

    let i = 0; // Contatore per i libri nella riga

    library.forEach((book, index) => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");

        bookDiv.innerHTML = `
            <div class="col">
                 <a href="paginaDettagli.html?book=${encodeURIComponent(book.titolo)}">
                    <img src="${book.immagine}" alt="${book.titolo}" class="book-image parametriLibro"/>
                </a>
                <br>
                <h3 class="parametriLibro">${book.titolo}</h3>
                <br>
                <p class="parametriLibro"><strong>Autore:</strong> ${book.autore}</p>
                <br>
                <p class="parametriLibro"><strong>Prezzo:</strong> ${book.prezzo}</p>
                <br>
                <button class="add-to-cart parametriLibro" data-id="${book.id}" data-name="${book.titolo}" data-price="${book.prezzo}" data-image="${book.immagine}">Aggiungi al carrello</button>
            </div> 
        `;

        rowDiv.appendChild(bookDiv);
        i++;
        if (i == 1 || i == 3 || i == 4) {
            bookDiv.classList.add("rimpicciolimento2");
        }

        // Dopo 4 libri, resettiamo e creiamo una nuova riga
        if (i === 4) {
            rowDiv = document.createElement("div");
            rowDiv.classList.add("row");
            container.appendChild(rowDiv);
            i = 0; // Resetta il contatore
        }
        container.appendChild(bookDiv);
    });
    // Aggiungi il listener ai bottoni per aggiungere al carrello
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const book = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: this.dataset.price,
                image: this.dataset.image
            };

            // Recupera il carrello esistente (o un array vuoto se non esiste)
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Aggiungi il libro al carrello
            cart.push(book);

            // Salva di nuovo il carrello nel localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Notifica l'utente
            alert(book.name + " aggiunto al carrello!");
        });
    });
}


// Chiamata alla funzione al caricamento della pagina
document.addEventListener('DOMContentLoaded', fetchLibriViviData);
