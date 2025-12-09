class DateUtils extends Date {
  constructor(date) {
    super(date);
    this.date = date;
  }
  getFirstDateOfWeek() {
    let date = new Date(
      this.date.setDate(this.date.getDate() - ((this.date.getDay() + 6) % 7))
    );
    date.setHours(0, 0, 0, 0);
    return date;
  }
  getFirstDateOfMonth() {
    let date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    date.setHours(0, 0, 0, 0);
    return date;
  }
  getLastDateOfMonth() {
    var today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0);
  }
  getFirstDateOfYear() {
    return new Date(this.date.getFullYear(), 0, 1);
  }
  addMonths(months) {
    let date = new Date(this.date);
    date.setMonth(date.getMonth() + months);
    return date;
  }
}
exports.DateUtils = DateUtils;
