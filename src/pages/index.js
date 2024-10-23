// Import the Card and FormValidator classes
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import "./index.css";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import {
  initialCards,
  profileEditBtn,
  profileName,
  profileDescription,
  profileTitleInput,
  profileDescriptionInput,
  profileEditForm,
  cardListEl,
  profileAddButton,
  addCardForm,
  settings,
} from "../utils/constants.js";

// Initial cards data

// instantiating new objects

const newCardPopup = new PopupWithForm(
  { popupSelector: "#add-card-modal" },
  handleAddCardSubmit
);
newCardPopup.setEventListeners();

const editCardPopup = new PopupWithForm(
  { popupSelector: "#profile-edit-modal" },
  handleProfileEditSubmit
);
editCardPopup.setEventListeners();

const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
});

const cardSection = new Section(
  {
    items: initialCards,
    renderer: (cardData) => {
      const cardElement = createCard(cardData); // Create card using createCard
      cardSection.addItem(cardElement); // Add the card to the DOM
    },
  },
  ".cards__list" // Container selector
);

const popupWithImage = new PopupWithImage({
  popupSelector: "#previewModal",
});
popupWithImage.setEventListeners();

const editFormValidator = new FormValidator(settings, profileEditForm);
const addFormValidator = new FormValidator(settings, addCardForm);

// Render initial cards
cardSection.renderItems();

// Functions

// Function to create a new card
function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick); // Instantiate the new Card
  const cardElement = card.getView(); // Get the card's HTML element
  return cardElement; // Return the card's HTML element
}

/* Event Handlers */

function handleProfileEditSubmit(e) {
  userInfo.setUserInfo({
    name: profileTitleInput.value,
    description: profileDescriptionInput.value,
  });
  editCardPopup.close();
}

function handleAddCardSubmit(formData) {
  const cardData = {
    name: formData.title,
    link: formData.url,
  };

  const cardElement = createCard(cardData); // Create a new card element
  cardSection.addItem(cardElement); // Add card to the DOM
  newCardPopup.close();
  addCardForm.reset();
  addFormValidator.toggleButtonState(); // Reset form button state if needed
}

function handleImageClick(data) {
  popupWithImage.open({
    link: data.link, // URL for the image
    name: data.name, // Name for the caption
  });
}

/* Event Listeners */

profileEditBtn.addEventListener("click", () => {
  const allData = userInfo.getUserInfo(); // Get the user info using the method
  profileTitleInput.value = allData.name; // Set the input values with the retrieved data
  profileDescriptionInput.value = allData.description;
  editCardPopup.open(); // Open the edit form popup
});

profileAddButton.addEventListener("click", () => newCardPopup.open());

editFormValidator.enableValidation();
addFormValidator.enableValidation();
