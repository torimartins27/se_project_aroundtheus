// Import dependencies
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import "./index.css";
import { initialCards } from "../utils/constants.js";
import { cardTemplate } from "../utils/constants.js";

import {
  profileEditBtn,
  profileTitleInput,
  profileDescriptionInput,
  profileEditForm,
  profileAddButton,
  addCardForm,
  settings,
} from "../utils/constants.js";

// Instantiate the API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "494f5648-a88f-4ba0-b9db-af129a4fd5f1",
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
  .then((cards) => {
    console.log("Fetched cards from API:", cards); // debugging log
    cardSection.renderItems(initialCards);
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

// Instantiate form validators
const editFormValidator = new FormValidator(settings, profileEditForm);
const addFormValidator = new FormValidator(settings, addCardForm);
editFormValidator.enableValidation();
addFormValidator.enableValidation();
console.log("Form validators enabled"); // debugging log

// Helper Functions
function createCard({ name, link }) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;

  // Add any other event listeners or functionality to the card, if necessary
  return cardElement;
}

// Event Handlers
function handleAddCardSubmit(formData) {
  const cardData = {
    name: formData.title,
    link: formData.url,
  };
  console.log("Handling add card submit with data:", cardData); // debugging log
  api
    .createCard(cardData)
    .then((newCard) => {
      console.log("New card created from API:", newCard); // debugging log
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

// Event Listeners
profileEditBtn.addEventListener("click", () => {
  const userData = userInfo.getUserInfo();
  console.log("Profile edit button clicked. Current user data:", userData); // debugging log
  profileTitleInput.value = userData.name;
  profileDescriptionInput.value = userData.job;
  editCardPopup.open();
});

profileAddButton.addEventListener("click", () => {
  console.log("Add card button clicked"); // debugging log
  newCardPopup.open();
});
