import Popup from "./Popup";

class PopupWithForm extends Popup {
  constructor({ popupSelector }, handleFormSubmit) {
    super({ popupSelector });
    this._handleFormSubmit = handleFormSubmit;
    // Verify that the popup element is being found
    if (!this._popupElement) {
      console.error("Popup element not found");
      return;
    }

    // Assign the form inside the popup
    this._popupForm = this._popupElement.querySelector(".modal__form");

    // Check if the form is found
    if (!this._popupForm) {
      console.error("Form element not found inside the popup");
      return;
    }

    this._inputList = this._popupForm.querySelectorAll(".modal__input");

    // Check if inputs are found
    if (!this._inputList.length) {
      console.error("No inputs found in the form");
    }
  }

  _getInputValues() {
    const inputValues = {};
    this._inputList.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues;
  }

  setEventListeners() {
    super.setEventListeners();
    this._popupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleFormSubmit(this._getInputValues());
    });
  }
}

export default PopupWithForm;
