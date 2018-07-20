const Scheduler = artifacts.require("./Scheduler");

module.exports = function(deployer) {
  deployer.deploy(Scheduler);
};