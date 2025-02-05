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

    library.forEach(book => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("book");
       

       bookDiv.innerHTML = `
       '
       <div class="col">
       <img src="${book.immagine}" alt="${book.titolo}" class="book-image parametriLibro"/>
       <br>
       <h3 class="parametriLibro">${book.titolo}</h3>
       <br>
       <p class="parametriLibro"><strong>Autore:</strong> ${book.autore}</p>
       <br>
       <p class="parametriLibro"><strong>Prezzo:</strong> ${book.prezzo}</p>
       </div> 
   `;
   

        rowDiv.appendChild(bookDiv);
        i++;

        // Dopo 3 libri, resettiamo e creiamo una nuova riga
        if (i === 4) {
            rowDiv = document.createElement("div");
            rowDiv.classList.add("row");
            container.appendChild(rowDiv);
            i = 0; // Resetta il contatore
        }
        container.appendChild(bookDiv);
    });
}


// Chiamata alla funzione al caricamento della pagina
document.addEventListener('DOMContentLoaded', fetchLibriViviData);
