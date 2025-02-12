document.addEventListener('DOMContentLoaded', function() {
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
            totalPriceElement.textContent = '€0.00'; // Se il carrello è vuoto, mostra 0 come totale
            return;
        }

        // Variabile per calcolare il totale del carrello
        let totalPrice = 0;

        // Crea una lista dei libri nel carrello
        cart.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('cart-item');
            bookDiv.dataset.id = book.id; // Aggiungiamo l'id per facilitare la rimozione

            bookDiv.innerHTML = `
                <div class="cart-item-details">
                    <img src="${book.image}" alt="${book.name}" class="cart-item-image"/>
                    <p><strong>Nome:</strong> ${book.name}</p>
                    <p><strong>Prezzo:</strong> €${book.price}</p> <!-- Corretto il simbolo dell'Euro -->
                </div>
                <button class="remove-from-cart" data-id="${book.id}">Rimuovi</button>
            `;

            cartContainer.appendChild(bookDiv);

            // Aggiungi il prezzo del libro al totale
            totalPrice += parseFloat(book.price);
        });

        // Mostra il totale del carrello
        totalPriceElement.textContent = `€${totalPrice.toFixed(2)}`; // Corretto il simbolo dell'Euro e formato il totale

        // Gestisce la rimozione degli articoli dal carrello
        const removeFromCartButtons = document.querySelectorAll('.remove-from-cart');
        removeFromCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookId = this.dataset.id; // Ottieni l'id del libro da rimuovere

                // Filtra il carrello per rimuovere l'articolo con l'id specifico
                cart = cart.filter(book => book.id !== bookId);

                // Salva il carrello aggiornato nel localStorage
                localStorage.setItem('cart', JSON.stringify(cart));

                // Rimuovi l'elemento dal DOM
                const bookDivToRemove = document.querySelector(`.cart-item[data-id="${bookId}"]`);
                if (bookDivToRemove) {
                    bookDivToRemove.remove();
                }

                // Ricalcola e aggiorna il totale
                let newTotalPrice = 0;
                cart.forEach(book => {
                    newTotalPrice += parseFloat(book.price);
                });

                totalPriceElement.textContent = `€${newTotalPrice.toFixed(2)}`;

                // Se il carrello è vuoto, mostra il messaggio
                if (cart.length === 0) {
                    cartContainer.innerHTML = '<p>Il carrello è vuoto.</p>';
                    totalPriceElement.textContent = '€0.00';
                }

                // Salva il carrello aggiornato nel localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
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
            // Qui puoi gestire la logica per il pagamento, ad esempio redirigere l'utente a una pagina di pagamento
            alert('Procediamo con il pagamento!');
        }
    });
});
