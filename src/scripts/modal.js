// открытие модального окна
export const openModal = modalElement => {
    modalElement.classList.add('popup_is-opened'); // добавляем класс для открытия
    // добавляем обработчики
    modalElement.addEventListener('click', onClickOutside);
    modalElement.querySelector('.popup__close').addEventListener('click', onClickCloseButton);
    document.addEventListener('keydown', onEscape);
}

// закрытие модального окна
export const closeModal = modalElement => {
    modalElement.classList.remove('popup_is-opened');
    // снимаем обработчики
    modalElement.removeEventListener('click', onClickOutside);
    modalElement.querySelector('.popup__close').removeEventListener('click', onClickCloseButton);
    document.removeEventListener('keydown', onEscape);

}

// обработчик клика по оверлею
const onClickOutside = evt => {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

// обработчик нажатия Esc
const onEscape = evt => {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        // проверяем, чтобы работало только при открытом окне
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}

// обработчик клика по крестику
const onClickCloseButton = evt => {
    const openedPopup = evt.target.closest('.popup');
    closeModal(openedPopup);
}