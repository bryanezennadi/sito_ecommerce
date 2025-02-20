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

        // Aggiorna logo
        document.getElementById('logoCarrello').innerHTML = `<img class="logo" src="${data.logo}" alt="Logo">`;

        // Aggiorna i titoli
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

document.addEventListener('DOMContentLoaded', function() {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const emptyCartButton = document.getElementById('empty-cart-button'); // Il pulsante "Svuota carrello"

    // Recupera il carrello dal localStorage (o un array vuoto se non c'è nulla)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Funzione per raggruppare gli articoli uguali (per nome o ID)
    function groupItems(cart) {
        const groupedItems = [];

        cart.forEach(book => {
            const existingBook = groupedItems.find(item => item.name === book.name);
            if (existingBook) {
                existingBook.quantity++;
            } else {
                groupedItems.push({...book, quantity: 1});
            }
        });

        return groupedItems;
    }

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
    
        // Raggruppa gli articoli simili
        const groupedCart = groupItems(cart);
    
        // Variabili per il libro gratuito
        let cheapestBook = null;
        let cheapestBookPrice = Infinity;
        let freeBookFound = false;
    
        // Se ci sono almeno 3 articoli, il più economico è gratis (solo 1 copia)
        if (groupedCart.length >= 3) {
            // Trova l'articolo più economico
            groupedCart.forEach((book) => {
                let bookPrice = parseFloat(book.price.replace('€', '').trim()); // Rimuoviamo simbolo euro per il calcolo
                if (bookPrice < cheapestBookPrice) {
                    cheapestBookPrice = bookPrice;
                    cheapestBook = book;
                }
            });
    
            // Applica il prezzo gratuito solo alla prima copia
            if (cheapestBook && cheapestBook.quantity > 0) {
                cheapestBook.price = '0.00'; // La prima copia è gratuita
                cheapestBook.quantity--; // Riduci la quantità di una copia
                freeBookFound = true; // Segna che il libro gratuito è stato trovato
            }
        }
    
        // Mostra il libro gratuito in una riga separata (se presente)
        if (freeBookFound && cheapestBook) {
            const freeBookDiv = document.createElement('div');
            freeBookDiv.classList.add('cart-item', 'free-item');
            freeBookDiv.innerHTML = `
                <div class="cart-item-details">
                    <img src="${cheapestBook.image}" alt="${cheapestBook.name}" class="cart-item-image"/>
                    <p><strong>Nome:</strong> ${cheapestBook.name}</p>
                    <p><strong>Prezzo:</strong> €0.00 (Gratuito)</p>
                    <p><strong>Quantità:</strong> 1</p> <!-- Sempre 1, perché è solo una copia gratuita -->
                </div>
                <div class="cart-item-quantity">
                    <button class="remove-from-cart" data-name="${cheapestBook.name}">Rimuovi</button>
                </div>
            `;
            cartContainer.appendChild(freeBookDiv);
        }
    
        // Crea una lista degli articoli nel carrello raggruppati per nome, escludendo il libro gratuito
        groupedCart.forEach((book, index) => {
            // Aggiungi solo i libri che non sono gratuiti o quelli che sono copie successive
            if (book.price !== '0.00' || (book.price === '0.00' && book.quantity > 0)) {
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('cart-item');
    
                // Per le copie successive del libro gratuito, mostriamo il prezzo originale
                const displayPrice = book.price === '0.00' ? cheapestBookPrice : parseFloat(book.price.replace('€', '').trim());
    
                bookDiv.innerHTML = `
                    <div class="cart-item-details">
                        <img src="${book.image}" alt="${book.name}" class="cart-item-image"/>
                        <p><strong>Nome:</strong> ${book.name}</p>
                        <p><strong>Prezzo:</strong> €${displayPrice.toFixed(2)}</p> <!-- Mostriamo solo il valore numerico con il simbolo € -->
                        <p><strong>Quantità:</strong> ${book.quantity}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="remove-from-cart" data-index="${index}">Rimuovi</button>
                    </div>
                `;
    
                cartContainer.appendChild(bookDiv);
    
                // Somma il prezzo dell'articolo * quantità
                totalPrice += displayPrice * book.quantity;
            }
        });
    
        // Mostra il totale del carrello
        totalPriceElement.textContent = `€${totalPrice.toFixed(2)}`;
    
        // Gestisce la rimozione di un singolo articolo usando l'indice o nome
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookName = this.dataset.name || ''; // Per rimuovere il libro gratuito
                const index = this.dataset.index; // Per rimuovere gli altri libri
    
                if (bookName) {
                    // Rimuovi il libro gratuito dal carrello
                    cart = cart.filter(book => book.name !== bookName);
                } else if (index !== undefined) {
                    // Rimuovi un singolo libro con un determinato indice
                    cart.splice(index, 1);
                }
    
                // Aggiorna il localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
    
                // Aggiorna la visualizzazione del carrello
                updateCart();
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

    // Gestisci il pulsante per svuotare il carrello
    emptyCartButton.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Il carrello è già vuoto!');
        } else {
            // Svuota il carrello
            cart = [];
            // Rimuovi il carrello dal localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            // Aggiorna la visualizzazione del carrello
            updateCart();
        }
    });
});
