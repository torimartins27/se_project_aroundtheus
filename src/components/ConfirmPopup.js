import Popup from "./Popup.js";

export default class PopupWithConfirm extends Popup {
  constructor(popupSelector) {
    super({ popupSelector });
    this._submitFunction = null;
    this._submitButton = this._form.querySelector(".modal__button");
  }

  setSubmitAction(action) {
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
