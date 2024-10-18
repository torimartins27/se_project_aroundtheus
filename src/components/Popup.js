export default class Popup {
  constructor({ popupSelector }) {
    this._popupElement = document.querySelector(popupSelector);
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  open() {
    this._popupElement.classList.add("modal_opened");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._popupElement.classList.remove("modal_opened");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  //   function openPopup(modal) {
  //     modal.classList.add("modal_opened");
  //     document.addEventListener("keydown", handleEscapeKey);
  //   }

  //   function closePopup(modal) {
  //     modal.classList.remove("modal_opened");
  //     document.removeEventListener("keydown", handleEscapeKey);
  //   }

  _handleEscClose(e) {
    if (e.key == "Escape") {
      this.close();
    }
  }

  // function handleEscapeKey(e) {
  //     if (e.key === "Escape") {
  //       const openModal = document.querySelector(".modal_opened");
  //       if (openModal) {
  //         closePopup(openModal);
  //       }
  //     }
  //   }

  setEventListeners() {
    // add event listener when clicking on the close button for popup
    this._popupElement
      .querySelector(".modal__close")
      .addEventListener("click", () => {
        this.close();
      });
    // add event listener when clicking on the overlay
    this._popupElement.addEventListener("click", (e) => {
      if (e.target === this._popupElement) {
        this.close();
      }
    });
  }
}
