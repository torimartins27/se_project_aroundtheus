import Popup from "./Popup.js";

export default class ConfirmPopup extends Popup {
  constructor({ popupSelector }) {
    super({ popupSelector });
    this._submitFunction = null;
    this._submitButton = this._popupElement.querySelector(".modal__button");
  }

  setSubmitAction(submitFunction) {
    this._submitFunction = submitFunction;
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
