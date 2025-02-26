async function fetchLibriViviData() {
    try {
        // Fetch del file JSON
        const response = await fetch('../altre_pagine/file_json/dataCarrello.json');
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

  // Funzione per raggruppare gli articoli, tenendo conto delle versioni
function groupItems(cart) {
    const groupedItems = [];

    cart.forEach(book => {
        const existingBook = groupedItems.find(item => item.name === book.name && item.versione === book.versione);
        if (existingBook) {
            existingBook.quantity++;
        } else {
            groupedItems.push({...book, quantity: 1});
        }
    });

    return groupedItems;
}

/// Funzione per aggiornare la visualizzazione del carrello
function updateCart() {
    cartContainer.innerHTML = '';

    // Se il carrello è vuoto, mostra un messaggio
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Il carrello è vuoto.</p>';
        totalPriceElement.textContent = '€0.00';
        return;
    }

    let totalPrice = 0;
    const groupedCart = groupItems(cart);

    // Variabili per il libro gratuito
    let cheapestBook = null;
    let cheapestBookPrice = Infinity;
    let freeBookFound = false;

    // Se ci sono almeno 3 articoli, il più economico è gratis (solo 1 copia)
    if (groupedCart.length >= 3) {
        groupedCart.forEach((book) => {
            let bookPrice = parseFloat(book.price.replace('€', '').trim()); // Rimuoviamo simbolo euro per il calcolo
            if (bookPrice < cheapestBookPrice) {
                cheapestBookPrice = bookPrice;
                cheapestBook = book;
            }
        });

        if (cheapestBook && cheapestBook.quantity > 0) {
            cheapestBook.price = '0.00'; // La prima copia è gratuita
            cheapestBook.quantity--;
            freeBookFound = true;
        }
    }

    // Mostra il libro gratuito in una riga separata
    if (freeBookFound && cheapestBook) {
        const freeBookDiv = document.createElement('div');
        freeBookDiv.classList.add('cart-item', 'free-item');
        freeBookDiv.innerHTML = ` 
            <div class="cart-item-details">
                <img src="${cheapestBook.image}" alt="${cheapestBook.name}" class="cart-item-image"/>
                <p><strong>Nome:</strong> ${cheapestBook.name}</p>
                <p><strong>Prezzo:</strong> €0.00 (Gratuito)</p>
                <p><strong>Quantità:</strong> 1</p>
                <p><strong>Versione:</strong> ${cheapestBook.versione}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="remove-from-cart" data-name="${cheapestBook.name}" data-version="${cheapestBook.versione}">Rimuovi</button>
            </div>
        `;
        cartContainer.appendChild(freeBookDiv);
    }

    // Mostra gli altri articoli nel carrello
    groupedCart.forEach((book) => {
        if (book.price !== '0.00' || (book.price === '0.00' && book.quantity > 0)) {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('cart-item');

            const displayPrice = book.price === '0.00' ? cheapestBookPrice : parseFloat(book.price.replace('€', '').trim());

            bookDiv.innerHTML = `
                <div class="cart-item-details">
                    <img src="${book.image}" alt="${book.name}" class="cart-item-image"/>
                    <p><strong>Nome:</strong> ${book.name}</p>
                    <p><strong>Prezzo:</strong> €${displayPrice.toFixed(2)}</p>
                    <p><strong>Quantità:</strong> ${book.quantity}</p>
                    <p><strong>Versione:</strong> ${book.versione}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="remove-from-cart" data-name="${book.name}" data-version="${book.versione}">Rimuovi</button>
                </div>
            `;

            cartContainer.appendChild(bookDiv);

            // Somma il prezzo dell'articolo * quantità
            totalPrice += displayPrice * book.quantity;
        }
    });

    totalPriceElement.textContent = `€${totalPrice.toFixed(2)}`;

    // Gestione della rimozione di articoli
    const removeButtons = document.querySelectorAll('.remove-from-cart');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookName = this.dataset.name;
            const bookVersion = this.dataset.version;

            // Rimuovi il libro dal carrello in base al nome e versione
            cart = cart.filter(book => !(book.name === bookName && book.versione === bookVersion));

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
