import { Header } from "./header.js"
import { tween_btns, stamp_btn, katsura_arr, arrBtn_katsura } from "./katsura.js"
import { checkTargetColor, noise_light, noise_dark, canvas_bg, bg_context, arrBtn_bg, current_bg, lineThickness, shadow_light, shadow_dark } from "./imgProcessing.js"
import { cheekL, cheekR, current_cheekColor, cheek_color, arrBtn_cheek } from "./cheek.js"
import { hige_arr, removeHige, current_hige, arrBtn_hige } from "./hige.js"
import { downloadImgs } from "./dlEvt.js"

export const stage_katsura = new createjs.Stage("canvasStamp");

class pageMain {
  constructor() {
    document.addEventListener('DOMContentLoaded', this.init(), false);
  }
  init() {
    console.log("DOMContentLoaded");
    const header = new Header();

    let tracking_state = "wait";
    const log = document.querySelector("#log"); // ログ表示用
    const count_log_ver = document.querySelector("#count_log_ver");
    const count_log = document.querySelector("#count_log");
    const progress_log = document.querySelector("#progress_log");
    const navi = document.querySelector("#progress_img");

    const video = document.querySelector("#video"); // video 要素を取得
    const overlay_canvas = document.querySelector("#overlay_canvas");
    const overlay_context = overlay_canvas.getContext("2d");
    const canvasStamp = document.querySelector("#canvasStamp");
    const canvasStamp_color = document.querySelector("#canvasStamp_color");
    const stamp_color_context = canvasStamp_color.getContext("2d");
    const canvasB = document.querySelector("#canvasB");//beforeのB
    const contextB = canvasB.getContext("2d");
    const wireframe_canvasB = document.querySelector("#wireframe_canvasB"); // トラッキング結果の表示用
    const wire_contextB = wireframe_canvasB.getContext("2d");
    const canvasA = document.querySelector("#canvasA");
    const contextA = canvasA.getContext("2d");
    const dataOnly_canvas500 = document.querySelector("#dataOnly_canvas500");
    const data_context500 = dataOnly_canvas500.getContext("2d", { alpha: false });
    const dataOnly_canvas375 = document.querySelector("#dataOnly_canvas375");
    const data_context375 = dataOnly_canvas375.getContext("2d", { alpha: false });
    const btnB = document.querySelector("#btnB");
    const btnA = document.querySelector("#btnA");

    const canvas_hige = document.querySelector("#canvasHige");

    //画像加工ゾーンのやつ読み込み
    const canvas_light = document.querySelector("#canvas_light");
    const light_context = canvas_light.getContext("2d");
    const canvas_dark = document.querySelector("#canvas_dark");
    const dark_context = canvas_dark.getContext("2d");
    const canvas_cheek = document.querySelector("#canvas_cheek");
    const canvas_line = document.querySelector("#canvas_line");
    const line_context = canvas_line.getContext("2d");

    //加工ゾーン入力
    const bar_light = document.querySelector("#bar_light");
    const color_light = document.querySelector("#color_light");
    const bar_dark = document.querySelector("#bar_dark");
    const bar_lineThick = document.querySelector("#bar_lineThick");
    const bar_lineThreshold = document.querySelector("#bar_lineThreshold");
    let light_value = 120;
    let dark_value = 60;
    let thick_value = 1;
    let threshold_value = 80;

    //ダウンロード処理パート
    const btn_dl = document.querySelector("#btn_dl");
    let dl_canvas = document.querySelector("#dl_canvas");
    const dl_context = dl_canvas.getContext("2d");

    window.addEventListener('load', () => {
      console.log("windowLoaded");
      let videoWidth, videoHeight;
      let viewportWidth = document.documentElement.clientWidth;//解像度が関係ないwindow内の大きさ？
      let viewportHeight = document.documentElement.clientHeight;
      let viewport = "";
      setTimeout(() => {
        window.scrollTo({top: 0 });
      }, 300);
        //カメラ起動ーーーーーーーーーーーーーーーーーーーー
        if ((viewportHeight >= viewportWidth * 1.2 && viewportWidth >= 600) || (viewportHeight >= viewportWidth * 1.4 && viewportWidth < 600)) { //ipad縦長画面の場合||スマホ
          viewport = "tab_sp";
          console.log("iPadかスマホの縦画面ですね");
          videoWidth = 400;
          video.width = video.height = overlay_canvas.width = canvasStamp.width = canvasStamp_color.width = canvas_hige.width = canvas_hige.height = overlay_canvas.height = canvasStamp.height = canvasStamp_color.height = videoWidth;
          navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user", //インカメラ
              width: videoWidth, //正方形で取る
              height: videoWidth, //正方形で取る
            }, audio: false,
          }).then((stream) => { //メディアデバイスが取得できたら
            video.srcObject = stream; //video要素にストリームを渡す
          });
          canvasB.width = wireframe_canvasB.width = canvasA.width = canvasB.height = wireframe_canvasB.height = canvasA.height = 300;
        } else { //パソコン
          viewport = "pc";
          console.log("パソコンorスマホ/タブレットの横画面ですね。");
          videoWidth = 500;
          videoHeight = 375;
          video.width = videoWidth;
          video.height = videoHeight;
          overlay_canvas.width = canvasStamp.width = canvasStamp_color.width = canvas_hige.width = videoWidth;//pc
          overlay_canvas.height = canvasStamp.height = canvasStamp_color.height = canvas_hige.height = videoHeight;//pc
          navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: videoWidth,
              height: videoHeight,
            }, audio: false,
          }).then((stream) => {
            video.srcObject = stream;
          });
          canvasB.width = wireframe_canvasB.width = canvasA.width = 400;
          canvasB.height = wireframe_canvasB.height = canvasA.height = 300;
          dataOnly_canvas500.width = 500;
          dataOnly_canvas500.height = 375;
        }
        canvas_light.width = canvas_light.height = canvas_bg.width = canvas_bg.height = canvas_dark.width = canvas_dark.height = canvas_cheek.width = canvas_cheek.height = canvas_line.width = canvas_line.height = 375;

        // clmtrackrをインスタンス化
        const ctrack = new clm.tracker();
        ctrack.init(pModel);

        //createjs
        createjs.Ticker.addEventListener('tick', stage_katsura); //Tickerデフォルトは24fpsで描画更新
        const stage_cheek = new createjs.Stage("canvas_cheek");

        //スタートボタンーーーーーーーーーーーーーーーーーーーーーーーー
        const start_triger = document.querySelector("#start_triger");
        start_triger.addEventListener("click", () => {
          tracking_state = "start";
          video.play();//念の為？
          createjs.Ticker.addEventListener("tick", drawLoop);
          ctrack.start(video);
          start_triger.style.display = "none";
          btnB.style.display = "block";
          navi.style.visibility = "visible";
          progress_log.innerHTML = "緑の線が顔についてくるか確認しよう！<br>前髪を分けると認識されやすいよ";
        });

        let positions; //顔部品（特徴点）の位置データを表示する用
        const drawLoop = () => { //描画ループの関数
          createjs.Ticker.addEventListener("tick", drawLoop);
          positions = ctrack.getCurrentPosition(); // 顔部品の現在位置の取得
          overlay_context.clearRect(0, 0, overlay_canvas.width, overlay_canvas.height); //canvasクリア
          ctrack.draw(overlay_canvas); // canvasにトラッキング結果を描画
          stamp_color_context.clearRect(0, 0, canvasStamp_color.width, canvasStamp_color.height);
          stamp_color_context.drawImage(canvasStamp, 0, 0, canvasStamp_color.width, canvasStamp_color.height);
          if (positions) { //座標が取得できたら
            getPos(positions);
          }
        }

        const drawStamp = () => {
          //顔の幅にスタンプを合わせる
          let faceWidth = faceLX - faceRX; //幅の基準としてこめかみの間隔を求める
          let imgWidth = 0.55 * faceWidth; // 顔幅をもとに画像の幅を変える
          let imgSize = imgWidth / -110; //ちょっと調整
          //スタンプを回転させるための角度を求める（ラジアンで取得される）
          let stampRadian = Math.atan2(faceRY - faceLY, faceRX - faceLX);
          let degree = stampRadian * 180 / Math.PI;
          katsura_arr.forEach((value) => {
            value.initStamp(bikonX, bikonY, imgSize, degree);
          });

          //かつらの肌色部分の色を変える
          const currentColor_face = { r: null, g: null, b: null };
          let imageData = stamp_color_context.getImageData(0, 0, canvasStamp_color.width, canvasStamp_color.height); //コンテキストからデータ取得
          let data_k = imageData.data;
          for (let i = 0, len = imageData.data.length; i < len; i += 4) {//rgba4バイトずつ取得
            currentColor_face.r = data_k[i];
            currentColor_face.g = data_k[i + 1];
            currentColor_face.b = data_k[i + 2];
            // 画像の白色部分を取得した肌色に変換する
            if (checkTargetColor(currentColor_face, minColor_white, maxColor_white)) {
              data_k[i] = r_avg;
              data_k[i + 1] = g_avg;
              data_k[i + 2] = b_avg;
            }
          }
          stamp_color_context.putImageData(imageData, 0, 0);//canvasに変更済みのImageDataオブジェクトを描画する
        }
        arrBtn_katsura.forEach((value) => {//どれかカツラボタンをクリックしたら
          value.addEventListener("click", () => {
            tracking_state = "autoShutter";
            log.innerHTML = "【三】変顔を5秒以上しよう。";
            count_log_ver.innerHTML = "自力で撮影バージョン";
            count_log.innerHTML = "撮影まで<br>";
          });
        });
        /**
        * 真顔ー変顔：鼻根と各点の距離間を真顔では1とし、変顔では絶対値に直してxとする。
        * 顔をクシャッと縮めて距離（比率）がマイナスなった場合(1-x)+1=2-xに直す
        */
        let arrBefore, arrAfter, arrSum;
        let faceLX, faceLY, faceRX, faceRY, bikonX, bikonY, faceSizeB, faceSizeA, ratioFace, faceSize, cheekLx, cheekLy, cheekRx, cheekRy, h37x, h37y;
        const getPos = (pos) => {
          bikonX = pos[33][0];
          bikonY = pos[33][1];
          let num = (a) => { // 距離を求めて絶対値に直しておく:pos[33][]は鼻根の座標
            return Math.abs(Math.sqrt((bikonX - pos[a][0]) ** 2 + (bikonY - pos[a][1]) ** 2));
          }
          //眉毛
          let eb16 = num(16),
            eb20 = num(20),
            eb18 = num(18),
            eb22 = num(22),
            //目
            e29 = num(29),
            e24 = num(24),
            e31 = num(31),
            e26 = num(26),
            //鼻頭
            bt62 = num(62),
            //口
            m50 = num(50),
            m44 = num(44),
            m57 = num(57),
            m60 = num(60),
            //顎
            j6 = num(6),
            j8 = num(8),
            //頬
            c11 = num(11),
            c3 = num(3);
          let getCheekPos = () => {
            if (viewport == "tab_sp") {
              cheekLx = Math.abs(pos[40][0] - pos[13][0]) / 2 + pos[40][0] * 375 / 400;
              cheekLy = Math.abs(pos[40][1] - pos[13][1]) / 2 + pos[13][1] * 375 / 400;
              cheekRx = Math.abs(pos[34][0] - pos[1][0]) / 2 + pos[1][0] * 375 / 400;
              cheekRy = Math.abs(pos[34][1] - pos[1][1]) / 2 + pos[1][1] * 375 / 400;
            } else if (viewport == "pc") {
              cheekLx = Math.abs(pos[40][0] - pos[13][0]) / 2 + pos[40][0] - 62.5;
              cheekLy = Math.abs(pos[40][1] - pos[13][1]) / 2 + pos[13][1];
              cheekRx = Math.abs(pos[34][0] - pos[1][0]) / 2 + pos[1][0] - 62.5;
              cheekRy = Math.abs(pos[34][1] - pos[1][1]) / 2 + pos[1][1];
            }
          }
          const getHigePos = () => {
            h37x = pos[37][0];
            h37y = pos[37][1];
          }
          faceLX = pos[0][0]; // こめかみRのX座標
          faceLY = pos[0][1]; // こめかみRのY座標
          faceRX = pos[14][0]; // こめかみLのX座標
          faceRY = pos[14][1]; // こめかみLのY座標
          faceSize = Math.abs(Math.sqrt((faceLX - faceRX) ** 2 + (faceLY - faceRY) ** 2));
          if (tracking_state === "before") {//トラッキングが成功し終わるとbtnAへ切り替わる
            arrBefore = []; //配列クリア
            arrBefore = [eb16, eb20, eb18, eb22, e29, e24, e31, e26, bt62, m50, m44, m57, m60, j6, j8, c11, c3];
            faceSizeB = Math.abs(Math.sqrt((faceLX - faceRX) ** 2 + (faceLY - faceRY) ** 2));
          } else if (tracking_state === "autoShutter") {//変顔を測り続ける
            drawStamp();
            arrAfter = []; arrSum = [];//撮り直し用に配列クリア
            arrAfter = [eb16, eb20, eb18, eb22, e29, e24, e31, e26, bt62, m50, m44, m57, m60, j6, j8, c11, c3];
            faceSizeA = Math.abs(Math.sqrt((faceLX - faceRX) ** 2 + (faceLY - faceRY) ** 2));
            // ratioB:ratioA=1:ratioFaceで求められたxを各距離感に積算する
            ratioFace = faceSizeA / faceSizeB;
            // console.log("顔の大きさはafterの方が", ratioFace, "倍違う");

            //比率を揃えるために顔の大きさの比率で割った配列
            let arrAfter_RE = arrAfter.map(item => item / ratioFace);

            for (let i = 0; i < arrAfter.length; i++) {
              let element = arrAfter_RE[i] / arrBefore[i]; // それぞれの特徴点before:afterで比率が出る
              if (element < 1) {//顔をクシャッと縮めて距離（比率）がマイナスなった場合用に(1-x)+1に直す
                element = 2 - element;
              }
              arrSum.push(element);
            }
            let sum = arrSum.reduce((sum, elem) => sum + elem, 0);
            if (sum >= arrAfter.length + 0.8) {//変形した顔の値の閾値
              hengao = true;
              if (passedTime >= setCount) {
                clearTimeout(timerID);
                getCheekPos();
                getHigePos();
                photographing(); //撮影時のイベント
              }
            } else { //真顔状態に戻ったとき
              hengao = false;
            }
          } else if (tracking_state == "usingButton") {
            drawStamp();
            clearTimeout(timerID);
            getCheekPos();
            getHigePos();
            photographing(); //撮影時のイベント
          }
        }

        let hengao = null,
          timerID, //setTimeoutをclearTimeoutするときに必要なtimerID
          setCount = 6, //カウント秒数
          passedTime = 0;
        //1秒ごとに実行される関数
        const countTime = () => {
          if (hengao == true) {//変形した顔の値の閾値
            passedTime++;//経過秒数
            let countDown = setCount - passedTime;//残り秒数
            count_log.innerHTML = "撮影まで<br>" + countDown;//残り秒数表示
          } else if (hengao == false) { //真顔に近くなったらカウントリセット
            passedTime = 0;
            count_log.innerHTML = "撮影まで<br>";
          }
          timerID = setTimeout(countTime, 1000);
        }

        let faceColor_r, faceColor_g, faceColor_b, r_avg, g_avg, b_avg, arrFace_r, arrFace_g, arrFace_b;
        const ctrackConverged = () => {
          console.log("トラッキング成功");
          remove_ctrackEvent();
          btnB.style.display = "none";

          setTimeout(() => { //顔検出が成功し終わるまで時間を置いてから再開
            reTracking();
          }, 1200);

          countTime();
          tween_btns.play();//スタンプ用のボタン登場
          positions = ctrack.getCurrentPosition(); // 顔部品の現在位置の取得再開
          if (positions) { //顔部品の現在位置を取得したら
            getPos(positions);
            wire_contextB.clearRect(0, 0, wireframe_canvasB.width, wireframe_canvasB.height);
            ctrack.stop(video);
            ctrack.draw(wireframe_canvasB); //トラッキング結果をワイヤーフレームに描画

            //肌色の取得------------------------------------------------------------
            let pos1x = Math.round(positions[1][0]); //X座標（四捨五入して整数に）
            let pos1y = Math.round(positions[1][1]); //Y座標（四捨五入して整数に）
            let pos13x = Math.round(positions[13][0]);
            const facecColorData = contextB.getImageData(pos1x, pos1y, pos13x - pos1x, 1);
            const colordata = facecColorData.data;
            arrFace_r = []; arrFace_g = []; arrFace_b = [];//一旦空にする
            for (let i = 0; i < facecColorData.width * facecColorData.height * 4; i += 4) {
              faceColor_r = colordata[i];//r
              faceColor_g = colordata[i + 1];//g
              faceColor_b = colordata[i + 2];//b
              arrFace_r.push(faceColor_r);
              arrFace_g.push(faceColor_g);
              arrFace_b.push(faceColor_b);
            }
            let r_sum = arrFace_r.reduce((sum, elem) => sum + elem, 0);
            r_avg = r_sum / arrFace_r.length;
            let g_sum = arrFace_g.reduce((sum, elem) => sum + elem, 0);
            g_avg = g_sum / arrFace_g.length;
            let b_sum = arrFace_b.reduce((sum, elem) => sum + elem, 0);
            b_avg = b_sum / arrFace_b.length;

            //案内------------------------------------------------------------
            tracking_state = "selectKatsura";
            log.innerHTML = "【二】かつらを選んでね。";
            progress_log.innerHTML = "全力で変顔をしてみよう。" + "<br>大きく顔を変化させられれば自動で撮影カウントが始まるよォ";
            stamp_btn.forEach((value) => {
              value.style.display = "inline-block";
            });
            setTimeout(() => {
              if (tracking_state == "autoShutter") {
                progress_log.innerHTML = "なかなか撮れてないみたいだね。大変！" + "<br>このボタンを押してみると良いよ。すぐ撮影できるゾ";
                btnA.style.display = "inline-block";
              }
            }, 30000);
          }
        }
        const ctrackFailed = () => {
          log.innerHTML = "トラッキング失敗、もう一度撮影してください";
          remove_ctrackEvent();
          setTimeout(() => { //顔検出が成功し終わるまで時間を置いてから再開
            reTracking();
          }, 1200);
        }
        const remove_ctrackEvent = () => {
          document.removeEventListener('clmtrackrConverged', ctrackConverged, false); //トラッキング成功
          document.removeEventListener('clmtrackrNotFound', ctrackFailed, false); //顔検出失敗
          document.removeEventListener('clmtrackrLost', ctrackFailed, false); //トラッキング失敗
        }
        const setTracking = () => { // トラッキング用セット
          document.addEventListener('clmtrackrConverged', ctrackConverged, false); //トラッキング成功
          document.addEventListener('clmtrackrNotFound', ctrackFailed, false); //顔検出失敗
          document.addEventListener('clmtrackrLost', ctrackFailed, false); //トラッキング失敗
        }
        const reTracking = () => {
          ctrack.stop(canvasB);
          ctrack.reset();
          ctrack.start(video); //videoのトラッキング再スタート
        }
        btnB.addEventListener('click', () => { //検出ボタンBeforeを押したら
          tracking_state = "before";
          contextB.clearRect(0, 0, canvasB.width, canvasB.height); //canvasクリア
          contextB.drawImage(video, 0, 0, canvasB.width, canvasB.height); //canvasに動画を切り出して転写
          wire_contextB.clearRect(0, 0, wireframe_canvasB.width, wireframe_canvasB.height);
          ctrack.reset(); //videoのトラッキングを止める
          ctrack.start(canvasB); //canvas内でフェイストラッキング開始
          setTracking();
        });

        const copying500 = () => {
          //videoを転写したやつから直に正方形にトリミングしようとするとできないっぽいので、非表示canvasに一旦転写
          data_context500.clearRect(0, 0, dataOnly_canvas500.width, dataOnly_canvas500.height);
          data_context500.drawImage(canvasA, 0, 0, dataOnly_canvas500.width, dataOnly_canvas500.height);
          data_context500.drawImage(canvasStamp_color, 0, 0, dataOnly_canvas500.width, dataOnly_canvas500.height);
        }
        const copying375 = () => {
          //アイコンにするために正方形にトリミングする（非表示のcanvas）
          data_context375.clearRect(0, 0, dataOnly_canvas375.width, dataOnly_canvas375.height);
          data_context375.drawImage(dataOnly_canvas500, 62.5, 0, dataOnly_canvas375.width, dataOnly_canvas375.height, 0, 0, dataOnly_canvas375.width, dataOnly_canvas375.height);
          //タブレット・スマホ（縦）の場合はトリミングせずそのまま転写
          if (viewportHeight >= viewportWidth * 1.2) {
            data_context375.drawImage(canvasA, 0, 0, dataOnly_canvas375.width, dataOnly_canvas375.height);
          }
        }
        //撮影時のイベント
        const photographing = () => {
          //表示されてるやつ（確認用）
          contextA.clearRect(0, 0, canvasA.width, canvasA.height);
          contextA.drawImage(video, 0, 0, canvasA.width, canvasA.height); //転写
          contextA.drawImage(canvasStamp_color, 0, 0, canvasA.width, canvasA.height);
          copying500();
          copying375();
          ctrack.stop(video);
          createjs.Ticker.removeEventListener('tick', drawLoop); //Tickerイベントを削除しておく
          createjs.Ticker.removeEventListener('tick', stage_katsura); //Tickerイベントを削除しておく
          video.pause();

          stamp_btn.forEach((value) => {
            value.style.display = "none";
          });
          
          tracking_state = "end";
          log.innerHTML = "【四】撮影完了！";
          progress_log.innerHTML = "撮影完了！" + "<br>いい感じに編集をしてアイコンを作ろう";

          drawingCombo();//加工する場所に転写

          window.scrollTo(0, document.documentElement.scrollHeight - viewportHeight);//一番下へ移動
        }
        //読み取れなかった時のための予備用
        btnA.addEventListener('click', () => {
          tracking_state = "usingButton";
          count_log_ver.innerHTML = "ボタンで撮影バージョン";
          hengao = true;
        });

        /**
        * 動画の[停止/再開]処理
        */
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') {
            switch (tracking_state) {
              case "end":
                video.pause();
                createjs.Ticker.removeEventListener('tick', drawLoop); //Tickerイベントを削除しておく
                ctrack.stop();
                break;
              case "wait":
                video.pause();
                break;
              case "start":
                video.play();
                createjs.Ticker.addEventListener("tick", drawLoop); //Tickerをセットする
                ctrack.start(video);
                break;
              default:
                video.play();
                createjs.Ticker.addEventListener("tick", drawLoop); //Tickerをセットする
                ctrack.start(video);
            }

          } else if (document.visibilityState === 'hidden') {
            video.pause();
            createjs.Ticker.removeEventListener('tick', drawLoop); //Tickerイベントを削除しておく
            ctrack.stop();
          }
        });

        // canvasで特定の色を変えるやつの参考
        // https://qiita.com/chelcat3/items/03419142aea295e94c69

        // 変更したい色の範囲を決めておく（opencvで出力されるのが真っ黒かわからないからちょっと範囲を持たせとく）
        const minColor_black = { r: 0, g: 0, b: 0 };
        const maxColor_black = { r: 4, g: 4, b: 4 };
        const minColor_white = { r: 248, g: 248, b: 248 };
        const maxColor_white = { r: 255, g: 255, b: 255 };
        //ここに現在のピクセル情報を入れていく
        let currentColor = {};//{r:null,g:null,b:null}となる

        //背景和紙レイヤーの変更イベント---------------------------------------------------------
        arrBtn_bg.forEach((value) => {
          value.addEventListener("click", () => {
            drawingCombo();
          });
        });
        const reDrawingCanvas = () => {
          bg_context.globalCompositeOperation = "source-over";//描画方法ノーマル
          bg_context.clearRect(0, 0, canvas_bg.width, canvas_bg.height);
          bg_context.drawImage(canvas_light, 0, 0, canvas_bg.width, canvas_bg.height);
          bg_context.drawImage(canvas_dark, 0, 0, canvas_bg.width, canvas_bg.height);
          bg_context.drawImage(canvas_cheek, 0, 0, canvas_bg.width, canvas_bg.height);
          bg_context.globalCompositeOperation = "multiply";//描画方法を乗算に
          current_bg();
        }
        //薄い影の変更イベント
        let r_rgb = 250, g_rgb = 230, b_rgb = 220;
        const change_shadowLight = () => {
          light_context.clearRect(0, 0, canvas_light.width, canvas_light.height);
          let src = cv.imread(dataOnly_canvas375);
          let dst = shadow_light(src, light_value);
          cv.imshow('canvas_light', dst);
          src.delete(); dst.delete();
          //色（白か黒か）をチェックして自由な色に変える
          const imgData_l = light_context.getImageData(0, 0, canvas_light.width, canvas_light.height);
          const data_l = imgData_l.data;
          for (let i = 0, len = data_l.length; i < len; i += 4) {//rgba4バイトずつ取得
            currentColor.r = data_l[i];
            currentColor.g = data_l[i + 1];
            currentColor.b = data_l[i + 2];
            // 黒色であれば入力された色に変換する
            if (checkTargetColor(currentColor, minColor_black, maxColor_black)) {
              data_l[i] = r_rgb;
              data_l[i + 1] = g_rgb;
              data_l[i + 2] = b_rgb;
              data_l[i + 3] = 255; // アルファ値：0で透明
            }
          }
          // canvasに変更済みのImageDataオブジェクトを描画する
          light_context.putImageData(imgData_l, 0, 0);

          noise_light(); //かすれ加工
          reDrawingCanvas(); //変更した時にレイヤーを保持する
        }
        color_light.addEventListener('change', () => {
          let str = color_light.value; //16進数で取得されるので
          r_rgb = parseInt(str.substr(1, 2), 16); //10進数に直す
          g_rgb = parseInt(str.substr(3, 2), 16);
          b_rgb = parseInt(str.substr(5, 2), 16);
          change_shadowLight();
        });
        bar_light.addEventListener('input', () => {
          light_value = bar_light.value - 0;//string型になっちゃうからnumber型に直す
          change_shadowLight();
        });

        //濃い影の変更イベント------------------------------------------------------------
        const change_shadowDark = () => {
          dark_context.clearRect(0, 0, canvas_dark.width, canvas_dark.height);
          let src = cv.imread(dataOnly_canvas375);
          let dst = shadow_dark(src, dark_value);
          cv.imshow('canvas_dark', dst);
          src.delete(); dst.delete();
          const imgData_d = dark_context.getImageData(0, 0, canvas_dark.width, canvas_dark.height);
          const data_d = imgData_d.data;
          for (let i = 0, len = data_d.length; i < len; i += 4) {
            currentColor.r = data_d[i];
            currentColor.g = data_d[i + 1];
            currentColor.b = data_d[i + 2];
            if (checkTargetColor(currentColor, minColor_white, maxColor_white)) {
              data_d[i + 3] = 0; //白色部分を透明に
            }
            if (checkTargetColor(currentColor, minColor_black, maxColor_black)) {
              data_d[i] = 60;
              data_d[i + 1] = 60;
              data_d[i + 2] = 80;
              data_d[i + 3] = 255;//不透明
            }
          }
          dark_context.putImageData(imgData_d, 0, 0);
          noise_dark();
          reDrawingCanvas();
        }
        bar_dark.addEventListener('input', () => {
          dark_value = bar_dark.value - 0;//string型になっちゃうからnumber型に直す
          change_shadowDark();
        });

        //ほっぺの変更イベント------------------------------------------------------------
        const cheekLeft = new cheekL(),
          cheekRight = new cheekR();
        const add_cheek = () => {
          let cheekSize = faceSize * 25 / 150;//ほっぺの大きさ
          current_cheekColor();
          cheekLeft.set_cheek(cheekSize, cheekLx, cheekLy, cheek_color);
          cheekRight.set_cheek(cheekSize, cheekRx, cheekRy, cheek_color);
          stage_cheek.addChild(cheekLeft, cheekRight);
          stage_cheek.update();
          reDrawingCanvas();
        }
        const toggle_cheek = document.querySelector("#toggle_cheek");
        toggle_cheek.checked = false;
        const icons_cheekColor = document.querySelectorAll("#icons_cheekColor li");
        icons_cheekColor.forEach((value) => {
          value.style.display = "none";
        });
        toggle_cheek.addEventListener('change', () => {
          if (toggle_cheek.checked == true) {
            icons_cheekColor.forEach((value) => {
              value.style.display = "inline-block";
            });
            add_cheek();
            arrBtn_cheek.forEach((value) => {
              value.addEventListener("click", () => {
                add_cheek();
              });
            });
          } else if (toggle_cheek.checked == false) {
            icons_cheekColor.forEach((value) => {
              value.style.display = "none";
            });
            stage_cheek.removeChild(cheekLeft, cheekRight);
            stage_cheek.update();
            reDrawingCanvas();
          }
        });

        //ひげの変更イベント------------------------------------------------------------
        const toggle_hige = document.querySelector("#toggle_hige");
        toggle_hige.checked = false;
        const icons_hige = document.querySelectorAll("#icons_hige li");
        icons_hige.forEach((value) => {
          value.style.display = "none";
        });
        toggle_hige.addEventListener('change', () => {
          if (toggle_hige.checked == true) {
            icons_hige.forEach((value) => {
              value.style.display = "inline-block";
            });
            higeCombo();
            arrBtn_hige.forEach((value) => {//ヒゲボタンをどれかクリックするたびに
              value.addEventListener("click", () => {
                higeCombo();
              });
            });
          } else if (toggle_hige.checked == false) {
            icons_hige.forEach((value) => {
              value.style.display = "none";
            });
            removeHige();//ひげ消す
            copying375();//描き直し
            drawingCombo();
          }
        });
        const set_hige = () => {
          let imgScale = 0.55 * faceSize / 110; //ちょっと調整
          //スタンプを回転させるための角度を求める（ラジアンで取得される）
          let stampRadian = Math.atan2(faceRY - faceLY, faceRX - faceLX);
          let degree = stampRadian * 180 / Math.PI;
          hige_arr.forEach((value) => {//全部に対して位置を代入
            value.initHige(h37x, h37y, imgScale, degree);
          });
        }
        const higeDrawing = () => {
          copying375();//375canvasをクリアして描く
          data_context375.drawImage(canvas_hige, 0, 0, dataOnly_canvas375.width, dataOnly_canvas375.height);
        }
        const higeCombo = () => {
          set_hige();//ひげを置くための座標を取得する
          current_hige();//stage_higeにひげをaddChild
          higeDrawing();//375canvasに転写
          drawingCombo();//それぞれのレイヤーを描き直す
        }

        //線の変更イベント------------------------------------------------------------
        const change_line = () => {
          line_context.clearRect(0, 0, canvas_line.width, canvas_line.height);
          let src = cv.imread(dataOnly_canvas375);
          let dst = lineThickness(src, threshold_value, thick_value);
          cv.imshow('canvas_line', dst);
          src.delete(); dst.delete();
          const imageData_line = line_context.getImageData(0, 0, canvas_line.width, canvas_line.height);
          const data_line = imageData_line.data;
          for (let i = 0, len = data_line.length; i < len; i += 4) {
            currentColor.r = data_line[i];
            currentColor.g = data_line[i + 1];
            currentColor.b = data_line[i + 2];
            if (checkTargetColor(currentColor, minColor_white, maxColor_white)) {
              data_line[i + 3] = 0;
            }
            if (checkTargetColor(currentColor, minColor_black, maxColor_black)) {
              data_line[i] = 60;
              data_line[i + 1] = 60;
              data_line[i + 2] = 70;
              data_line[i + 3] = 255;
            }
          }
          line_context.putImageData(imageData_line, 0, 0);
        }
        bar_lineThick.addEventListener('input', () => {//線の太さ
          thick_value = bar_lineThick.value - 0;
          change_line();
        });
        bar_lineThreshold.addEventListener('input', () => {//ぼかしの閾値
          threshold_value = bar_lineThreshold.value - 0;
          change_line();
        });

        //描き直すときのセット
        const drawingCombo = () => {
          change_shadowLight();
          change_shadowDark();
          change_line();
        }

        /**
         * ダウンロード処理
         */
        btn_dl.addEventListener("click", () => {
        //レイヤーを一個の画像にする
        dl_context.drawImage(canvas_light, 0, 0, dl_canvas.width, dl_canvas.height);
        dl_context.drawImage(canvas_dark, 0, 0, dl_canvas.width, dl_canvas.height);
        dl_context.drawImage(canvas_bg, 0, 0, dl_canvas.width, dl_canvas.height);
        dl_context.drawImage(canvas_line, 0, 0, dl_canvas.width, dl_canvas.height);
        dl_canvas.toBlob(downloadImgs);//blob生成
        });


        drawLoop();
      });

    }
}

  const page = new pageMain();