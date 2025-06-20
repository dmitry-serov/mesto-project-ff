//modal.js

export function openModal(modalElement) {
    modalElement.classList.add('popup_is-opened');

    modalElement.addEventListener('click', onClickOutside);
    modalElement.querySelector('.popup__close').addEventListener('click', onClickCloseButton);
    document.addEventListener('keydown', onEscape);
}

export function closeModal(modalElement) {
    modalElement.classList.remove('popup_is-opened');

    modalElement.removeEventListener('click', onClickOutside);
    modalElement.querySelector('.popup__close').removeEventListener('click', onClickCloseButton);
    document.removeEventListener('keydown', onEscape);

}

function onClickOutside(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

function onEscape(evt) {
    if (evt.key === 'Escape') {
        const openedPopup = document.querySelector('.popup_is-opened');
        if (openedPopup) {
            closeModal(openedPopup);
        }
    }
}

function onClickCloseButton(evt) {
    const openedPopup = evt.target.closest('.popup');
    closeModal(openedPopup);
}