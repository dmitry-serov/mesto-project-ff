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
const popupImage = modalTypeImage.querySelector('.popup__image'); // изображение в попапе с фото
const popupCaption = modalTypeImage.querySelector('.popup__caption'); // подпись в попапе с фото

const formEditProfile = document.forms['edit-profile']; // форма для редактирования профиля
const nameInput = formEditProfile.elements['name']; // инпут имени в этой форме
const jobInput = formEditProfile.elements['description']; // инпут описания в этой форме
const formNewCard = document.forms['new-place']; // форма для добавления карточки

// функция для обработки клика по изображению в карточке
const onClickImage = evt => {
    openModal(modalTypeImage);
    popupImage.src = evt.target.src;
    popupImage.alt = `Фотография места: ${evt.target.alt}`;
    popupCaption.textContent = evt.target.alt;
}

// Создание начальных карточек
initialCards.forEach((cardData) => {
    const cardElement = createCardElement(cardData, cardTemplate, deleteCardElement, onClickLike, onClickImage);
    cardsList.append(cardElement);
});

// Обработчики для открытия модальных окон
profileAddButton.addEventListener('click', () => openModal(modalTypeNewCard));
profileEditButton.addEventListener('click', () => {
    openModal(modalTypeEditProfile); // открываем окно
    // заполняем поля формы
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
});

// функция для обработчика отправки форм
const handleFormSubmit = evt => {
    evt.preventDefault(); // отменяем стандартную отправку формы
    const form = evt.target; // элемент формы
    const formName = form.getAttribute('name'); // имя этой формы
    // если это форма редактирования профиля
    if (formName === 'edit-profile') {
        // инпуты формы
        const nameInput = form.elements['name'].value;
        const jobInput = form.elements['description'].value;
        // сохраняем изменения значений
        profileTitle.textContent = nameInput;
        profileDescription.textContent = jobInput;
    }
    // если это форма добавления карточки
    if (formName === 'new-place') {
        // значения инпутов
        let placeName = form.elements['place-name'].value;
        let link = form.elements['link'].value;
        // cоздаем объект со значениями инпутов
        const newCardData = {
            name: placeName,
            link: link
        };
        const newCard = createCardElement(newCardData, cardTemplate, deleteCardElement, onClickLike, onClickImage); // создаем элемент карточки из шаблона
        cardsList.prepend(newCard); // добавляем новую карточку
        form.reset(); // очищаем инпуты
    }
    closeModal(evt.target.closest('.popup')); // закрываем форму
}

// добавляем обработчики отправки форм
formEditProfile.addEventListener('submit', handleFormSubmit);
formNewCard.addEventListener('submit', handleFormSubmit);