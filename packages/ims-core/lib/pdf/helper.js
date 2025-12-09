const staticAssetPath = __dirname + "/../../assets";

class PdfHelper {
  /**
   * This contains
   * @param {import('pdfkit')} doc - this recives a pdf kit document object.
   */
  constructor(doc) {
    if (!doc)
      throw new Error("Document reference is required to write someting.");
    this.doc = doc;
    this.margins = doc.page.margins;
  }
  jumpLine(lines) {
    for (let index = 0; index < lines; index++) {
      this.doc.moveDown();
    }
  }
  renderList(list = [], options) {
    for (let item of list) {
      this.doc.image(
        staticAssetPath + "/images/report-square-bullet.png",
        this.doc.x,
        this.doc.y,
        {
          fit: [20, 20],
        }
      );
      this.doc.text(item.toString(), {
        lineGap: 10,
        indent: 31,
      });
    }
    return this;
  }
  shallOverlap(items = []) {
    let _stringWidthDevidingFactor =
      this.doc.page.width -
      this.doc.page.margins.left +
      this.doc.page.margins.left;
    let _stringHeightDevidingFactor =
      this.doc.page.height -
      this.doc.page.margins.top +
      this.doc.page.margins.bottom;
    let joinedString = items.map((item) => item.toString()).join(" ");
    this.doc.widthOfString(joinedString) / _stringWidthDevidingFactor;
    return this;
  }
}
module.exports = PdfHelper;
