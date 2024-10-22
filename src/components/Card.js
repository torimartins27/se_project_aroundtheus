export default class Card {
  constructor({ name, link }, cardSelector, handleImageClick) {
    this._name = name;
    this._link = link;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
  }

  // This method is now used to query all necessary elements and store them as class fields
  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    // Store elements as class fields
    this._cardImageElement = this._cardElement.querySelector(".card__image");
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );
    this._cardTitleElement = this._cardElement.querySelector(".card__title");

    // Assign values to elements
    this._cardTitleElement.textContent = this._name;
    this._cardImageElement.src = this._link;
    this._cardImageElement.alt = this._name;

    this._setEventListeners(); // Set up event listeners
    return this._cardElement; // Return the complete card element
  }

  _setEventListeners() {
    // Now using the class fields instead of querying again
    this._likeButton.addEventListener("click", () => {
      this._handleLikeIcon();
    });

    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteCard();
    });

    this._cardImageElement.addEventListener("click", () => {
      this._handleImageClick({ name: this._name, link: this._link }); // Pass name and link to the click handler
    });
  }

  _handleLikeIcon() {
    // Toggle the like button's active state using class field
    this._likeButton.classList.toggle("card__like-button_active");
  }

  _handleDeleteCard() {
    // Remove the card element from the DOM and clear the reference
    this._cardElement.remove();
    this._cardElement = null;
  }
}
