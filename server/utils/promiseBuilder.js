module.exports = {
  create: function (executor) {
    return new Promise(executor);
  }
};
