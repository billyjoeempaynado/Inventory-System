import abstractView from "./abstractView.js";

export default class reports extends abstractView {
  constructor() {
    super();
    this.setTitle("reports");
  }

  async getHtml() {
    return `
        <h1> reports </h1>
    `;
  }
}
