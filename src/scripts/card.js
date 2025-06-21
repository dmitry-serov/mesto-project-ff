//card.js

export function createCardElement(card, cardTemplate, onDelete, onClickLike, onClickImage) {
    const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    cardTitle.textContent = card.name;
    cardImage.src = card.link;
    cardImage.alt = card.name;
    deleteButton.addEventListener('click', () => onDelete(cardElement));
    cardImage.addEventListener('click', onClickImage);
    onClickLike(cardElement);
    return cardElement;
}
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