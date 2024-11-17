import Popup from "./Popup.js";

export default class CofirmPopup extends Popup {
  constructor({ popupSelector }) {
    super({ popupSelector });
    this._form = this._popupElement.querySelector(".modal__form");
    this._submitBtn = this._form.querySelector(".modal__button");
  }

  submitModal(submit) {
    this._handleSubmit = submit;
  }

  setEventListeners() {
    super.setEventListeners;
    this._;
  }
}
