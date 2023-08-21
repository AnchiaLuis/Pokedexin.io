const cardForm = document.getElementById('cardForm');
const cardTableBody = document.querySelector('#cardTable tbody');
const searchButton = document.getElementById('searchButton');
const searchTermInput = document.getElementById('searchTerm');
const loadCardsButton = document.getElementById('loadCards');

function createCard(event) {
  event.preventDefault();

  const cardData = {
    type: document.getElementById('cardType').value,
    name: document.getElementById('cardName').value,
    description: document.getElementById('cardDescription').value,
    battlePoints: parseInt(document.getElementById('cardBattlePoints').value),
  };

  $.ajax({
    type: 'POST',
    url: '/pokemon',
    data: JSON.stringify(cardData),
    contentType: 'application/json',
    success: function (data) {
      showMessage('Pokémon registrado exitosamente', 'success');
      loadCards();
      cardForm.reset();
    },
    error: function (error) {
      showMessage('Error al registrar el Pokémon', 'error');
    },
  });
}

function loadCards() {
  $.ajax({
    type: 'GET',
    url: '/pokemon',
    success: function (data) {
      cardTableBody.innerHTML = '';

      data.forEach((card) => {
        const newRow = cardTableBody.insertRow();

        newRow.innerHTML = `
          <td>${card.type}</td>
          <td>${card.name}</td>
          <td>${card.description}</td>
          <td>${card.battlePoints}</td>
        `;

        newRow.addEventListener('click', () => {
          showEditForm(card);
        });
      });
    },
    error: function (error) {
      showMessage('Error al cargar los Pokémones', 'error');
    },
  });
}

function searchCards() {
  const searchTerm = searchTermInput.value.trim();

  $.ajax({
    type: 'GET',
    url: `/pokemon?search=${encodeURIComponent(searchTerm)}`,
    success: function (data) {
      cardTableBody.innerHTML = '';

      data.forEach((card) => {
        const newRow = cardTableBody.insertRow();

        newRow.innerHTML = `
          <td>${card.type}</td>
          <td>${card.name}</td>
          <td>${card.description}</td>
          <td>${card.battlePoints}</td>
        `;

        newRow.addEventListener('click', () => {
          showEditForm(card);
        });
      });

      showMessage(`${data.length} Pokémones encontrados`, 'success');
    },
    error: function (error) {
      showMessage('Error al buscar los Pokémones', 'error');
    },
  });
}

function showMessage(message, type) {
  const messageDiv = document.getElementById('message');
  messageDiv.textContent = message;
  messageDiv.className = type;
}

function showEditForm(card) {
  const editCardForm = document.getElementById('editCardForm');
  const editCardType = document.getElementById('editCardType');
  const editCardName = document.getElementById('editCardName');
  const editCardDescription = document.getElementById('editCardDescription');
  const editCardBattlePoints = document.getElementById('editCardBattlePoints');
  const updateCardButton = document.getElementById('updateCardButton');
  const deleteCardButton = document.getElementById('deleteCardButton');

  editCardType.value = card.type;
  editCardName.value = card.name;
  editCardDescription.value = card.description;
  editCardBattlePoints.value = card.battlePoints;

  editCardForm.style.display = 'block';
  cardForm.style.display = 'none';

  updateCardButton.addEventListener('click', () => {
    const updatedCardData = {
      type: editCardType.value,
      name: editCardName.value,
      description: editCardDescription.value,
      battlePoints: parseInt(editCardBattlePoints.value),
    };

    $.ajax({
      type: 'PUT',
      url: `/pokemon/${card._id}`,
      data: JSON.stringify(updatedCardData),
      contentType: 'application/json',
      success: function (data) {
        showMessage('Pokémon actualizado exitosamente', 'success');
        loadCards();
        hideEditForm();
      },
      error: function (error) {
        showMessage('Error al actualizar el Pokémon', 'error');
      },
    });
  });

  deleteCardButton.addEventListener('click', () => {
    $.ajax({
      type: 'DELETE',
      url: `/pokemon/${card._id}`,
      success: function (data) {
        showMessage('Pokémon eliminado exitosamente', 'success');
        loadCards();
        hideEditForm();
      },
      error: function (error) {
        showMessage('Error al eliminar el Pokémon', 'error');
      },
    });
  });
}

function hideEditForm() {
  const editCardForm = document.getElementById('editCardForm');
  const updateCardButton = document.getElementById('updateCardButton');
  const deleteCardButton = document.getElementById('deleteCardButton');

  editCardForm.reset();

  editCardForm.style.display = 'none';
  cardForm.style.display = 'block';

  updateCardButton.removeEventListener('click', () => {});
  deleteCardButton.removeEventListener('click', () => {});
}
cardForm.addEventListener('submit', createCard);
searchButton.addEventListener('click', searchCards);
loadCardsButton.addEventListener('click', loadCards);

