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

import {
  profileEditBtn,
  profileEditForm,
  profileAddButton,
  addCardForm,
  settings,
  profileAvatarEdit,
  editAvatarForm,
} from "../utils/constants.js";

console.log("PROFILE ADD BUTTON: ", profileAddButton);
console.log("PROFILE AVATAR EDIT BUTTON: ", profileAvatarEdit);

// Instantiate the API
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "ab0ea543-0b60-41e4-a35e-f01573db496a",
    "Content-Type": "application/json",
  },
});

// Instantiate UserInfo
const userInfo = new UserInfo({
  nameSelector: ".profile__title",
  jobSelector: ".profile__description",
  avatarSelector: ".profile__image",
});

// Instantiate Section for cards
const cardSection = new Section(
  {
    items: [],
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list"
);

// Fetch and set initial user data
api
  .getUserData()
  .then((data) => {
    userInfo.setUserInfo({
      name: data.name,
      job: data.about,
    });
    userInfo.setuserAvatar(data.avatar);
  })
  .catch((err) => console.error("Error fetching user data:", err));

// Fetch and render initial cards
api
  .getInitialCards()
  .then((cardsData) => {
    cardSection.renderItems(cardsData.reverse());
  })
  .catch((err) => console.error("Error fetching cards:", err));

// Instantiate modals
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

const editAvatarPopup = new PopupWithForm(
  {
    popupSelector: "#avatar-edit-modal",
  },
  handleEditAvatarSubmit
);
editAvatarPopup.setEventListeners();

const popupWithImage = new PopupWithImage({
  popupSelector: "#previewModal",
});
popupWithImage.setEventListeners();

const confirmPopup = new ConfirmPopup({
  popupSelector: "#delete-modal",
});
confirmPopup.setEventListeners();

// Instantiate form validators
const editFormValidator = new FormValidator(settings, profileEditForm);
const addFormValidator = new FormValidator(settings, addCardForm);
const avatarFormValidator = new FormValidator(settings, editAvatarForm);
editFormValidator.enableValidation();
addFormValidator.enableValidation();
avatarFormValidator.enableValidation();

// Universal submit handler
function handleSubmit(request, popupInstance, loadingText = "Saving...") {
  popupInstance.renderLoading(true, loadingText);
  request()
    .then(() => {
      popupInstance.close();
    })
    .catch((err) => console.error("Error occurred:", err))
    .finally(() => {
      popupInstance.renderLoading(false);
    });
}

// Helper Functions
function createCard(cardData) {
  // encapsulation of card logic:
  // all card specific logic (rendering, event handling, likes, deletes) is handled
  // by the Card class
  // now this function is only responsible for creating and appending the card to DOM
  const card = new Card(
    cardData, // data for the card (name, link, _id, isLiked)
    "#card-template", // selector for the card template in the HTML
    handleImageClick, // callback for when the image is clicked
    api.likeCard, // API method for liking
    api.unlikeCard, // API method for unliking
    api.deleteCard // API method for deleting
  );
  return card.getView(); // generates fully constructed card
}

// Event Handlers

function handleEditAvatarSubmit(formData) {
  // editAvatarPopup.renderLoading(true);
  const avatarUrl = formData.avatarUrl;
  handleSubmit(
    () =>
      api.updateProPic(avatarUrl).then((updatedUserData) => {
        userInfo.setuserAvatar(updatedUserData.avatar);
      }),
    editAvatarPopup,
    "Saving..."
  );
}

function handleProfileEditSubmit(formData) {
  handleSubmit(
    () =>
      api
        .updateProInfo(formData.title, formData.description)
        .then((updatedUserData) => {
          userInfo.setUserInfo({
            name: updatedUserData.name,
            job: updatedUserData.about,
          });
        }),
    editCardPopup,
    "Saving..."
  );
}

function handleAddCardSubmit(formData) {
  const cardData = {
    name: formData.title,
    link: formData.url,
  };

  handleSubmit(
    () =>
      api.createCard(cardData).then((newCard) => {
        const cardElement = createCard(newCard);
        cardSection.addItem(cardElement);
        addCardForm.reset();
        addFormValidator.toggleButtonState();
      }),
    newCardPopup,
    "Saving..."
  );
}

function handleImageClick(data) {
  popupWithImage.open({
    link: data.link,
    name: data.name,
  });
}

//Event Listeners

profileAvatarEdit.addEventListener("click", () => {
  console.log("Avatar edit button clicked!");
  editAvatarPopup.open();
});

profileAddButton.addEventListener("click", () => {
  newCardPopup.open();
});

profileEditBtn.addEventListener("click", () => {
  editCardPopup.open();
});
