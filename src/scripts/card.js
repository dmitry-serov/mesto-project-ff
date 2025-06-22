// создание карточки
export const createCardElement = ({card, cardTemplate, onDelete, onClickLike, onClickImage}) => {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true); // создаем карточку из шаблона
    const deleteButton = cardElement.querySelector('.card__delete-button'); // кнопка удаления карточки
    const cardImage = cardElement.querySelector('.card__image'); // изображение на карточке
    const cardTitle = cardElement.querySelector('.card__title'); // название карточки
    const likeButton = cardElement.querySelector('.card__like-button'); // иконка лайка
    
    // наполняем карточку
    cardTitle.textContent = card.name;
    cardImage.src = card.link;
    cardImage.alt = card.name;

    // добавляем обработчики
    deleteButton.addEventListener('click', () => onDelete(cardElement));
    cardImage.addEventListener('click', onClickImage);
    likeButton.addEventListener('click', onClickLike);

    return cardElement;
}

// удаление карточки
export const deleteCardElement = cardElement => {
    cardElement.remove();
}

// функция для добавления обработчика лайка
export const onClickLike = evt => {
    evt.target.classList.toggle('card__like-button_is-active');
}