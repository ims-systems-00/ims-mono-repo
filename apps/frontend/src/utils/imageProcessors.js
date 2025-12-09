export function downScaleImage(image, fileName) {
  return new Promise((resolve, reject) => {
    const virtualImage = new Image();
    virtualImage.src = image;
    const virtualImageMime = image?.substring(
      image.indexOf(":") + 1,
      image.indexOf(";")
    );
    virtualImage.onload = function (e) {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 400;
      const scaleSize = MAX_WIDTH / e.target.width;
      canvas.width = MAX_WIDTH;
      canvas.height = virtualImage.height * scaleSize;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(function (file) {
        let processedFile = new File([file], fileName, {
          type: virtualImageMime,
          lastModified: Date.now(),
        });
        return resolve(processedFile);
      }, virtualImageMime);
    };
    virtualImage.onerror = reject;
  });
}
