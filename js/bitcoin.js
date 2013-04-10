(function() {
  var App = {
    initialize: function() {
      this.$container = document.querySelectorAll('.rates')[0];
      this.template   = ['<tr>',
        '<td class="cur b-bold">{currency} ({symbol})</td>',
        '<td class="15m">{15m}</td>',
        '<td class="last">{last}</td>',
        '<td class="buy">{buy}</td>',
        '<td class="sell">{sell}</td>',
        '<td class="24h">{24h}</td>',
      '</tr>'].join('');

      this.data(App.onsuccess, App.onerror);
    },

    render: function(t, m) {
      return t.replace(/{([^}]+)}/g, function(__, key) {
        return m[key];
      });
    },

    data: function(onsuccess, onerror) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if(this.readyState == 4) {
          if(this.status >= 200 && this.status < 300) {
            onsuccess(JSON.parse(this.responseText));
          }
          else {
            onerror(this.responseText);
          }
        }
      };

      xhr.open('GET', 'http://blockchain.info/ticker');
      xhr.send();
    },

    onsuccess: function(rr) {
      var $rr = document.querySelectorAll('.rates')[0];
      if($rr) {
        $rr.innerHTML = _.foldl(rr, function($rr, r, cur) {
          return $rr + App.render(App.template, _.extend(r, {
            currency: cur
          }));
        }, '');
      }
      else {
        document.write('ERROR');
      }
    },

    onerror: function(e) {
      document.write('ERROR');
    }
  };

  App.initialize();
})();
