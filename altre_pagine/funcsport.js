async function fetchLibriViviData() {
    try {
        // Fetch del file JSON
        const response = await fetch('../altre_pagine/dataSport.json');
        if (!response.ok) {
            throw new Error('Errore nel caricamento del file JSON: ' + response.statusText);
        }

        const data = await response.json();


        // Aggiorna il titolo principale e secondario
        let i=0;
        // Genera dinamicamente la navbar
        const navbar = document.getElementById('navbar');
        navbar.innerHTML = data.navbar.map(item => {
           
            i++
            
            if (!item.name || !item.link) {
                console.warn('Elemento navbar incompleto:', item);
                return ''; // Non renderizzare voci incomplete
            } if(i==3){
                
                return `<li class="nav-item"><a class="nav-link active" href="${item.link}">${item.name}</a></li>`;
                
            }
            else{
                return `
                <li class="nav-item">
                    <a class="nav-link" href="${item.link}">${item.name}</a>
                </li>`;
            }
           
            
        }).join('');
        document.getElementById('logo').innerHTML = `<img  class= "logo" src="${data.logo}" alt="Logo">`;
        document.getElementById('titolosport').classList.add('titolo');
        document.getElementById('titolosport').textContent = data.title;
        document.getElementById('titolosport2').classList.add('titolo');
        document.getElementById('titolosport2').textContent = data.title2;

    } catch (error) {
        // Gestione degli errori
        console.error('Errore:', error);
        // Puoi anche visualizzare un messaggio di errore all'utente, se necessario
        alert('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
    }


}

// Chiamata alla funzione al caricamento della pagina
document.addEventListener('DOMContentLoaded', fetchLibriViviData);
