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

    // Add the image click event listener
    this._cardImageElement.addEventListener("click", () => {
      this._handleImageClick(this._name, this._link); // Pass name and link to the click handler
    });
  }

  _handleLikeIcon() {
    this._cardElement
      .querySelector(".card__like-button")
      .classList.toggle("card__like-button_active"); // Toggle the like button's active state
  }

  _handleDeleteCard() {
    this._cardElement.remove(); // Remove the card element from the DOM
    this._cardElement = null; // Clear the reference
  }

  // This method will now properly handle image clicks
  _handleImageClick() {}

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    this._cardImageElement = this._cardElement.querySelector(".card__image");
    this._cardElement.querySelector(".card__title").textContent = this._name;
    this._cardImageElement.src = this._link;
    this._cardImageElement.alt = this._name;

    this._setEventListeners();

    return this._cardElement; // Return the complete card element
  }
}
