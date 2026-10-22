// URLs de vos deux backends (Partie 8)
const PRIMARY_API_URL = 'https://votre-backend-railway.railway.app/api';
const SECONDARY_API_URL = 'https://votre-backend-vercel.vercel.app/api';

// Récupération des éléments HTML
const form = document.getElementById('item-form');
const input = document.getElementById('item-name');
const list = document.getElementById('items-list');
const errorMessage = document.getElementById('error-message');

function showMessage(message, isError = true) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    if (isError) {
        errorMessage.classList.add('error');
    } else {
        errorMessage.classList.remove('error');
    }
}

function hideMessage() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

// Fonction fetch avec bascule automatique et AbortController (Délai maximal)
async function fetchWithFallback(endpoint, options = {}) {
    const timeout = 5000; // 5 secondes de délai maximal

    // 1. Essayer le backend principal
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${PRIMARY_API_URL}${endpoint}`, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            return response;
        }
    } catch (error) {
        console.warn('Backend principal injoignable, bascule vers le secours...', error);
    }

    // 2. Essayer le backend secondaire (secours) si le principal échoue
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${SECONDARY_API_URL}${endpoint}`, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            return response;
        }
        throw new Error('Erreur HTTP sur le backend de secours : ' + response.status);
    } catch (error) {
        console.error('Tous les backends sont indisponibles :', error);
        throw new Error('Impossible de joindre les serveurs. Vérifiez votre connexion.');
    }
}

// Charger les éléments depuis MongoDB avec la logique de bascule
async function loadItems() {
    hideMessage();
    list.innerHTML = '<li>Chargement...</li>';

    try {
        const response = await fetchWithFallback('/items');
        const items = await response.json();

        list.innerHTML = '';

        if (items.length === 0) {
            list.innerHTML = '<li>Aucun élément pour le moment.</li>';
            return;
        }

        items.forEach(function(item) {
            const li = document.createElement('li');
            li.textContent = item.name;
            list.appendChild(li);
        });

    } catch (error) {
        console.error('Erreur de chargement :', error);
        list.innerHTML = '';
        showMessage('Impossible de charger les éléments. Vérifiez que le backend fonctionne.');
    }
}

// Ajouter un élément avec la logique de bascule
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    hideMessage();

    const name = input.value.trim();

    if (name === '') {
        showMessage('Veuillez saisir un nom.');
        return;
    }

    try {
        const response = await fetchWithFallback('/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Erreur lors de l’ajout.');
        }

        input.value = '';
        showMessage('Élément ajouté avec succès !', false);

        await loadItems();

    } catch (error) {
        console.error('Erreur d’ajout :', error);
        showMessage(error.message || 'Impossible d’ajouter cet élément.');
    }
});

// Charger la liste au démarrage de la page
loadItems();