import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import "./index.css";
import { cards } from "../utils/constants.js";
import ConfirmPopup from "../components/ConfirmPopup.js";
import { deleteButton } from "../utils/constants.js";

import {
  profileEditBtn,
  profileEditForm,
  profileAddButton,
  addCardForm,
  settings,
} from "../utils/constants.js";

// Instantiate the API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "1ed77d43-1f50-4439-8fce-4886cc18d836",
    "Content-Type": "application/json",
  },
});
console.log("API instance created:", api); // debugging log

// Instantiate UserInfo
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});
console.log("UserInfo instance created:", userInfo); // debugging log

// Instantiate Section for cards
const cardSection = new Section(
  {
    items: [],
    renderer: (cardData) => {
      console.log("Rendering card:", cardData); // debugging log
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list"
);
console.log("Section instance created:", cardSection); // debugging log

// Fetch and set initial user data
api
  .getUserData()
  .then((data) => {
    console.log("Fetched user data:", data); // debugging log
    userInfo.setUserInfo({
      name: data.name,
      job: data.about,
    });
  })
  .catch((err) => console.error("Error fetching user data:", err));

// Fetch and render initial cards
api
  .getInitialCards()
  .then((cardsData) => {
    console.log("Rendering cards:", cardsData); // debugging log
    cardSection.renderItems(cardsData.reverse());
  })
  .catch((err) => console.error("Error fetching cards:", err));

// Instantiate modals
const newCardPopup = new PopupWithForm(
  { popupSelector: "#add-card-modal" },
  handleAddCardSubmit
);
newCardPopup.setEventListeners();
console.log("PopupWithForm instance for adding card created:", newCardPopup); // debugging log

const editCardPopup = new PopupWithForm(
  { popupSelector: "#profile-edit-modal" },
  handleProfileEditSubmit
);
editCardPopup.setEventListeners();
console.log(
  "PopupWithForm instance for editing profile created:",
  editCardPopup
); // debugging log

const popupWithImage = new PopupWithImage({
  popupSelector: "#previewModal",
});
popupWithImage.setEventListeners();
console.log("PopupWithImage instance created:", popupWithImage); // debugging log

const confirmPopup = new ConfirmPopup({
  popupSelector: "#delete-modal",
});
confirmPopup.setEventListeners();
console.log("ConfirmPopup instance for deleting card created:", confirmPopup);

// Instantiate form validators
const editFormValidator = new FormValidator(settings, profileEditForm);
const addFormValidator = new FormValidator(settings, addCardForm);
editFormValidator.enableValidation();
addFormValidator.enableValidation();
console.log("Form validators enabled"); // debugging log

// Helper Functions
function createCard({ name, link, _id, isLiked }) {
  // Instantiate the card
  const card = new Card(
    { name, link, _id, isLiked },
    "#card-template",
    handleImageClick,
    handleLikeClick,
    handleUnlikeClick,
    handleDeleteCard
  );

  // Retrieve the card element from the Card instance
  const cardElement = card.getView();

  // Find the parent container where you want to append the card
  const cardContainer = document.querySelector(".modal__container"); // Replace with your actual container selector

  // Append the card to the parent container
  cardContainer.appendChild(cardElement);

  // Now query for the delete button within the cardElement
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Ensure the delete button is found before adding the event listener
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      console.log("Delete button clicked");
      confirmPopup.open();
    });
  } else {
    console.error("Delete button not found within card template.");
  }

  // Return the card element
  return cardElement;
}

let cardUploaded = true;

function uploadCardsToServer() {
  if (cardUploaded) {
    console.log("Cards already uploaded to server.");
    return;
  }

  cards.forEach((card) => {
    api
      .createCard(card)
      .then((addedCard) => {
        console.log("Card added to server", addedCard);
      })
      .catch((err) => {
        console.error("Error adding card to server", err);
      });
  });
  //cardUploaded = true;
}

uploadCardsToServer();

// Event Handlers
function handleAddCardSubmit(formData) {
  const cardData = {
    name: formData.title,
    link: formData.url,
  };
  api
    .createCard(cardData)
    .then((newCard) => {
      console.log("New card created from API:", newCard); // Ensure newCard contains _id
      const cardElement = createCard(newCard);
      cardSection.addItem(cardElement);
      newCardPopup.close();
      addCardForm.reset();
      addFormValidator.toggleButtonState();
    })
    .catch((error) => console.error("Error adding new card:", error));
}

function handleProfileEditSubmit(formData) {
  console.log("Handling profile edit submit with data:", formData); // debugging log
  api
    .updateProInfo(formData.title, formData.description)
    .then((updatedUserData) => {
      console.log("Profile updated from API:", updatedUserData); // debugging log
      userInfo.setUserInfo({
        name: updatedUserData.name,
        job: updatedUserData.about,
      });
      editCardPopup.close();
    })
    .catch((error) => console.error("Error updating profile:", error));
}

function handleImageClick(data) {
  console.log("Image clicked with data:", data); // debugging log
  popupWithImage.open({
    link: data.link,
    name: data.name,
  });
}

function handleLikeClick(cardId, isLiked) {
  console.log("cardId in handleLikeClick:", cardId);
  console.log("isLiked in handleLikeClick:", isLiked);

  // Use the likeCard method from Api.js
  return api
    .likeCard(cardId, isLiked) // Like or unlike the card based on isLiked
    .then((updatedCard) => {
      console.log("Updated card after toggle:", updatedCard);
      return updatedCard; // Return the updated card object to Card.js
    })
    .catch((err) => {
      console.error("Error toggling like:", err);
      throw err;
    });
}

function handleUnlikeClick(cardId, isLiked) {
  return api
    .dislikeCard(cardId, isLiked)
    .then((updatedCard) => {
      return updatedCard;
    })
    .catch((err) => {
      console.error("Error toggling like button", err);
      throw err;
    });
}

function handleDeleteCard(cardId, deleteCard) {
  // Make sure the cardId is valid
  if (!cardId) {
    console.error("Card does not have a valid _id");
    return;
  }

  // Set up the delete action
  confirmPopup.setSubmitAction(() => {
    api
      .deleteCard(cardId) // Use the card's _id here
      .then(() => {
        console.log(`Card ${cardId} deleted successfully`);
        if (typeof deleteCard === "function") {
          deleteCard(); // This will remove the card element from the DOM
        } else {
          console.error("deleteCard is not a function");
        }
        confirmPopup.close();
      })
      .catch((error) => {
        console.error("Error deleting card:", error);
      });
  });
  confirmPopup.open();
}

profileAddButton.addEventListener("click", () => {
  newCardPopup.open();
});

profileEditBtn.addEventListener("click", () => {
  editCardPopup.open();
});
