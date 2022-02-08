class Hige extends createjs.Bitmap {
  constructor(img) {
    super(img);
    this.regX = 220 / 2; //画像の真ん中が原点
    this.regY = 0; //画像の一番上が原点
  }
  initHige(posX, posY, scale, rotation) {
    this.x = posX;
    this.y = posY;
    this.scale = scale;
    this.rotation = rotation;//ラジアンを角度に直す
  }
}
class Hige1 extends Hige {
  constructor() {
    super("../src/img/img_higeStamp/hige1.png");
    this.regY = 90;
  }
}
class Hige2 extends Hige {
  constructor() {
    super("../src/img/img_higeStamp/hige2.png");
    this.regX = 580 / 2;
  }
}
class Hige3 extends Hige {
  constructor() {
    super("../src/img/img_higeStamp/hige3.png");
    this.regX = 280 / 2;
  }
}
class Hige4 extends Hige {
  constructor() {
    super("../src/img/img_higeStamp/hige4.png");
  }
}
class Hige5 extends Hige {
  constructor() {
    super("../src/img/img_higeStamp/hige5.png");
  }
}
class Hige6 extends Hige {
  constructor() {
    super("../src/img/img_higeStamp/hige6.png");
    this.regX = 320 / 2;
  }
}

const hige1 = new Hige1(),
  hige2 = new Hige2(),
  hige3 = new Hige3(),
  hige4 = new Hige4(),
  hige5 = new Hige5(),
  hige6 = new Hige6();
export const hige_arr = [hige1, hige2, hige3, hige4, hige5, hige6];

export const removeHige = () => {
  hige_arr.forEach((value) => {
    stage_hige.removeChild(value);
  });
}

export const stage_hige = new createjs.Stage("canvasHige");

const btn_h1 = document.querySelector("#btn_h1"),
  btn_h2 = document.querySelector("#btn_h2"),
  btn_h3 = document.querySelector("#btn_h3"),
  btn_h4 = document.querySelector("#btn_h4"),
  btn_h5 = document.querySelector("#btn_h5"),
  btn_h6 = document.querySelector("#btn_h6");
export const arrBtn_hige = [btn_h1, btn_h2, btn_h3, btn_h4, btn_h5, btn_h6];
const hige_img = {
  value: "img1"
};
btn_h1.addEventListener('click', () => { hige_img.value = "img1"; });
btn_h2.addEventListener('click', () => { hige_img.value = "img2"; });
btn_h3.addEventListener('click', () => { hige_img.value = "img3"; });
btn_h4.addEventListener('click', () => { hige_img.value = "img4"; });
btn_h5.addEventListener('click', () => { hige_img.value = "img5"; });
btn_h6.addEventListener('click', () => { hige_img.value = "img6"; });

const select_hige=(btn_num)=>{
  const selected_hige = document.querySelectorAll("#icons_hige img");
  selected_hige.forEach((value) => {
    value.style.backgroundColor= "#a38a64";
  });
  btn_num.style.backgroundColor= "#0dabb7";
}

export const current_hige = () => {
  switch (hige_img.value) {
    case "img1":
      removeHige();
      stage_hige.addChild(hige1);
      select_hige(btn_h1);
      break;
    case "img2":
      removeHige();
      stage_hige.addChild(hige2);
      select_hige(btn_h2);
      break;
    case "img3":
      removeHige();
      stage_hige.addChild(hige3);
      select_hige(btn_h3);
      break;
    case "img4":
      removeHige();
      stage_hige.addChild(hige4);
      select_hige(btn_h4);
      break;
    case "img5":
      removeHige();
      stage_hige.addChild(hige5);
      select_hige(btn_h5);
      break;
    case "img6":
      removeHige();
      stage_hige.addChild(hige6);
      select_hige(btn_h6);
      break;
  }
  stage_hige.update();
}