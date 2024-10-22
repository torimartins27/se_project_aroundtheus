import Popup from "./Popup.js";

export default class PopupWithImage extends Popup {
  constructor({ popupSelector }) {
    super({ popupSelector });
    this._imageElement = this._popupElement.querySelector(".modal__image");
    this._captionElement = this._popupElement.querySelector(".modal__caption");
  }

  open(data) {
    console.log("Popup data:", data);
    this._imageElement.src = data.link; // Set the modal image src
    this._imageElement.alt = data.name; // Set the alt attribute
    this._captionElement.textContent = data.name;
    super.open();
  }
}
