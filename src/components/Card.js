export default class Card {
  constructor(
    { name, link, _id, isLiked },
    cardSelector,
    handleImageClick,
    handleLikeClick,
    handleDeleteClick
  ) {
    this._name = name;
    this._link = link;
    this._id = _id;
    this._isLiked = isLiked;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleLikeClick = handleLikeClick;
    this._handleDeleteClick = handleDeleteClick;
  }

  setIsLiked(isLiked) {
    this.isLiked = isLiked;
    this._renderLikeButton();
  }

  _renderLikeButton() {
    if (this._isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.querySelector(".card")
      .cloneNode(true);

    this._cardImageElement = this._cardElement.querySelector(".card__image");
    this._cardTitleElement = this._cardElement.querySelector(".card__title");
    this._cardElement.setAttribute("data-id", this._id);

    this._cardTitleElement.textContent = this._name;
    this._cardImageElement.src = this._link;
    this._cardImageElement.alt = this._name;

    this._setEventListeners();
    this._renderLikeButton();
    return this._cardElement;
  }

  _setEventListeners() {
    console.log("Card ID in _setEventListeners:", this._id); // Should show correct ID
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );

    // Like button event listener
    if (this._likeButton) {
      this._likeButton.addEventListener("click", () => {
        this.toggleLike();
      });
    }

    // Delete button event listener
    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        if (this._handleDeleteClick) {
          this._handleDeleteClick(this._id, this._deleteCard.bind(this));
        }
      });
    }

    // Image click event listener
    if (this._cardImageElement) {
      this._cardImageElement.addEventListener("click", () => {
        this._handleImageClick({ name: this._name, link: this._link });
      });
    }
  }

  toggleLike() {
    // Toggle the like state based on the current state
    this._isLiked = !this._isLiked;

    // Call the handleLikeClick method to update the like state on the server
    this._handleLikeClick(this._id, this._isLiked)
      .then((updatedCard) => {
        // Update the local state with the response from the server
        this._isLiked = updatedCard.isLiked;
        this._likes = updatedCard.likes; // Update the likes array if necessary
        this._renderLikeButton(); // Re-render the like button based on the new state
      })
      .catch((err) => {
        console.error("Error toggling like:", err);
      });
  }

  _deleteCard() {
    this._cardElement.remove();
  }
}
