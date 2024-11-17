export default class Section {
  constructor({ items, renderer }, containerSelector) {
    this._items = items;
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  renderItems(cards) {
    console.log("Rendering items:", cards);
    cards.forEach((card) => {
      this._renderer(card); // Calls createCard through the renderer
    });
  }

  addItem(element) {
    this._container.prepend(element);
  }
}
