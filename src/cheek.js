import { maskImg } from "./imgProcessing";
/**
 * ほっぺ
 */
export class cheekL extends createjs.Shape {
  constructor() {
    super();
  }
  set_cheek(cheekSize, cheekLx, cheekLy, cheekColor) {
    this.graphics.beginFill(cheekColor).drawCircle(0, 0, cheekSize);
    this.x = cheekLx;
    this.y = cheekLy;
    this.alpha = 0.6;
    let blurFilter = new createjs.BlurFilter(20, 20, 1); //ボカシのサイズ,サイズ、クオリティーステップ
    maskImg.cache(0, 0, 500, 500);//先にマスクをキャッシュしておく
    let maskFilter = new createjs.AlphaMaskFilter(maskImg.cacheCanvas);
    this.filters = [blurFilter, maskFilter];
    this.cache(-50, -50, 400, 400);//フィルターをかける本体はフィルターをかけた後にキャッシュする
  }
}
export class cheekR extends cheekL {
  constructor() {
    super();
  }
}
const btn_c1 = document.querySelector("#btn_c1"),
  btn_c2 = document.querySelector("#btn_c2"),
  btn_c3 = document.querySelector("#btn_c3"),
  btn_c4 = document.querySelector("#btn_c4"),
  btn_c5 = document.querySelector("#btn_c5"),
  btn_c6 = document.querySelector("#btn_c6");
export const arrBtn_cheek = [btn_c1, btn_c2, btn_c3, btn_c4, btn_c5, btn_c6];
const cheek_img = {
  value: "img1"
};
btn_c1.addEventListener('click', () => { cheek_img.value = "img1"; });
btn_c2.addEventListener('click', () => { cheek_img.value = "img2"; });
btn_c3.addEventListener('click', () => { cheek_img.value = "img3"; });
btn_c4.addEventListener('click', () => { cheek_img.value = "img4"; });
btn_c5.addEventListener('click', () => { cheek_img.value = "img5"; });
btn_c6.addEventListener('click', () => { cheek_img.value = "img6"; });

const select_cheekColor = (btn_num) => {
  const selected_cheekColor = document.querySelectorAll("#icons_cheekColor img");
  selected_cheekColor.forEach((value) => {
    value.style.backgroundColor = "#a38a64";
  });
  btn_num.style.backgroundColor = "#0dabb7";
}
export let cheek_color;
export const current_cheekColor = () => {
  switch (cheek_img.value) {
    case "img1":
      cheek_color = "#ef89b2";
      select_cheekColor(btn_c1);
      break;
    case "img2":
      cheek_color = "#cc0000";
      select_cheekColor(btn_c2);
      break;
    case "img3":
      cheek_color = "#d14bb4";
      select_cheekColor(btn_c3);
      break;
    case "img4":
      cheek_color = "#fca88e";
      select_cheekColor(btn_c4);
      break;
    case "img5":
      cheek_color = "#ff6600";
      select_cheekColor(btn_c5);
      break;
    case "img6":
      cheek_color = "#cc00ff";
      select_cheekColor(btn_c6);
      break;
  }
}