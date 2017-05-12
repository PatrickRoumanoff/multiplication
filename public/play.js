var game = {};

function play(selected) {
  $("#setup-area").animate({
    height: "toggle"
  });
  $("#play-area").animate({
    height: "toggle"
  });
  game.score = 0;
  game.tables = {};
  selected.forEach(t => game.tables[t] = {});  
  game.start = new Date();
  game.new = true;
  loop();
}

function random(max) {
  return Math.floor(Math.random() * max) + 1;
}

function randomArrayValue(array) {
  return array[random(array.length) - 1];
}

function randomKey(object) {
  return randomArrayValue(Object.keys(object));
}

function randomValue(object) {
  return object[randomKey(object)];
}

function getLeastKnowQuestion(table) {
  //if we have 0 score questions, start with those
  var zero = table.filter(q => q.score === 0);
  if(zero.length > 0) {
    return randomArrayValue(zero);
  }
  var sum = 0;
  table.forEach(q=> {q.min = sum; sum += (20-q.score); q.max = sum;});
  var choice = random(sum);
  return table.filter(q => q.min<= choice && choice <= q.max)[0];
}

function getQuestion() {
  var table = getMemory()[randomKey(game.tables)];
  console.log(table);
  return getLeastKnowQuestion(table);
}

function setupNewQuestion() {
  game.new = false;
  game.question = getQuestion().q;
  console.log(game.question);
  game.questionStart = new Date();
  $("#play1").text(game.question[1]);
  if(game.question.guess === 2) {
    $("#play2").text("");
    $("#play2").prop("contenteditable", true);
    $("#play2").focus();
    $("#play3").text(game.question[3]);
    $("#play3").prop("contenteditable", false);
  }
  if(game.question.guess === 3) {
    $("#play2").text(game.question[2]);
    $("#play2").prop("contenteditable", false);
    $("#play3").prop("contenteditable", true);
    $("#play3").text("");
    $("#play3").focus();
  }  
}

function getSecondsSince(start) {
  return Math.floor((new Date() - start)/1000);
}

function getTime() {
  return getSecondsSince(game.start);
}

function getScore() {
  var score = Math.max(0, 20 - getSecondsSince(game.questionStart));
  if (score >= 18) {
    score = 20;
  }
  return score;
}

function checkAnswer() {
  $("#timer").text(getTime());
  var score = 0;
  var q = game.question
  if(q.guess === 2) {
    if($("#play2").text() == q[2]) {
      score = getScore();
      game.new = true;
    }
  }
  if(q.guess === 3) {
    if($("#play3").text() == q[3]) {
      score = getScore();
      game.new = true;
    }
  }
  if(score > 0) {
    game.score += score;
    $("#score").text(game.score);
    saveScore(q, score);
    var div 
    if(q.guess === 2) {
      div = $(`<div><span class="number">${q[1]}</span>x<span class="number">&nbsp;</span>=<span class="number">${q[3]}</span> ${score}</div>`);
    } else {
      div = $(`<div><span class="number">${q[1]}</span>x<span class="number">${q[2]}</span>=<span class="number">&nbsp;</span> ${score}</div>`);
    }
    $("#past").append(div);
  }
}

function loop() {
  if(game.new) {
    setupNewQuestion();
  } else {
    checkAnswer();
  }
  setTimeout(loop, 500);
}

function stop() {
  $("#setup-area").animate({
    height: "toggle"
  });
  $("#play-area").animate({
    height: "toggle"
  });
  $("#play1").html("&nbsp;");
  $("#play2").html("&nbsp;");
  $("#play3").html("&nbsp;");
  $("#play2").prop("contenteditable", false);
  $("#play3").prop("contenteditable", false);
}