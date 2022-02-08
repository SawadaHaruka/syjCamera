import { Header } from "./header.js"

class pageHistory {
  constructor() {
    document.addEventListener('DOMContentLoaded', this.init(), false);
  }
  init() {
    const header = new Header();
    window.addEventListener('load', () => {
      scrollEffects();
    });

    const scrollEffects = () => {
      const effect = document.querySelectorAll(".effect");
      effect.forEach((element) => {
        gsap.fromTo(
          element,
          { y: 50, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.2,
            // スクロールトリガーの登録
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              ease: "expo",
            },
          }
        );
      });

      window.addEventListener("load", () => {
        ScrollTrigger.refresh();
      });
    }
  }
}
const page = new pageHistory();