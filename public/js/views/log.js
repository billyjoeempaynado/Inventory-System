import abstractView from "./abstractView.js";

export default class logs extends abstractView {
  constructor() {
    super();
    this.setTitle("logs");
  }

  async getHtml() {
    return `
        <h1> logs </h1>
    `;
  }
}
