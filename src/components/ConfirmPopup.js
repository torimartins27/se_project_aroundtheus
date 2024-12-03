import Popup from "./Popup.js";

export default class ConfirmPopup extends Popup {
  constructor({ popupSelector }) {
    super({ popupSelector });
    this._submitFunction = null;
    this._submitButton = this._popupElement.querySelector(".modal__button");
    this._saveButton = this._popupElement.querySelector(".modal__button");
  }

  setSubmitAction(submitFunction) {
    this._submitFunction = submitFunction;
  }

  renderLoading(isLoading) {
    if (isLoading) {
      this._saveButton.textContent = "Loading...";
    } else {
      this._saveButton.textContent = "Yes";
    }
  }

  setEventListeners() {
    super.setEventListeners();

    this._submitButton.addEventListener("click", (e) => {
      e.preventDefault();
      if (this._submitFunction) {
        this._submitFunction();
      }
      this.close();
    });
  }
}
