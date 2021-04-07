
var lastCalledTime;
var last = [];

export function getFPS(time) {
  if(!lastCalledTime) {
     lastCalledTime = time
     return 0;
  }
  var delta = (time - lastCalledTime)/1000;
  lastCalledTime = time;
  last.push(1/delta);
  if(last.length >= 120) last.shift();
  return last.reduce((a, b) => a + b, 0) / last.length;
}