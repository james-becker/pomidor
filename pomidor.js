"use strict";

// NUMBER PADDING PROTOTYPE EXTENSION ===========================================

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
};

// OBJECT WATCH POLYFILL ========================================================

/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
  Object.defineProperty(Object.prototype, "watch", {
      enumerable: false
    , configurable: true
    , writable: false
    , value: function (prop, handler) {
      var
        oldval = this[prop]
      , newval = oldval
      , getter = function () {
        return newval;
      }
      , setter = function (val) {
        oldval = newval;
        return newval = handler.call(this, prop, oldval, val);
      }
      ;

      if (delete this[prop]) { // can't watch constants
        Object.defineProperty(this, prop, {
            get: getter
          , set: setter
          , enumerable: true
          , configurable: true
        });
      }
    }
  });
}

// object.unwatch
if (!Object.prototype.unwatch) {
  Object.defineProperty(Object.prototype, "unwatch", {
      enumerable: false
    , configurable: true
    , writable: false
    , value: function (prop) {
      var val = this[prop];
      delete this[prop]; // remove accessors
      this[prop] = val;
    }
  });
}

// SOUNDS ==============================================================

const sounds = {
  'alarm': new Audio(
    'https://www.dropbox.com/s/44ur0racskwcy6a/alarm.wav?raw=1'),
  'click': new Audio(
    'https://www.dropbox.com/s/0qtssx94trndp2r/pomo-click.wav?raw=1'),
  'push': new Audio(
    'https://www.dropbox.com/s/ve7g4qlm2rlnd5p/push.mp3?raw=1'),
  'tick': new Audio(
    'https://www.dropbox.com/s/7ae0eqj6ehm2hff/tick.wav?raw=1'),
  'open': new Audio(
    'https://www.dropbox.com/s/c8nva9q00cgengn/slide-open.wav?raw=1'),
  'closed': new Audio(
    'https://www.dropbox.com/s/m47zob1tocly802/slide-closed.wav?raw=1')
};

// sounds['ticking'].addEventListener('ended', function() {
//   this.currentTime = 0;
//   this.play();
// }, false);

let sound = true;

// SELECTORS ==================================================================

const hp2 = $('#h-p2');
const hp1 = $('#h-p1');
const hc = $('#h-current');
const hn1 = $('#h-n1');
const hn2 = $('#h-n2');
const mp2 = $('#m-p2');
const mp1 = $('#m-p1');
const mc = $('#m-current');
const mn1 = $('#m-n1');
const mn2 = $('#m-n2');
const sp2 = $('#s-p2');
const sp1 = $('#s-p1');
const sc = $('#s-current');
const sn1 = $('#s-n1');
const sn2 = $('#s-n2');
const bmp1 = $('#bm-p1');
const bmc = $('#bm-current');
const bmn1 = $('#bm-n1');
const bsp1 = $('#bs-p1');
const bsc = $('#bs-current');
const bsn1 = $('#bs-n1');

// LIVE TIME OBJECT ==============================================================
/* The cTime object is watched by the Object Watch Polyfill */

let cTime = { "mainTime": 0,
              "breakTime": 0 }

cTime.watch("mainTime", function (id, oldval, newval) {
  displayTime(cTime);
  console.log( "cTime." + id + " changed from " + oldval + " to " + newval );
  return newval;

});

cTime.watch("breakTime", function (id, oldval, newval) {
  displayTime(cTime);
  console.log( "cTime." + id + " changed from " + oldval + " to " + newval );
  return newval;
});

// RESET BUTTONS ==============================================================

$('.btn-reset').click(function(){
  cTime.mainTime = 0;
  cTime.breakTime = 0;
  sounds['push'].play();
})

$('.btn-pom').click(function(){
  cTime.mainTime = 1500;
  cTime.breakTime = 300;
  sounds['push'].play();
})

// MOUSEWHEEL BINDING ==============================================================
/* TODO: Refactor */

$('#hours').bind('mousewheel', function(e){
    if (e.originalEvent.wheelDelta/120 < 0) {
      if (cTime["mainTime"] < 82800) {
        cTime["mainTime"] += 3600;
      } else {
        cTime["mainTime"] = 86399;
      };
    } else {
      if (cTime["mainTime"] >= 3600) {
        cTime["mainTime"] -= 3600;
      } else {
        cTime["mainTime"] = 0;
      };
    };
    sounds['click'].play();
});

$('#minutes').bind('mousewheel', function(e){
    if(e.originalEvent.wheelDelta/120 < 0) {
      if (cTime["mainTime"] < 86400) {
        cTime["mainTime"] += 60
      } else {
        cTime["mainTime"] = 86399;
      };
    } else {
      if (cTime["mainTime"] >= 60) {
        cTime["mainTime"] -= 60;
      } else {
        cTime["mainTime"] = 0;
      };
    };
    sounds['click'].play();
});

$('#seconds').bind('mousewheel', function(e){
    if(e.originalEvent.wheelDelta/120 < 0) {
      if (cTime["mainTime"] < 86400) {
        cTime["mainTime"] += 1
      } else {
        cTime["mainTime"] = 86399;
      };
    } else {
      if (cTime["mainTime"] >= 1) {
        cTime["mainTime"] -= 1;
      } else {
        cTime["mainTime"] = 0;
      };
    };
    sounds['click'].play();
});

$('#bminutes').bind('mousewheel', function(e){
    if(e.originalEvent.wheelDelta/120 < 0) {
      if (cTime["breakTime"] <= 3600) {
        cTime["breakTime"] += 60;
      } else {
        cTime["breakTime"] = 3599;
      };
    } else {
      if (cTime["breakTime"] >= 60) {
        cTime["breakTime"] -= 60
      } else {
        cTime["breakTime"] = 0
      };
    };
    sounds['click'].play();
});

$('#bseconds').bind('mousewheel', function(e){
    if(e.originalEvent.wheelDelta/120 < 0) {
      if (cTime["breakTime"] <= 3600) {
        cTime["breakTime"] += 1
      } else {
        cTime["breakTime"] = 3599;
      }
    } else {
      if (cTime["breakTime"] >= 1) {
        cTime["breakTime"] -= 1
      } else {
        cTime["breakTime"] = 0
      };
    };
    sounds['click'].play();
});

// TIMER LOGIC ====================================================================

var running = false;

function preventTimerClicks() {
  console.log("Preventing Timer Clicks");
  // $(".ticker, .bticker, .current").unbind();
}

function allowTimerClicks() {
  $("ticker, bticker, current").on("scroll");
}

// TOGGLE SWITCH ==============================================================

$("#toggle-switch").change(function(){
  if ( $(this).is(':checked') ) {
    startTimer();
    changeSwitchBackground("#ff5500");
    sounds['open'].play();
  } else if (!$(this).is(':checked') ) {
    stopTimer();
    changeSwitchBackground("#222");
    sounds['closed'].play();
  };
});

function changeSwitchBackground(color) {
  $("#toggle-switch").css("background-color", color);
};

// var myVar = setInterval(function(){
//     if (running) {
//       cTime["mainTime"] -= 1;
//     };
// }, 1000);


function startTimer() {
  console.log("Timer started.")
  running = true;
  preventTimerClicks();
  window.countDown = setInterval(function(){
    if (cTime.mainTime == 1) {
      soundAlarm(0);
    };
    if (running) {
      cTime["mainTime"] -= 1;
      sounds['tick'].play();
      console.log("Starting at " + cTime["mainTime"]);
      displayTime(cTime);
    };
  }, 1000);
};

function stopTimer() {
  console.log("Timer stopped.")
  running = false;
  clearInterval(window.countDown);
  displayTime(cTime);
};

var paused = false;

function soundAlarm(which) {
  clearInterval(window.countDown);
  sounds['alarm'].play();
}

// CONVERT CTIME OBJECT TO ARRAY ===============================================

function cTimeToArr(cTimeObj) {
  let mLeft = cTimeObj["mainTime"];
  let mHours = Math.floor(mLeft/3600);
  mLeft = mLeft - mHours*3600;
  let mMinutes = Math.floor(mLeft/60);
  mLeft = mLeft - mMinutes*60;
  let mSeconds = mLeft;

  let bLeft = cTimeObj["breakTime"];
  let bHours = Math.floor(bLeft/3600);
  bLeft = bLeft - bHours*3600;
  let bMinutes = Math.floor(bLeft/60);
  bLeft = bLeft - bMinutes*60;
  let bSeconds = bLeft;

  let array = [[mHours, mMinutes, mSeconds],[bMinutes, bSeconds]]

  return array
}

// DISPLAY TIME ==============================================================

function displayTime(cTimeObj) {

  let cTA = cTimeToArr(cTimeObj)

  let hcInt = cTA[0][0] % 24;
  let mcInt = cTA[0][1] % 60;
  let scInt = cTA[0][2] % 60;
  let bmcInt = cTA[1][0] % 60;
  let bscInt = cTA[1][1] % 60;

  if (hcInt == 0) {
    hp2.text(22); // IMPORTANT
    hp1.text(23); // IMPORTANT
    hc.text("00");
    hn1.text("01");
    hn2.text("02");
  } else if (hcInt == 1) {
    hp2.text(23);
    hp1.text("00");
    hc.text("01");
    hn1.text("02"); // IMPORTANT
    hn2.text("03"); // IMPORTANT
  } else if (hcInt == 22) {
    hp2.text(20);
    hp1.text(21);
    hc.text(22);
    hn1.text(23); // IMPORTANT
    hn2.text("00"); // IMPORTANT
  } else if (hcInt == 23) {
    hp2.text(21);
    hp1.text(22);
    hc.text(23);
    hn1.text("00"); // IMPORTANT
    hn2.text("01"); // IMPORTANT
  } else {
    hp2.text((hcInt - 2).pad(2));
    hp1.text((hcInt - 2).pad(2));
    hc.text((hcInt).pad(2));
    hn1.text((hcInt + 1).pad(2));
    hn2.text((hcInt + 2).pad(2));
  };
  if (mcInt == 0) {
    mp2.text(58); // IMPORTANT
    mp1.text(59); // IMPORTANT
    mc.text("00");
    mn1.text("01");
    mn2.text("02");
  } else if (mcInt == 1) {
    mp2.text(59);
    mp1.text("00");
    mc.text("01");
    mn1.text("02"); // IMPORTANT
    mn2.text("03"); // IMPORTANT
  } else if (mcInt == 58) {
    mp2.text(56);
    mp1.text(57);
    mc.text(58);
    mn1.text(59); // IMPORTANT
    mn2.text("00"); // IMPORTANT
  } else if (mcInt == 59) {
    mp2.text(57);
    mp1.text(58);
    mc.text(59);
    mn1.text("00"); // IMPORTANT
    mn2.text("01"); // IMPORTANT
  } else {
    mp2.text((mcInt - 2).pad(2));
    mp1.text((mcInt - 1).pad(2));
    mc.text((mcInt).pad(2));
    mn1.text((mcInt + 1).pad(2));
    mn2.text((mcInt + 2).pad(2));
  };
  if (scInt == 0) {
    sp2.text(58); // IMPORTANT
    sp1.text(59); // IMPORTANT
    sc.text("00");
    sn1.text("01");
    sn2.text("02");
  } else if (scInt == 1) {
    sp2.text(59);
    sp1.text("00");
    sc.text("01");
    sn1.text("02"); // IMPORTANT
    sn2.text("03"); // IMPORTANT
  } else if (scInt == 58) {
    sp2.text(56);
    sp1.text(57);
    sc.text(58);
    sn1.text(59); // IMPORTANT
    sn2.text("00"); // IMPORTANT
  } else if (scInt == 59) {
    sp2.text("57");
    sp1.text("58");
    sc.text("59");
    sn1.text("00"); // IMPORTANT
    sn2.text("01"); // IMPORTANT
  } else {
    sp2.text((scInt - 2).pad(2));
    sp1.text((scInt - 1).pad(2));
    sc.text((scInt).pad(2));
    sn1.text((scInt + 1).pad(2));
    sn2.text((scInt + 2).pad(2));
  };
  if (bmcInt == 0) {
    bmp1.text(59); // IMPORTANT
    bmc.text("00");
    bmn1.text("01");
  } else if (bmcInt == 1) {
    bmp1.text("00");
    bmc.text("01");
    bmn1.text("02"); // IMPORTANT
  } else if (bmcInt == 58) {
    bmp1.text(57);
    bmc.text(58);
    bmn1.text(59); // IMPORTANT
  } else if (bmcInt == 59) {
    bmp1.text(58);
    bmc.text(59);
    bmn1.text("00"); // IMPORTANT
  } else {
    bmp1.text((bmcInt - 1).pad(2));
    bmc.text((bmcInt).pad(2));
    bmn1.text((bmcInt + 1).pad(2));
  };
  if (bscInt == 0) {
    bsp1.text(59); // IMPORTANT
    bsc.text("00");
    bsn1.text("01");
  } else if (bscInt == 1) {
    bsp1.text("00");
    bsc.text("01");
    bsn1.text("02"); // IMPORTANT
  } else if (bscInt == 58) {
    bsp1.text(57);
    bsc.text(58);
    bsn1.text(59); // IMPORTANT
  } else if (bscInt == 59) {
    bsp1.text(58);
    bsc.text(59);
    bsn1.text("00"); // IMPORTANT
  } else {
    bsp1.text((bscInt - 1).pad(2));
    bsc.text((bscInt).pad(2));
    bsn1.text((bscInt + 1).pad(2));
  };
};

displayTime(cTime);
