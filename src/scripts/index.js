import '../pages/index.css';
import { createCardElement, deleteCardElement, onClickLike } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getInitialCards, getUserInfo } from './api.js';

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
const placeName = formNewCard.elements['place-name']; // инпут места в этой форме
const link = formNewCard.elements['link']; // инпут ссылки на фото в этой форме


// функция для обработки клика по изображению в карточке
const onClickImage = evt => {
    openModal(modalTypeImage);
    popupImage.src = evt.target.src;
    popupImage.alt = `Фотография места: ${evt.target.alt}`;
    popupCaption.textContent = evt.target.alt;
}

// Создание начальных карточек
getInitialCards()
    .then(cards => {
        cards.forEach(card => {
            const cardElement = createCardElement({
                card: card,
                cardTemplate: cardTemplate,
                onDelete: deleteCardElement,
                onClickLike: onClickLike,
                onClickImage: onClickImage
            });
            cardsList.append(cardElement);
        });
    })
    .catch((err) => {
        console.log(err); // выводим ошибку в консоль
    });

getUserInfo();

// объект конфигурации для валидации форм
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active'
};

enableValidation(validationConfig); // включаем валидацию форм

// Обработчики для открытия модальных окон
profileAddButton.addEventListener('click', () => {
    openModal(modalTypeNewCard);
    clearValidation(modalTypeNewCard, validationConfig);
});
profileEditButton.addEventListener('click', () => {
    openModal(modalTypeEditProfile); // открываем окно
    clearValidation(modalTypeEditProfile, validationConfig);
    // заполняем поля формы
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
});

// обработка сабмита для формы редактирования профиля
const handleEditProfileSubmit = evt => {
    evt.preventDefault(); // отменяем стандартную отправку формы
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    closeModal(evt.target.closest('.popup')); // закрываем форму
}

// обработка сабмита для формы новой карточки
const handleNewCardSubmit = evt => {
    evt.preventDefault(); // отменяем стандартную отправку формы
    // cоздаем объект со значениями инпутов
    const newCardData = {
        name: placeName.value,
        link: link.value
    };
    // создаем элемент карточки из шаблона
    const newCard = createCardElement({
        card: newCardData,
        cardTemplate: cardTemplate,
        onDelete: deleteCardElement,
        onClickLike: onClickLike,
        onClickImage: onClickImage
    });
    cardsList.prepend(newCard); // добавляем новую карточку
    evt.target.reset(); // очищаем инпуты
    closeModal(evt.target.closest('.popup')); // закрываем форму
}

// добавляем обработчики отправки форм
formEditProfile.addEventListener('submit', handleEditProfileSubmit);
formNewCard.addEventListener('submit', handleNewCardSubmit);