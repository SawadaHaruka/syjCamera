//色の判定用の関数（引数：現在のピクセルのrgb、指定色の最小値、指定色の最大値）
//指定したrgb内であれば true を返す
export const checkTargetColor = (current, min, max) => {
  if (min.r > current.r || current.r > max.r) return;
  if (min.g > current.g || current.g > max.g) return;
  if (min.b > current.b || current.b > max.b) return;
  return true;
};

export const maskImg = new createjs.Bitmap("../src/img/img_material/maskTex.png");

export const noise_light = () => {
  let stage_light = new createjs.Stage("canvas_light");
  let content_light = new createjs.Bitmap(canvas_light);
  maskImg.cache(0, 0, 500, 500);
  let maskFilter = new createjs.AlphaMaskFilter(maskImg.cacheCanvas);
  content_light.filters = [maskFilter];
  content_light.cache(-50, -50, 500, 500);//フィルターをかけた後にキャッシュ
  stage_light.addChild(content_light);
  stage_light.update();
}
export const noise_dark = () => {
  let stage_dark = new createjs.Stage("canvas_dark");
  let content_dark = new createjs.Bitmap(canvas_dark);
  maskImg.cache(0, 0, 500, 500);
  let maskFilter = new createjs.AlphaMaskFilter(maskImg.cacheCanvas);
  content_dark.filters = [maskFilter];
  content_dark.cache(-50, -50, 500, 500);//フィルターをかけた後にキャッシュ
  stage_dark.addChild(content_dark);
  stage_dark.update();
}


/**
 * 和紙背景
 */
export const canvas_bg = document.querySelector("#canvas_bg");
export const bg_context = canvas_bg.getContext("2d");
const bg1 = document.querySelector("#bg1"),
  bg2 = document.querySelector("#bg2"),
  bg3 = document.querySelector("#bg3"),
  bg4 = document.querySelector("#bg4"),
  bg5 = document.querySelector("#bg5"),
  bg6 = document.querySelector("#bg6");
const btn_bg1 = document.querySelector("#btn_bg1"),
  btn_bg2 = document.querySelector("#btn_bg2"),
  btn_bg3 = document.querySelector("#btn_bg3"),
  btn_bg4 = document.querySelector("#btn_bg4"),
  btn_bg5 = document.querySelector("#btn_bg5"),
  btn_bg6 = document.querySelector("#btn_bg6");
export const arrBtn_bg = [btn_bg1, btn_bg2, btn_bg3, btn_bg4, btn_bg5, btn_bg6];
const bg_img = {
  value: "img1"
};
btn_bg1.addEventListener('click', () => { bg_img.value = "img1"; });
btn_bg2.addEventListener('click', () => { bg_img.value = "img2"; });
btn_bg3.addEventListener('click', () => { bg_img.value = "img3"; });
btn_bg4.addEventListener('click', () => { bg_img.value = "img4"; });
btn_bg5.addEventListener('click', () => { bg_img.value = "img5"; });
btn_bg6.addEventListener('click', () => { bg_img.value = "img6"; });
const select_bg = (btn_num) => {
  const selected_bg = document.querySelectorAll("#icons_bg img");
  selected_bg.forEach((value) => {
    value.style.backgroundColor = "#a38a64";
  });
  btn_num.style.backgroundColor = "#0dabb7";
}
export const current_bg = () => {
  switch (bg_img.value) {
    case "img1":
      bg_context.drawImage(bg1, 0, 0, canvas_bg.width, canvas_bg.height);
      select_bg(btn_bg1);
      return;
    case "img2":
      bg_context.drawImage(bg2, 0, 0, canvas_bg.width, canvas_bg.height);
      select_bg(btn_bg2);
      return;
    case "img3":
      bg_context.drawImage(bg3, 0, 0, canvas_bg.width, canvas_bg.height);
      select_bg(btn_bg3);
      return;
    case "img4":
      bg_context.drawImage(bg4, 0, 0, canvas_bg.width, canvas_bg.height);
      select_bg(btn_bg4);
      return;
    case "img5":
      bg_context.drawImage(bg5, 0, 0, canvas_bg.width, canvas_bg.height);
      select_bg(btn_bg5);
      return;
    case "img6":
      bg_context.drawImage(bg6, 0, 0, canvas_bg.width, canvas_bg.height);
      select_bg(btn_bg6);
      return;
  }
}

/**
 *opencv公式ドキュメント https://docs.opencv.org/3.4/d2/df0/tutorial_js_table_of_contents_imgproc.html
 *参考ページ(blur) https://qiita.com/shoku-pan/items/07ec25f1d50629fed698
 */

//グレースケール処理
const imageGraying = (img) => {
  let dst = new cv.Mat(); //コンストラクタのことらしい
  cv.cvtColor(img, dst, cv.COLOR_RGBA2GRAY, 0);//cv.cvtColor(src、dst、コード、0はそのままで）
  return dst;
}

//ぼかし処理
const imageBlurring = (img, size) => {
  let src = imageGraying(img); //グレースケール化
  let ksize = new cv.Size(size, size);//ぼかしサイズ:n*nマス：細かさ(1,1)<…奇数だけ？<(7,7)…<荒い
  let dst = new cv.Mat();
  cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
  return dst;
}

//薄い影
export const shadow_light = (img, light_value) => {
  let src = imageBlurring(img, 3); //ぼかし加工
  let dst = new cv.Mat();
  cv.threshold(src, dst, light_value, 255, cv.THRESH_BINARY);//閾値で2値化:引数3で変わる
  return dst;
}

//濃い影
export const shadow_dark = (img, dark_value) => {
  let src = imageBlurring(img, 3); //ぼかし加工
  let dst = new cv.Mat();
  cv.threshold(src, dst, dark_value, 255, cv.THRESH_BINARY);//閾値で2値化:引数3で変わる
  return dst;
}

// https://qiita.com/Takarasawa_/items/1556bf8e0513dca34a19
//線の閾値
export const lineDrawing = (img, threshold_value) => {
  let src = imageBlurring(img, 5); //ぼかし加工
  let dst = new cv.Mat();
  cv.Canny(src, dst, threshold_value, 85, 3); //輪郭線抽出
  // cv.Canny(src, dst, 20, 90, 3); //輪郭線抽出
  let dst2 = new cv.Mat();
  cv.bitwise_not(dst, dst2); //白黒反転
  dst.delete(); //使ったもんは削除
  return dst2;
}

//線の細さ
export const lineThickness = (img, threshold_value, thick_value) => {
  let src = lineDrawing(img, threshold_value);
  let dst = new cv.Mat();
  let M = cv.Mat.ones(thick_value, thick_value, cv.CV_8U);//引数1,2で線の太さが変わる
  cv.erode(src, dst, M, new cv.Point(-1, -1), 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
  M.delete();
  return dst;
}