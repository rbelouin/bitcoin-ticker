(function() {
  var App = {
    initialize: function() {
      this.$container = document.querySelectorAll('.rates')[0];
      this.template   = ['<tr class="b-row">',
        '<td class="currency b-cell b-cell__bold">{currency} ({symbol})</td>',
        '<td class="15m b-cell b-cell__num">{15m}</td>',
        '<td class="last b-cell b-cell__num">{last}</td>',
        '<td class="buy b-cell b-cell__num">{buy}</td>',
        '<td class="sell b-cell b-cell__num">{sell}</td>',
        '<td class="24h b-cell b-cell__num">{24h}</td>',
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
        $rr.innerHTML = _.chain(rr)
          .map(function(r, cur) { return _.extend(r, {currency: cur}); })
          .sortBy(function(r) { return r.currency; })
          .foldl(function($rr, r) {
            return $rr + App.render(App.template, r);
          }, '')
          .value();
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
