//index.js

import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCardElement, deleteCardElement } from './card.js';
import { openModal, closeModal } from './modal.js';

const cardsList = document.querySelector('.places__list');
const cardTemplate = document.querySelector('#card-template').content;

const profileInfo = document.querySelector('.profile__info');
const profileAddButton = document.querySelector('.profile__add-button');
const profileEditButton = document.querySelector('.profile__edit-button');

const modalTypeNewCard = document.querySelector('.popup_type_new-card');
const modalTypeEditProfile = document.querySelector('.popup_type_edit');
const modalTypeImage = document.querySelector('.popup_type_image');

const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const formNewCard = document.querySelector('.popup__form[name="new-place"]');

//Создание начальных карточек
initialCards.forEach((cardData) => {
    const cardElement = createCardElement(cardData, cardTemplate, deleteCardElement);
    cardsList.append(cardElement);
});

//Обработчики открытия
profileAddButton.addEventListener('click', () => openModal(modalTypeNewCard));
profileEditButton.addEventListener('click', () => {
    openModal(modalTypeEditProfile);
    const name = modalTypeEditProfile.querySelector('.popup__input_type_name');
    const description = modalTypeEditProfile.querySelector('.popup__input_type_description');
    name.value = profileInfo.querySelector('.profile__title').textContent;
    description.value = profileInfo.querySelector('.profile__description').textContent;
});
cardsList.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('card__image')) {
        openModal(modalTypeImage);
        modalTypeImage.querySelector('.popup__image').src = evt.target.src;
        modalTypeImage.querySelector('.popup__caption').textContent = evt.target.alt;
    }
});