//index.js

import '../pages/index.css';
import { initialCards } from './cards.js';
import { createCardElement, deleteCardElement, onClickLike } from './card.js';
import { openModal, closeModal } from './modal.js';

const cardsList = document.querySelector('.places__list'); // место для карточек
const cardTemplate = document.querySelector('#card-template').content; // шаблон карточки
const profileAddButton = document.querySelector('.profile__add-button'); // кнопка для добавления карточки
const profileTitle = document.querySelector('.profile__title'); // имя в профиле
const profileDescription = document.querySelector('.profile__description'); // описание в профиле
const profileEditButton = document.querySelector('.profile__edit-button'); // кнопка для редактирования профиля
const modalTypeNewCard = document.querySelector('.popup_type_new-card'); // попап для добавления карточки
const modalTypeEditProfile = document.querySelector('.popup_type_edit'); // попап для редактирования профиля
const modalTypeImage = document.querySelector('.popup_type_image'); // попап с фото из карточки

const formEditProfile = document.forms['edit-profile']; // форма для редактирования профиля
const formNewCard = document.forms['new-place']; // форма для добавления карточки

// Создание начальных карточек
initialCards.forEach((cardData) => {
    const cardElement = createCardElement(cardData, cardTemplate, deleteCardElement, onClickLike, onClickImage);
    cardsList.append(cardElement);
});

// Обработчики открытия
profileAddButton.addEventListener('click', () => openModal(modalTypeNewCard));
profileEditButton.addEventListener('click', () => {
    openModal(modalTypeEditProfile);
    const name = modalTypeEditProfile.querySelector('.popup__input_type_name');
    const description = modalTypeEditProfile.querySelector('.popup__input_type_description');
    name.value = profileTitle.textContent;
    description.value = profileDescription.textContent;
});

// функция для обработчика форм
function handleFormSubmit(evt) {
    evt.preventDefault(); // отменяем стандартную отправку формы
    const form = evt.target; // элемент формы
    const formName = form.getAttribute('name'); // имя формы

    // если это форма редактирования профиля
    if (formName === 'edit-profile') {
        // значения полей
        const nameInput = form.elements['name'].value;
        const jobInput = form.elements['description'].value;
        // вставляем значения полей
        profileTitle.textContent = nameInput;
        profileDescription.textContent = jobInput;
    }

    // если это форма добавления карточки
    if (formName === 'new-place') {
        // значения полей
        let placeName = form.elements['place-name'].value;
        let link = form.elements['link'].value;
        // cоздаем объект с данными карточки
        const newCardData = {
            name: placeName,
            link: link
        };
        const newCard = createCardElement(newCardData, cardTemplate, deleteCardElement, onClickLike, onClickImage); // создаем элемент карточки из шаблона
        cardsList.prepend(newCard); // добавляем новую карточку
        // очищаем инпуты
        form.elements['place-name'].value = '';
        form.elements['link'].value = '';
    }

    closeModal(evt.target.closest('.popup')); // закрываем форму
}

// добавляем обработчики форм
formEditProfile.addEventListener('submit', handleFormSubmit);
formNewCard.addEventListener('submit', handleFormSubmit);


// функция для обработки клика по изображению в карточке
function onClickImage(evt) {
    openModal(modalTypeImage);
    modalTypeImage.querySelector('.popup__image').src = evt.target.src;
    modalTypeImage.querySelector('.popup__caption').textContent = evt.target.alt;
}