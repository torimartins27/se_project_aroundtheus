export default class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _checkRes(res) {
    if (!res.ok) {
      throw new Error("Request failed");
    }
    return res.json();
  }

  _handleError(error) {
    console.error("API request error: ", error);
  }

  getUserData() {
    return fetch(`https://around-api.en.tripleten-services.com/v1/users/me`, {
      method: "GET",
      headers: this._headers,
    }).then(this._checkRes);
  }

  updateProInfo(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then(this._checkRes);
  }

  updateProPic(avatarUrl) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      "Content-type": "application/json",
      body: JSON.stringify({
        avatar: avatarUrl,
      }),
    }).then(this._checkRes);
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._headers,
    })
      .then(this._checkRes)
      .catch(this._handleError);
  }

  createCard({ name, link }) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, link }),
    }).then(this._checkRes);
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._checkRes);
  }

  likeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then(this._checkRes);
  }

  dislikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then(this._checkRes);
  }

  toggleLike(cardId, isLiked) {
    if (isLiked) {
      return this.dislikeCard(cardId);
    } else {
      return this.likeCard(cardId);
    }
  }
}
