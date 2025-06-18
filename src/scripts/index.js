//index.js

import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCardElement, deleteCardElement } from './card.js';
import { openModal, closeModal } from './modal.js';

const cardsList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

initialCards.forEach((cardData) => {
    const cardElement = createCardElement(cardData, cardTemplate, deleteCardElement);
    cardsList.append(cardElement);
});