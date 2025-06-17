import { initialCards } from './cards.js';

// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы

// @todo: Функция создания карточки
function createCardElement(card, onDelete) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
    const deleteButton = cardElement.querySelector('.card__delete-button');
    cardElement.querySelector('.card__title').textContent = card.name;
    cardElement.querySelector('.card__image').src = card.link;
    deleteButton.addEventListener('click', () => onDelete(cardElement));
    return cardElement;
}
// @todo: Функция удаления карточки
function deleteCardElement(cardElement) {
    cardElement.remove();
}
// @todo: Вывести карточки на страницу
const cardsList = document.querySelector('.places__list');
initialCards.forEach((cardData) => {
    const cardElement = createCardElement(cardData, deleteCardElement);
    cardsList.append(cardElement);
});