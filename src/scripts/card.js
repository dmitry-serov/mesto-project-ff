// создание карточки
const isLiked = (card, currentUserId) => {
  return card.likes.some((like) => like._id === currentUserId);
};

export const createCardElement = ({
  card,
  cardTemplate,
  onClickDelete,
  onClickLike,
  onClickImage,
  isOwnCard,
  currentUserId,
}) => {
  const cardElement = cardTemplate
    .querySelector('.places__item')
    .cloneNode(true); // создаем карточку из шаблона
  const deleteButton = cardElement.querySelector('.card__delete-button'); // кнопка удаления карточки
  const cardImage = cardElement.querySelector('.card__image'); // изображение на карточке
  const cardTitle = cardElement.querySelector('.card__title'); // название карточки
  const likeButton = cardElement.querySelector('.card__like-button'); // иконка лайка
  const likeCount = cardElement.querySelector('.card__like-count'); // счетчик лайков

  // наполняем карточку
  cardTitle.textContent = card.name;
  cardImage.src = card.link;
  cardImage.alt = card.name;
  likeCount.textContent = card.likes.length;
  if (isLiked(card, currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  cardImage.addEventListener('click', onClickImage);
  likeButton.addEventListener('click', (evt) => onClickLike(evt, card._id));
  if (isOwnCard) {
    deleteButton.addEventListener('click', () =>
      onClickDelete(cardElement, card._id)
    );
  } else {
    deleteButton.classList.add('card__delete-button_hidden');
  }

  return cardElement;
};

// удаление карточки
export const deleteCardElement = (cardElement) => {
  cardElement.remove();
};
