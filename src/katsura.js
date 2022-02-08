import { stage_katsura } from "./index.js"

export const tween_btns = gsap.fromTo(".stamp_btn", {
  y: 15,
  opacity: 0,
}, {
  paused: true, // 勝手にアニメーションが始まらないように
  duration: 1.2,
  y: 0, // 少し上に移動させる
  opacity: 1,
  ease: "power2.out",
  // 複数要素を扱うプロパティ
  stagger: {
    from: "start", //左側から
    amount: 0.8 // 0.8秒おきに
  }
});
//cssのホバーでやると動かなかったので改めて設定
export const stamp_btn = document.querySelectorAll(".stamp_btn");
stamp_btn.forEach((value) => {
  value.addEventListener("mouseover", () => {
    value.style.transform = "scale(0.9)";
  });
  value.addEventListener("mouseout", () => {
    value.style.transform = "scale(1)";
  });
});

const katsuraWidth = 320;
const katsuraHeight = 240;
class Katsura extends createjs.Bitmap {
  constructor(img) {
    super(img);
    this.regX = katsuraWidth / 2; //画像の真ん中が原点
    this.regY = katsuraHeight; //画像の一番下が原点
  }
  initStamp(posX, posY, scale, rotation) {
    this.x = posX; //鼻根
    this.y = posY;
    this.scale = scale;
    this.rotation = rotation;//ラジアンを角度に直す
  }
}
class Katsura1 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura1.png");
  }
}
class Katsura2 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura2.png");
  }
}
class Katsura3 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura3.png");
    this.regX = 360 / 2;
  }
}
class Katsura4 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura4.png");
  }
}
class Katsura5 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura5.png");
    this.regY = 280;
  }
}
class Katsura6 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura6.png");
  }
}
class Katsura7 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura7.png");
    this.regY = 230;
  }
}
class Katsura8 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura8.png");
  }
}
class Katsura9 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura9.png");
    this.regY = 230;
  }
}
class Katsura10 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura10.png");
    this.regX = 360 / 2;
    this.regY = 280;
  }
}
class Katsura11 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura11.png");
  }
}
class Katsura12 extends Katsura {
  constructor() {
    super("../src/img/img_stamp/katsura12.png");
    this.regY = 230;
  }
}

const katsura1 = new Katsura1(),
  katsura2 = new Katsura2(),
  katsura3 = new Katsura3(),
  katsura4 = new Katsura4(),
  katsura5 = new Katsura5(),
  katsura6 = new Katsura6(),
  katsura7 = new Katsura7(),
  katsura8 = new Katsura8(),
  katsura9 = new Katsura9(),
  katsura10 = new Katsura10(),
  katsura11 = new Katsura11(),
  katsura12 = new Katsura12();
export const katsura_arr = [katsura1, katsura2, katsura3, katsura4, katsura5, katsura6, katsura7, katsura8, katsura9, katsura10, katsura11, katsura12];

const btn_k1 = document.querySelector("#btn_k1"),
  btn_k2 = document.querySelector("#btn_k2"),
  btn_k3 = document.querySelector("#btn_k3"),
  btn_k4 = document.querySelector("#btn_k4"),
  btn_k5 = document.querySelector("#btn_k5"),
  btn_k6 = document.querySelector("#btn_k6"),
  btn_k7 = document.querySelector("#btn_k7"),
  btn_k8 = document.querySelector("#btn_k8"),
  btn_k9 = document.querySelector("#btn_k9"),
  btn_k10 = document.querySelector("#btn_k10"),
  btn_k11 = document.querySelector("#btn_k11"),
  btn_k12 = document.querySelector("#btn_k12");
export const arrBtn_katsura = [btn_k1, btn_k2, btn_k3, btn_k4, btn_k5, btn_k6, btn_k7, btn_k8, btn_k9, btn_k10, btn_k11, btn_k12];

const removeStamp = () => {
  katsura_arr.forEach((value) => {
    stage_katsura.removeChild(value);
  });
}

btn_k1.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura1);
});
btn_k2.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura2);
});
btn_k3.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura3);
});
btn_k4.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura4);
});
btn_k5.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura5);
});
btn_k6.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura6);
});
btn_k7.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura7);
});
btn_k8.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura8);
});
btn_k9.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura9);
});
btn_k10.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura10);
});
btn_k11.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura11);
});
btn_k12.addEventListener('click', () => {
  removeStamp();
  stage_katsura.addChild(katsura12);
});
