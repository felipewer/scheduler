const moment = require('moment');
const Scheduler = artifacts.require('Scheduler');

contract('Scheduler', accounts => {
  
  it('Should dispatch NewAppointment event', () => {
    return Scheduler.deployed().then(instance => {
      return instance.makeAppointment(
        'John Doe',
        'Acme Inc.',
        'john@acme.com',
        moment().add(1, 'd').unix(),
        { from: accounts[0]}
      ).then(results => {
        expect(results.logs.length).to.equal(1);
        expect(results.logs[0].event).to.equal('NewAppointment');
      })
    })
  });

});