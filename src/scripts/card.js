//card.js

export function createCardElement(card, cardTemplate, onDelete) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
    const deleteButton = cardElement.querySelector('.card__delete-button');
    cardElement.querySelector('.card__title').textContent = card.name;
    cardElement.querySelector('.card__image').src = card.link;
    deleteButton.addEventListener('click', () => onDelete(cardElement));
    return cardElement;
}
export function deleteCardElement(cardElement) {
    cardElement.remove();
}