let asynchronously = async (promise) => {
  try {
    return [null, await promise];
  } catch (error) {
    console.log(error);
    return [error, null];
  }
};
exports.asynchronously = asynchronously;
