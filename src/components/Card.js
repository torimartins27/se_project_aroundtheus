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

  // encapsulation of logic: updating the like state
  setIsLiked(isLiked) {
    this._isLiked = isLiked;
    this._renderLikeButton(); // dynamically updates the like buttons appearance
  }

  // encapsulation of logic: renders the current state of the like button
  _renderLikeButton() {
    if (this._isLiked) {
      this._likeButton.classList.add("card__like-button_active");
    } else {
      this._likeButton.classList.remove("card__like-button_active");
    }
  }

  // builds the card element
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
    this._renderLikeButton(); // ensures the like button matches the initial state
    return this._cardElement;
  }

  // encapsulation of logic: sets up all event listeners for the card
  _setEventListeners() {
    // Like button event listener
    this._likeButton.addEventListener("click", () => this.toggleLike());

    // Delete button event listener
    this._deleteButton.addEventListener("click", () => {
      this._handleDeleteCard(this._id, this._deleteCard.bind(this)); // Delete the card upon confirmation
    });

    // Image click event listener
    this._cardImageElement.addEventListener("click", () => {
      this._handleImageClick({ name: this._name, link: this._link });
    });
  }

  // encapsulation of logic: confirms deletion and interacts with API
  _confirmDelete() {
    if (this._handleDeleteCard) {
      this._handleDeleteCard(this._id)
        .then(() => this._deleteCard()) // removal happens after successful API call
        .catch((err) => {
          console.error("Error deleting card:", err);
        });
    }
  }

  // encapsulation of logic: handles like/unlike toggling, including API calls
  toggleLike() {
    const handleClick = this._isLiked
      ? this._handleUnlikeClick
      : this._handleLikeClick;

    handleClick(this._id, this._isLiked)
      .then((updatedCard) => {
        this._isLiked = updatedCard.isLiked; // updates the like state dynamically
        this._renderLikeButton();
      })
      .catch((err) => {
        console.error("Error toggling like:", err);
      });
  }

  // dynamically removes the card from the DOM
  _deleteCard() {
    this._cardElement.remove();
    this._cardElement = null; // cleam up reference for memory efficiency
  }
}
