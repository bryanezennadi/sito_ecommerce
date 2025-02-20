async function fetchLibriViviData() {
    try {
        // Fetch del file JSON
        const response = await fetch('../altre_pagine/dataHome.json');
        if (!response.ok) {
            throw new Error('Errore nel caricamento del file JSON: ' + response.statusText);
        }

        const data = await response.json();

        // Verifica della struttura dei dati JSON
        if (!data.title || !data.titolo2 || !Array.isArray(data.navbar)) {
            throw new Error('Il formato dei dati JSON non è corretto');
        }

        // Aggiorna il titolo principale e secondario
        document.getElementById('titolohome').textContent = data.title;
        document.getElementById('titolohome2').textContent = data.titolo2;

        let i = 0;
        // Genera dinamicamente la navbar
        const navbar = document.getElementById('navbar');
        navbar.innerHTML = data.navbar.map(item => {
            i++

            if (!item.name || !item.link) {
                console.warn('Elemento navbar incompleto:', item);
                return ''; // Non renderizzare voci incomplete
            }
            if (i == 1) {
                return `<li class="nav-item"><a class="nav-link active" href="${item.link}">${item.name}</a></li>`;
            } else {
                return `
                <li class="nav-item">
                    <a class="nav-link" href="${item.link}">${item.name}</a>
                </li>`;
            }
        }).join('');

        // Aggiungi il logo
        document.getElementById('logo').innerHTML = `<img class="logo" src="${data.logo}" alt="Logo">`;

        // Aggiungi l'intestazione
        document.getElementById('intestazione').textContent = data.intestazione;
        document.getElementById('intestazione').classList.add('titolo');
        document.getElementById('titolohome').classList.add('titolo');
        document.getElementById('titolohome2').classList.add('titolo');

        // Aggiungi il banner con l'offerta speciale
        const bannerOfferta = document.getElementById('banner-offerta');
        bannerOfferta.innerHTML = `
            <div class="banner-offerta">
                <h2>Offerta speciale: <strong>Prendi 3, paghi 2!</strong></h2>
            </div>
        `;
        bannerOfferta.style.backgroundColor = "#ffcc00"; // colore di sfondo del banner
        bannerOfferta.style.padding = "10px 20px"; // padding per il banner
        bannerOfferta.style.textAlign = "center"; // centra il testo
        bannerOfferta.style.fontSize = "18px"; // dimensione del testo
        bannerOfferta.style.fontWeight = "bold"; // rende il testo più marcato
        bannerOfferta.style.color = "#fff"; // colore del testo bianco
        bannerOfferta.style.borderRadius = "5px"; // bordi arrotondati

    } catch (error) {
        // Gestione degli errori
        console.error('Errore:', error);
        // Puoi anche visualizzare un messaggio di errore all'utente, se necessario
        alert('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
    }
}

// Chiamata alla funzione al caricamento della pagina
document.addEventListener('DOMContentLoaded', fetchLibriViviData);
