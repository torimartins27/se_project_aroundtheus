export default class Card {
  constructor({ name, link }, cardSelector, handleImageClick) {
    this._name = name;
    this._link = link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
  }

  _setEventListeners() {
    this._cardElement
      .querySelector(".card__like-button")
      .addEventListener("click", () => {
        this._handleLikeIcon();
      });
    this._cardElement
      .querySelector(".card__delete-button")
      .addEventListener("click", () => {
        this._handleDeleteCard();
      });
    // this._cardImageElement.addEventListener("click", () => {
    //   this._handleImageClick(this);
    // });
  }

  _handleLikeIcon() {
    this._cardElement.remove;
    this._cardElement = null;
  }

  _handleDeleteCard() {
    this._cardElement
      .querySelector(".card__delete-button")
      .classList.toggle(".card__delete-button_is-active");
  }

  _handleImageClick() {}

  // cardImageEl.addEventListener("click", () => {
  //   openPopup(previewModal);
  //   previewModalImage.src = cardData.link;
  //   previewModalImage.alt = cardData.alt;
  //   previewModalCaption.textContent = cardData.name;
  // });

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);
    this._setEventListeners();
  }
}
