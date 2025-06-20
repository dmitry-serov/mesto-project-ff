//index.js

import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCardElement, deleteCardElement } from './card.js';
import { openModal, closeModal } from './modal.js';

const cardsList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

const profileAddButton = document.querySelector('.profile__add-button');
const profileEditButton = document.querySelector('.profile__edit-button');

const modalTypeNewCard = document.querySelector('.popup_type_new-card');
const modalTypeEditProfile = document.querySelector('.popup_type_edit');
const modalTypeImage = document.querySelector('.popup_type_image');

//Создание начальных карточек
initialCards.forEach((cardData) => {
    const cardElement = createCardElement(cardData, cardTemplate, deleteCardElement);
    cardsList.append(cardElement);
});

//Обработчики открытия
profileAddButton.addEventListener('click', () => openModal(modalTypeNewCard));
profileEditButton.addEventListener('click', () => openModal(modalTypeEditProfile));
cardsList.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('card__image')) {
        openModal(modalTypeImage);
        modalTypeImage.querySelector('.popup__image').src = evt.target.src;
        modalTypeImage.querySelector('.popup__caption').textContent = evt.target.alt;
    }
});