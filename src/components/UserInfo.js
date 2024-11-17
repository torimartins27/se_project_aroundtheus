export default class UserInfo {
  constructor({ nameSelector, jobSelector }) {
    this._nameElement = document.querySelector(nameSelector);
    this._jobElement = document.querySelector(jobSelector);
  }

  getUserInfo() {
    return {
      name: this._nameElement.textContent,
      job: this._jobElement.textContent,
    };
  }

  setUserInfo({ name, job }) {
    console.log("Updating profile with name:", name, "and job:", job); // Debugging log
    this._nameElement.textContent = name;
    this._jobElement.textContent = job;
  }
}
