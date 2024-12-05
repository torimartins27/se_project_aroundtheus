export default class Card {
  constructor(
    { name, link, _id, isLiked },
    cardSelector,
    handleImageClick,
    handleLikeClick,
    handleUnlikeClick,
    handleDeleteCard
  ) {
    this._name = name;
    this._link = link;
    this._id = _id;
    this._isLiked = isLiked;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleLikeClick = handleLikeClick;
    this._handleUnlikeClick = handleUnlikeClick;
    this._handleDeleteCard = handleDeleteCard;
  }

  setIsLiked(isLiked) {
    this._isLiked = isLiked;
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
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._deleteButton = this._cardElement.querySelector(
      ".card__delete-button"
    );

    this._cardTitleElement.textContent = this._name;
    this._cardImageElement.src = this._link;
    this._cardImageElement.alt = this._name;

    this._setEventListeners();
    this._renderLikeButton();
    return this._cardElement;
  }

  _setEventListeners() {
    // Like button event listener
    if (this._likeButton) {
      this._likeButton.addEventListener("click", () => this.toggleLike());
    }

    // Delete button event listener
    if (this._deleteButton) {
      this._deleteButton.addEventListener("click", () => {
        if (this._handleDeleteCard) {
          // Prevent immediate deletion by making sure you only trigger the delete when submitting
          // Typically, this would be a form submit or confirmation
          this._handleDeleteCard(this._id, this._deleteCard.bind(this)); // Delete the card upon confirmation
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
    const handleClick = this._isLiked
      ? this._handleUnlikeClick
      : this._handleLikeClick;

    handleClick(this._id, this._isLiked)
      .then((updatedCard) => {
        this._isLiked = updatedCard.isLiked;
        this._renderLikeButton();
      })
      .catch((err) => {
        console.error("Error toggling like:", err);
      });
  }

  _confirmDelete() {
    // Open the confirmation modal inside the Card class
    confirmPopup.setSubmitAction(() => {
      this._handleDeleteCard(this._id, this._deleteCard.bind(this)); // Confirm delete action
    });
    confirmPopup.open();
  }

  _deleteCard() {
    this._cardElement.remove();
    this._cardElement = null;
  }
}
