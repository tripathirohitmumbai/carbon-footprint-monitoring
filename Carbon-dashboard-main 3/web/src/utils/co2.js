const getLatestCo2Value = (arr) => {
  if (arr && arr.length > 0) {
    return arr.reduce(
      function (prev, current) {
        return +prev.year > +current.year ? prev : current;
      },
      { year: 0, value: 0 }
    );
  }
  return { year: 0, value: 0 };
};

module.exports = {
  getLatestCo2Value,
};
