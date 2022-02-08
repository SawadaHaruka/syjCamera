import { Header } from "./header.js"

class pageOmake {
  constructor() {
    document.addEventListener('DOMContentLoaded', this.init(), false);
  }
  init() {
    const header = new Header();
  }
}
const page = new pageOmake();