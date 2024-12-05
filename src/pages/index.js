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
    authorization: "7402cb6d-0a3f-4a76-a646-356bcf96e0d6",
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
  const cardElement = card.getView();

  return cardElement;
}

// Event Handlers

function handleEditAvatarSubmit(formData) {
  editAvatarPopup.renderLoading(true);
  const avatarUrl = formData.avatarUrl;
  api
    .updateProPic(avatarUrl)
    .then((updatedUserData) => {
      console.log(updatedUserData);
      userInfo.setuserAvatar(updatedUserData.avatar);
      editAvatarPopup.close();
    })
    .catch((error) => {
      console.error("Error updating avatar:", error);
    })
    .finally(() => {
      editAvatarPopup.renderLoading(false, "Save");
    });
}

function handleProfileEditSubmit(formData) {
  editCardPopup.renderLoading(true);
  api
    .updateProInfo(formData.title, formData.description)
    .then((updatedUserData) => {
      userInfo.setUserInfo({
        name: updatedUserData.name,
        job: updatedUserData.about,
      });
      editCardPopup.close();
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
    })
    .finally(() => {
      editCardPopup.renderLoading(false, "Save");
    });
}

function handleAddCardSubmit(formData) {
  newCardPopup.renderLoading(true);
  const cardData = {
    name: formData.title,
    link: formData.url,
  };
  api
    .createCard(cardData)
    .then((newCard) => {
      const cardElement = createCard(newCard);
      cardSection.addItem(cardElement);
      newCardPopup.close();
      addCardForm.reset();
      addFormValidator.toggleButtonState();
    })
    .catch((error) => {
      console.error("Error adding new card:", error);
    })
    .finally(() => {
      newCardPopup.renderLoading(false, "Save");
    });
}

function handleImageClick(data) {
  popupWithImage.open({
    link: data.link,
    name: data.name,
  });
}

function handleLikeClick(cardId, isLiked) {
  return api
    .likeCard(cardId, isLiked)
    .then((updatedCard) => {
      return updatedCard;
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
  if (!cardId) {
    console.error("Card does not have a valid _id");
    return;
  }

  confirmPopup.setSubmitAction(() => {
    api
      .deleteCard(cardId)
      .then(() => {
        if (typeof deleteCard === "function") {
          deleteCard();
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
