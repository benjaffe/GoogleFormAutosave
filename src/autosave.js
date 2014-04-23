var Autosave = function($) {

  var EXPIRATION = 5; // in minutes
  var POLL_TIME = 30; // in seconds
  var _this = this;
  this.fieldData = {};

  $('.ss-form-container').prepend('<h5 class="saved-message" style="color: red; float: right;">Form information was saved</h5>');
  $('.saved-message').hide();

  this.setFieldData = function(fieldData) {
    _this.fieldData = {
      data: fieldData,
      time: (new Date()).getTime()
    };
    var json = JSON.stringify(_this.fieldData);
    localStorage.setItem($('title').text(), json);
    _this.savedMessage();
  };

  this.scrapeData = function() {
    var fieldList, len, i, fieldData = {};

    // inputs first
    fieldList = $('input[type="text"][id], input[type="date"][id], input[type="time"][id]');
    len = fieldList.length;
    fieldData.input = [];
    for (i = 0; i < len; i++) {
      fieldData.input.push({
        id: $(fieldList[i]).attr('id'),
        value: $(fieldList[i]).val()
      });
    }

    // textarea next
    fieldList = $('textarea[id]');
    len = fieldList.length;
    fieldData.textarea = [];
    for (i = 0; i < len; i++) {
      fieldData.textarea.push({
        id: $(fieldList[i]).attr('id'),
        value: $(fieldList[i]).val()
      });
    }

    // checkboxes and radiobuttons
    fieldList = $('input[type="checkbox"][id], input[type="radio"][id]');
    len = fieldList.length;
    fieldData.buttons = [];
    for (i = 0; i < len; i++) {
      fieldData.buttons.push({
        id: $(fieldList[i]).attr('id'),
        value: $(fieldList[i]).prop('checked')
      });
    }

    return fieldData;
  };

  this.backupExists = function() {
    var json = localStorage.getItem($('title').text());
    if (json) {
      var packet = $.parseJSON(json);
      if (packet.time + (EXPIRATION * 60 * 1000) >= (new Date()).getTime()) {
        _this.restoreData(packet.data);
        var msg = $('<h5 class="restored-message" style="color: red; float: right;"> Backup restored </h5>');
        $('.ss-form-container').prepend(msg);
        msg.show().delay(2000).fadeOut(1000, function() {
          this.remove();
        });
      } else {
        localStorage.removeItem($('title').text());
      }
    }
  };

  this.restoreData = function(data) {
    var i;
    for (i = 0; i < data.input.length; i++) {
      $('[id="' + data.input[i].id + '"').val(data.input[i].value);
    }
    for (i = 0; i < data.textarea.length; i++) {
      $('[id="' + data.textarea[i].id + '"').val(data.textarea[i].value);
    }
    for (i = 0; i < data.buttons.length; i++) {
      $('[id="' + data.buttons[i].id + '"').prop('checked', data.buttons[i].value);
    }
  };

  this.savedMessage = function() {
    $('.saved-message').show().delay(2000).fadeOut(1000);
  };

  setInterval(function() {
    _this.setFieldData(_this.scrapeData());
    console.log(_this.fieldData);
  }, POLL_TIME * 1000);

  $('input[type="submit"]').click(function() {
    localStorage.removeItem($('title').text());
  });

  this.backupExists();

};

var autosave = new Autosave($);