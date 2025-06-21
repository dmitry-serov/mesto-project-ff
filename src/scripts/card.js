// создание карточки
export function createCardElement(card, cardTemplate, onDelete, onClickLike, onClickImage) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true); // создаем карточку из шаблона
    const deleteButton = cardElement.querySelector('.card__delete-button'); // кнопка удаления карточки
    const cardImage = cardElement.querySelector('.card__image'); // изображение на карточке
    const cardTitle = cardElement.querySelector('.card__title'); // название карточки
    
    // наполняем карточку
    cardTitle.textContent = card.name;
    cardImage.src = card.link;
    cardImage.alt = card.name;

    // добавляем обработчики
    deleteButton.addEventListener('click', () => onDelete(cardElement));
    cardImage.addEventListener('click', onClickImage);
    onClickLike(cardElement);

    return cardElement;
}

// удаление карточки
export function deleteCardElement(cardElement) {
    cardElement.remove();
}

// функция для добавления обработчика лайка
export function onClickLike (cardElement) {
    const likeButton = cardElement.querySelector('.card__like-button');
    likeButton.addEventListener('click', evt =>{
    evt.target.classList.toggle('card__like-button_is-active');
    });
}