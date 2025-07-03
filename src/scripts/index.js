import '../pages/index.css';
import { createCardElement, deleteCardElement, onClickLike } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import { getInitialCards, getUserInfo, updateUserInfo, addCard, deleteCard } from './api.js';

const cardsList = document.querySelector('.places__list'); // место для карточек
const cardTemplate = document.querySelector('#card-template').content; // шаблон карточки
const profileAddButton = document.querySelector('.profile__add-button'); // кнопка для добавления карточки
const profileTitle = document.querySelector('.profile__title'); // имя в профиле
const profileDescription = document.querySelector('.profile__description'); // описание в профиле
const profileImage = document.querySelector('.profile__image'); // фото в профиле
const profileEditButton = document.querySelector('.profile__edit-button'); // кнопка для редактирования профиля
const modalTypeNewCard = document.querySelector('.popup_type_new-card'); // попап для добавления карточки
const modalTypeEditProfile = document.querySelector('.popup_type_edit'); // попап для редактирования профиля
const modalTypeDeleteCard = document.querySelector('.popup_type_delete-card'); // попап для удаления карточки
const modalTypeImage = document.querySelector('.popup_type_image'); // попап с фото из карточки
const popupImage = modalTypeImage.querySelector('.popup__image'); // изображение в попапе с фото
const popupCaption = modalTypeImage.querySelector('.popup__caption'); // подпись в попапе с фото

const formEditProfile = document.forms['edit-profile']; // форма для редактирования профиля
const nameInput = formEditProfile.elements['name']; // инпут имени в этой форме
const jobInput = formEditProfile.elements['description']; // инпут описания в этой форме
const formNewCard = document.forms['new-place']; // форма для добавления карточки
const placeName = formNewCard.elements['place-name']; // инпут места в этой форме
const link = formNewCard.elements['link']; // инпут ссылки на фото в этой форме
const formDeleteCard = document.forms['delete-confirm']; // форма для удаления карточки

// переменная для хранения ссылки на карточку и её ID для удаления
let cardToDelete = null;

// функция для обработки клика по изображению в карточке
const onClickImage = evt => {
    openModal(modalTypeImage);
    popupImage.src = evt.target.src;
    popupImage.alt = `Фотография места: ${evt.target.alt}`;
    popupCaption.textContent = evt.target.alt;
}

// обработка сабмита для формы удаления карточки
const handleDeleteCardSubmit = evt => {
    evt.preventDefault(); // отменяем стандартную отправку формы
    
    if (cardToDelete) {
        // отправляем запрос на удаление карточки
        deleteCard(cardToDelete.id)
            .then(() => {
                // если запрос успешен, удаляем карточку из DOM
                deleteCardElement(cardToDelete.element);
                cardToDelete = null; // очищаем ссылку
            })
            .catch(error => {
                console.error('Ошибка при удалении карточки:', error);
            });
    }
    
    closeModal(evt.target.closest('.popup')); // закрываем форму
}

// функция для обработки клика по кнопке удаления карточки
const onClickDelete = (cardElement, cardId) => {
    cardToDelete = { element: cardElement, id: cardId }; // сохраняем карточку и её ID
    openModal(modalTypeDeleteCard);
}

// загружаем данные пользователя и карточки одновременно
Promise.all([getUserInfo(), getInitialCards()])
    .then(([user, cards]) => {
        // обновляем профиль пользователя
        profileTitle.textContent = user.name;
        profileDescription.textContent = user.about;
        profileImage.style.backgroundImage = `url('${user.avatar}')`;
        
        // создаем карточки
        cards.forEach(card => {
            const cardElement = createCardElement({
                card: card,
                cardTemplate: cardTemplate,
                onClickDelete: (element) => onClickDelete(element, card._id), // передаем ID как параметр
                onClickLike: onClickLike,
                onClickImage: onClickImage,
                isOwnCard: user._id === card.owner._id
            });
            
            cardsList.append(cardElement);
        });
    })
    .catch(error => console.error(error)); // выводим ошибку в консоль

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

    updateUserInfo(nameInput.value, jobInput.value)
        .then(user => {
            profileTitle.textContent = user.name;
            profileDescription.textContent = user.about;
        })
        .catch(error => console.error(error));

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

    addCard(newCardData)
        .then(newCard => {
            // создаем элемент карточки из шаблона
            const newCardElement = createCardElement({
                card: newCard,
                cardTemplate: cardTemplate,
                onClickDelete: (element) => onClickDelete(element, newCard._id), // передаем ID как параметр
                onClickLike: onClickLike,
                onClickImage: onClickImage,
                isOwnCard: true
            });
            
            cardsList.prepend(newCardElement); // добавляем новую карточку
            evt.target.reset(); // очищаем инпуты
            closeModal(evt.target.closest('.popup')); // закрываем форму
        })
        .catch(error => console.error('Ошибка при добавлении карточки:', error));
}

// добавляем обработчики отправки форм
formEditProfile.addEventListener('submit', handleEditProfileSubmit);
formNewCard.addEventListener('submit', handleNewCardSubmit);
formDeleteCard.addEventListener('submit', handleDeleteCardSubmit); // добавляем обработчик для формы удаления