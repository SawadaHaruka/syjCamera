//ファイル名の重複を避けるため、現在時刻を取得してファイル名にする
export const dlName = () => {
  let time = new Date();
  let month = time.getMonth();
  let date = time.getDate();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let seconds = time.getSeconds();
  let nameOfFile = "icon" + month + 1 + date + "_" + hours + minutes + seconds + ".png";
  return nameOfFile;
}

export const downloadImgs = (blob) => {
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  document.body.appendChild(a);
  a.download = dlName();
  a.href = url;
  a.click();
  a.remove();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 2000);
}