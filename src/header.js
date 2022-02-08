export class Header {
  constructor() {
    //メニューをトグル
    const btn = document.querySelector('.hamburger');
    const nav = document.querySelector('.menu');

    let opened = true;

    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      nav.classList.toggle('open');

      //メニューを開いているときはスクロールできないようにする
      if (opened === true) {
        //スクロール禁止
        document.addEventListener('touchmove', disableScroll, { passive: false });
        document.body.classList.add('overflow-hidden');
        opened = false;
      } else if (opened === false) {
        //スクロール禁止を解除
        document.removeEventListener('touchmove', disableScroll, { passive: false });
        document.body.classList.remove('overflow-hidden');
        opened = true;
      }
    });

    //スクロールを禁止にする関数
    const disableScroll = (evt) => {
      evt.preventDefault();
    }

  }
}