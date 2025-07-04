// функция для отображения текста ошибки валидации инпута
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(
    `.${inputElement.name}-input-error`
  ); // выбираем элемент для текста ошибки
  inputElement.classList.add(config.inputErrorClass); // подсвечиваем ошибку в инпуте
  errorElement.textContent = errorMessage; // добавляем текст ошибки
  errorElement.classList.add(config.errorClass); // делаем видимым текст ошибки
};

// функция для скрытия текста ошибки валидации инпута
const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(
    `.${inputElement.name}-input-error`
  ); // выбираем элемент для текста ошибки
  inputElement.classList.remove(config.inputErrorClass); // убираем подсветку ошибки в инпуте
  errorElement.classList.remove(config.errorClass); // скрываем элемент для текста ошибки
  errorElement.textContent = ''; // удаляем текст ошибки
};

// функция для проверки валидности инпута
const checkInputValidity = (formElement, inputElement, config) => {
  // очищаем любые предыдущие кастомные ошибки
  inputElement.setCustomValidity('');
  if (inputElement.validity.patternMismatch) {
    // проверяем кастомная ошибка или стандартная
    inputElement.setCustomValidity(inputElement.dataset.errorMessage); // если да берем кастомное сообщение
  } else {
    inputElement.setCustomValidity(''); // иначе стандартное
  }

  if (!inputElement.validity.valid) {
    // если инпут невалидный
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    ); // показываем ошибку
  } else {
    hideInputError(formElement, inputElement, config); // иначе скрываем ошибку
  }
};

// функция для проверки есть ли хоть один невалидный инпут в форме
const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

// функция для переключения состояния кнопки submit
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    // если есть невалидный инпут выключаем кнопку
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    // иначе включаем
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
};

// функция для добавления обработчика ошибок на все инпуты формы
const setEventListeners = (formElement, config) => {
  // получаем все инпуты формы
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  // получаем кнопку submit
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      // на каждый инпут вешаем обработчик
      checkInputValidity(formElement, inputElement, config); // проверяет валидность инпута
      toggleButtonState(inputList, buttonElement, config); // корректирует состояние кнопки
    });
  });
};

export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setEventListeners(formElement, config);
  });
};

export const clearValidation = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  // Очищаем ошибки для всех инпутов
  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity('');
    hideInputError(formElement, inputElement, config);
  });

  // проверяем состояние кнопки
  toggleButtonState(inputList, buttonElement, config);
};
