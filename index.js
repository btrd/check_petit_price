var request = require('request-promise');
var config = require('dotenv').config();

var sms_send = 0;

function send_sms(proposal) {
  var url = 'https://smsapi.free-mobile.fr/sendmsg?user=' + process.env.FREE_MOBILE_USER + '&pass=' + process.env.FREE_MOBILE_PASSWORD + '&msg=';
  url += '🚄 Billet de train last minute pour ' + proposal.day + ' 🎉';
  
  request(url)
  .then((res) => {
    sms_send += 1;
    console.log('Proposal send by sms', proposal)
  })
  .catch((err) => {
    console.error('Error on send_sms', err);
  });
}

function check_price_for(date, start, end) {
  request({ uri: 'http://calendar.voyages-sncf.com/cdpPetitsPrix/api/odm/v1/' + start + '/' + end + '/YOUNG?nbPassengers=1', json: true })
  .then((prices) => {
    var proposal = prices.proposalsByDay.filter((elt) => { return elt.day === date })[0];
    console.log(new Date(), proposal);
    if(proposal.proposalsNumber > 0) {
      send_sms(proposal);
    }
  })
  .catch((err) => {
    console.error('Error on check_price', err);
  });
}

setInterval(() => {
  main();
}, 10*60*1000);

var main = function() {
  if (sms_send == 2) { process.exit(); }
  check_price_for('2016-11-25', 'FRLLE', 'FRAEG');
  check_price_for('2016-11-27', 'FRAEG', 'FRLLE');
}();
