//index.js

import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCardElement, deleteCardElement } from './card.js';
import { openModal, closeModal } from './modal.js';

const cardsList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

const profileAddButton = document.querySelector('.profile__add-button');
const profileEditButton = document.querySelector('.profile__edit-button');

const modalNewCard = document.querySelector('.popup_type_new-card');
const modalEditProfile = document.querySelector('.popup_type_edit');
const modalImage = document.querySelector('.popup_type_image');

initialCards.forEach((cardData) => {
    const cardElement = createCardElement(cardData, cardTemplate, deleteCardElement);
    cardsList.append(cardElement);
});

profileAddButton.addEventListener('click', () => openModal(modalNewCard));
profileEditButton.addEventListener('click', () => openModal(modalEditProfile));
cardsList.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('card__image')) {
        const popupImage = document.querySelector('.popup__image');
        popupImage.src = evt.target.src;
        openModal(modalImage);
    }
});