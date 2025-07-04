import '../pages/index.css';
import { createCardElement, deleteCardElement } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation, clearValidation } from './validation.js';
import {
  getInitialCards,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
  addCard,
  deleteCard,
  addLike,
  deleteLike,
} from './api.js';

const cardsList = document.querySelector('.places__list'); // место для карточек
const cardTemplate = document.querySelector('#card-template').content; // шаблон карточки
const profileAddButton = document.querySelector('.profile__add-button'); // кнопка для добавления карточки
const profileTitle = document.querySelector('.profile__title'); // имя в профиле
const profileDescription = document.querySelector('.profile__description'); // описание в профиле
const profileImage = document.querySelector('.profile__image'); // фото в профиле
const profileImageContainer = document.querySelector('.profile__image-container'); // контейнер с фото в профиле
const profileEditButton = document.querySelector('.profile__edit-button'); // кнопка для редактирования профиля
const modalTypeNewCard = document.querySelector('.popup_type_new-card'); // попап для добавления карточки
const modalTypeEditProfile = document.querySelector('.popup_type_edit'); // попап для редактирования профиля
const modalTypeDeleteCard = document.querySelector('.popup_type_delete-card'); // попап для удаления карточки
const modalTypeImage = document.querySelector('.popup_type_image'); // попап с фото из карточки
const popupImage = modalTypeImage.querySelector('.popup__image'); // изображение в попапе с фото
const popupCaption = modalTypeImage.querySelector('.popup__caption'); // подпись в попапе с фото
const modalTypeChangeAvatar = document.querySelector('.popup_type_change-avatar'); // попап для изменения аватара

const formEditProfile = document.forms['edit-profile']; // форма для редактирования профиля
const nameInput = formEditProfile.elements['name']; // инпут имени в этой форме
const jobInput = formEditProfile.elements['description']; // инпут описания в этой форме
const formNewCard = document.forms['new-place']; // форма для добавления карточки
const placeName = formNewCard.elements['place-name']; // инпут места в этой форме
const link = formNewCard.elements['link']; // инпут ссылки на фото в этой форме
const formDeleteCard = document.forms['delete-confirm']; // форма для удаления карточки
const formChangeAvatar = document.forms['new-avatar']; // форма для изменения аватара
const avatarLinkInput = formChangeAvatar.elements['link']; // инпут ссылки на аватар в этой форме

let cardToDelete = null; // для хранения карточки и ее id
let currentUserId = null; // для хранения id пользователя

// функция для управления состоянием кнопки во время загрузки
const setButtonLoadingState = (button, isLoading, originalText) => {
  if (isLoading) {
    button.textContent = 'Сохранение...';
    button.disabled = true;
  } else {
    button.textContent = originalText;
    button.disabled = false;
  }
};

// функция для обработки клика по изображению в карточке
const onClickImage = (evt) => {
  openModal(modalTypeImage);
  popupImage.src = evt.target.src;
  popupImage.alt = `Фотография места: ${evt.target.alt}`;
  popupCaption.textContent = evt.target.alt;
};

// обработка сабмита для формы удаления карточки
const handleDeleteCardSubmit = (evt) => {
  evt.preventDefault(); // отменяем стандартную отправку формы

  if (cardToDelete) {
    // отправляем запрос на удаление карточки
    deleteCard(cardToDelete.id)
      .then(() => {
        // если успех, удаляем карточку из DOM
        deleteCardElement(cardToDelete.element);
        cardToDelete = null;
      })
      .catch((error) => {
        console.error('Ошибка при удалении карточки:', error);
      });
  }

  closeModal(evt.target.closest('.popup')); // закрываем форму
};

// функция для обработки клика по кнопке удаления карточки
const onClickDelete = (cardElement, cardId) => {
  cardToDelete = { element: cardElement, id: cardId }; // сохраняем карточку и её ID
  openModal(modalTypeDeleteCard);
};

// обработчик лайка
const handleLikeClick = (evt, cardId) => {
  const likeButton = evt.target;
  const likeCount = evt.target
    .closest('.card__like-section')
    .querySelector('.card__like-count');
  if (likeButton.classList.contains('card__like-button_is-active')) {
    deleteLike(cardId)
      .then((res) => {
        likeButton.classList.remove('card__like-button_is-active');
        likeCount.textContent = res.likes.length;
      })
      .catch(console.error);
  } else {
    addLike(cardId)
      .then((res) => {
        likeButton.classList.add('card__like-button_is-active');
        likeCount.textContent = res.likes.length;
      })
      .catch(console.error);
  }
};

// загружаем данные пользователя и карточки одновременно
Promise.all([getUserInfo(), getInitialCards()])
  .then(([user, cards]) => {
    // обновляем профиль пользователя
    profileTitle.textContent = user.name;
    profileDescription.textContent = user.about;
    profileImage.style.backgroundImage = `url('${user.avatar}')`;
    currentUserId = user._id; // сохраняем id пользователя

    // создаем карточки
    cards.forEach((card) => {
      const cardElement = createCardElement({
        card: card,
        cardTemplate: cardTemplate,
        onClickDelete: (element, id) => onClickDelete(element, id),
        onClickLike: handleLikeClick,
        onClickImage: onClickImage,
        isOwnCard: user._id === card.owner._id,
        currentUserId: currentUserId, // передаем id пользователя
      });

      cardsList.append(cardElement);
    });
  })
  .catch((error) => console.error(error)); // выводим ошибку в консоль

// объект конфигурации для валидации форм
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_inactive',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__input-error_active',
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

profileImageContainer.addEventListener('click', () => {
  openModal(modalTypeChangeAvatar);
  clearValidation(modalTypeChangeAvatar, validationConfig);
});

// обработка сабмита для формы редактирования профиля
const handleEditProfileSubmit = (evt) => {
  evt.preventDefault(); // отменяем стандартную отправку формы

  const submitButton = evt.target.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  setButtonLoadingState(submitButton, true, originalText);

  updateUserInfo(nameInput.value, jobInput.value)
    .then((user) => {
      profileTitle.textContent = user.name;
      profileDescription.textContent = user.about;
      closeModal(evt.target.closest('.popup')); // закрываем форму
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setButtonLoadingState(submitButton, false, originalText);
    });
};

// обработка сабмита для формы изменения аватара
const handleChangeAvatarSubmit = (evt) => {
  evt.preventDefault(); // отменяем стандартную отправку формы

  const submitButton = evt.target.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  setButtonLoadingState(submitButton, true, originalText);

  updateUserAvatar(avatarLinkInput.value)
    .then((user) => {
      profileImage.style.backgroundImage = `url('${user.avatar}')`;
      evt.target.reset(); // очищаем инпуты
      closeModal(evt.target.closest('.popup')); // закрываем форму
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setButtonLoadingState(submitButton, false, originalText);
    });
};

// обработка сабмита для формы новой карточки
const handleNewCardSubmit = (evt) => {
  evt.preventDefault(); // отменяем стандартную отправку формы

  const submitButton = evt.target.querySelector('.popup__button');
  const originalText = submitButton.textContent;

  setButtonLoadingState(submitButton, true, originalText);

  // cоздаем объект со значениями инпутов
  const newCardData = {
    name: placeName.value,
    link: link.value,
  };

  addCard(newCardData)
    .then((newCard) => {
      // создаем элемент карточки из шаблона
      const newCardElement = createCardElement({
        card: newCard,
        cardTemplate: cardTemplate,
        onClickDelete: (element, id) => onClickDelete(element, id),
        onClickLike: handleLikeClick,
        onClickImage: onClickImage,
        isOwnCard: true,
        currentUserId: currentUserId, // передаем id пользователя
      });

      cardsList.prepend(newCardElement); // добавляем новую карточку
      evt.target.reset(); // очищаем инпуты
      closeModal(evt.target.closest('.popup')); // закрываем форму
    })
    .catch((error) => {
      console.error('Ошибка при добавлении карточки:', error);
    })
    .finally(() => {
      setButtonLoadingState(submitButton, false, originalText);
    });
};

// добавляем обработчики отправки форм
formEditProfile.addEventListener('submit', handleEditProfileSubmit);
formNewCard.addEventListener('submit', handleNewCardSubmit);
formDeleteCard.addEventListener('submit', handleDeleteCardSubmit);
formChangeAvatar.addEventListener('submit', handleChangeAvatarSubmit);
