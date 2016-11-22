var request = require('request-promise');
var config = require('dotenv').config();

var sms_send = false;

function send_sms(proposal) {
  var url = 'https://smsapi.free-mobile.fr/sendmsg?user=' + process.env.FREE_MOBILE_USER + '&pass=' + process.env.FREE_MOBILE_PASSWORD + '&msg=';
  url += '🚄 Billet de train last minute pour ' + proposal.day + ' 🎉';
  
  request(url)
  .then((res) => {
    sms_send = true;
    console.log('Proposal send by sms', proposal)
  })
  .catch((err) => {
    console.error('Error on send_sms', err);
  });
}

function check_price_for(date) {
  request({ uri: 'http://calendar.voyages-sncf.com/cdpPetitsPrix/api/odm/v1/FRLLE/FRAEG/YOUNG?nbPassengers=1', json: true })
  .then((prices) => {
    var proposal = prices.proposalsByDay.filter((elt) => { return elt.day === date })[0];

    if(proposal.proposalsNumber > 0) {
      send_sms(proposal);
    }
  })
  .catch((err) => {
    console.error('Error on check_price', err);
  });
}

setInterval(() => {
  if (sms_send) { process.exit(); }
  check_price_for('2016-11-25');
}, 10*60*1000);
