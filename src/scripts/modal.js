export function openModal(modalElement) {
    modalElement.classList.add('popup_is-opened');
    const closeIcon = modalElement.querySelector('.popup__close');
    closeIcon.addEventListener('click', () => closeModal(modalElement));
}

export function closeModal(modalElement) {
    modalElement.classList.remove('popup_is-opened');
}