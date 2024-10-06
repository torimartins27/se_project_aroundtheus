// Import the Card and FormValidator classes
import Card from "../components/Card.js"; // underlined red
// after I changed card to Card.. not sure how to fix
import FormValidator from "../components/FormValidator.js";

// Initial cards data
const initialCards = [
  {
    name: "Coneflowers",
    link: "https://images.unsplash.com/photo-1539652021954-757266f01b89?q=80&w=3456&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Creeping Phlox",
    link: "https://images.unsplash.com/photo-1713491129428-c2da5834128c?q=80&w=3473&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Balloon Flower",
    link: "https://images.unsplash.com/photo-1711322343662-6262fb3418f5?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Purple Salvia",
    link: "https://images.unsplash.com/photo-1592148815557-e4b2057b685e?q=80&w=3546&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Speedwell",
    link: "https://images.unsplash.com/photo-1655555408737-cfd1739fa220?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Black Eyed Susan",
    link: "https://plus.unsplash.com/premium_photo-1673570442940-b183c7b55ec1?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

// Elements
const profileEditBtn = document.querySelector(".profile__edit-button");
const profileEditModal = document.querySelector("#profile-edit-modal");
const profileCloseBtn = profileEditModal.querySelector(".modal__close");

const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditForm = profileEditModal.querySelector(".modal__form");
const cardListEl = document.querySelector(".cards__list");
const cardTemplate =
  document.querySelector("#card-template").content.firstElementChild;

const profileAddButton = document.querySelector(".profile__add-button");
const addCardModal = document.querySelector("#add-card-modal");
const addCardCloseButton = addCardModal.querySelector(".modal__close");
const addCardForm = document.querySelector("#add-card-form");

const previewModal = document.querySelector("#previewModal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close");
const addCardTitleInput = document.querySelector("#add-card-title");
const addCardLinkInput = document.querySelector("#add-card-url");

// Functions

function openPopup(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", handleEscapeKey);
}

function closePopup(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", handleEscapeKey);
}

// Function to create a new card
function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleImageClick); // Instantiate the new Card
  return card.getView(); // Return the card's HTML element
}

/* Event Handlers */

function handleCloseOverlay(e) {
  if (e.target.classList.contains("modal")) {
    closePopup(e.target);
  }
}

function handleEscapeKey(e) {
  if (e.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closePopup(openModal);
    }
  }
}

function handleProfileEditSubmit(e) {
  e.preventDefault();
  profileName.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closePopup(profileEditModal);
}

function handleAddCardSubmit(e) {
  e.preventDefault();
  const cardData = {
    name: addCardTitleInput.value,
    link: addCardLinkInput.value,
  };
  const cardElement = createCard(cardData); // Use the new createCard function
  cardListEl.prepend(cardElement);
  closePopup(addCardModal);
  e.target.reset();
  addFormValidator.toggleButtonState();
}

function handleImageClick(name, link) {
  openPopup(previewModal); // Assuming you already have this function
  previewModalImage.src = link; // Set the modal image src
  previewModalImage.alt = name; // Set the alt attribute
  previewModalCaption.textContent = name; // Set the caption to the image name
}

/* Universal Handler for close buttons */

const closeButtons = document.querySelectorAll(".modal__close");

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closePopup(popup));
});

/* Event Listeners */

profileEditBtn.addEventListener("click", () => {
  profileTitleInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openPopup(profileEditModal);
});

profileEditForm.addEventListener("submit", handleProfileEditSubmit);

initialCards.forEach((cardData) => {
  const cardElement = createCard(cardData); // Use the new createCard function
  cardListEl.prepend(cardElement);
});

profileAddButton.addEventListener("click", () => openPopup(addCardModal));
addCardForm.addEventListener("submit", handleAddCardSubmit);

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", handleCloseOverlay);
});

const settings = {
  inputSelector: ".modal__input", // Selector for input fields
  submitButtonSelector: ".modal__button", // Selector for the submit button
  inactiveButtonClass: "modal__submit_disabled", // Class to disable the button
  inputErrorClass: "modal__input_type_error", // Class to highlight input errors
  errorClass: "modal__error_visible", // Class to show error messages
};

const editFormValidator = new FormValidator(settings, profileEditForm);
const addFormValidator = new FormValidator(settings, addCardForm);

editFormValidator.enableValidation();
addFormValidator.enableValidation();
