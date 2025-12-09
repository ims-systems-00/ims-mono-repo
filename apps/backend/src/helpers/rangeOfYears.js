function getYearsInRange(startYear = 1980, endYear = 2070) {
  return function () {
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };
}
module.exports = { getYearsInRange };
