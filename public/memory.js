var memory = {};

function keyFromQuestion(q) {
  return `${q[1]},${q[2]},${q[3]},${q.guess}`;
}

function questionFromKey(key) {
  var split = key.split(",");
  return {1: +split[0], 2: +split[1], 3: +split[2], guess: +split[3]};
}

function makeQuestion(i, j, t){
  return {1: i, 2: j, 3: i * j, guess: t};
}

function initialise() {
  var i, j, t, q, result = {};
  for(i = 1; i <= 12; i++) {
    result[i] = [];
    for(j = 1; j <= 12; j++) {
      for(t = 2; t <= 3; t++) {
        q = makeQuestion(i, j, t);
        result[i].push({q: q, score: 0});
      }
    }  
  }
  return result;
}

function getMemory() {
  var item = localStorage.getItem("memory");
  if(item === null) {
    memory = initialise();
    setMemory(memory);
  } else {
    memory = JSON.parse(item);
  }
  return memory;
}

function setMemory(memory) {
  return localStorage.setItem("memory", JSON.stringify(memory));
}

function clearMemory() {
  localStorage.clear();
}

function getKey(q) {
  return q[2] * 2 - 2 + (q.guess - 2);
}

function saveScore(q, score) {
  var key = getKey(q);
  var memory = getMemory();
  var m = memory[q[1]][key];
  m.score = Math.max(score, m.score);
  setMemory(memory);
}
