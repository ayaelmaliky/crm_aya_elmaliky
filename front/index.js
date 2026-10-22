
const API_URL = 'http://localhost:3000/api/items';

// Récupération des éléments HTML
const form = document.getElementById('item-form');
const input = document.getElementById('item-name');
const list = document.getElementById('items-list');
const errorMessage = document.getElementById('error-message');

// Afficher un message
function showMessage(message, isError = true) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');

    if (isError) {
        errorMessage.classList.add('error');
    } else {
        errorMessage.classList.remove('error');
    }
}

// Masquer le message
function hideMessage() {
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
}

// Charger les éléments depuis MongoDB
async function loadItems() {
    hideMessage();
    list.innerHTML = '<li>Chargement...</li>';

    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Erreur HTTP : ' + response.status);
        }

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
        showMessage(
            'Impossible de charger les éléments. Vérifiez que le backend fonctionne.'
        );
    }
}

// Ajouter un élément
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    hideMessage();

    const name = input.value.trim();

    if (name === '') {
        showMessage('Veuillez saisir un nom.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
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
        showMessage(
            error.message || 'Impossible d’ajouter cet élément.'
        );
    }
});

// Charger la liste au démarrage
loadItems();
