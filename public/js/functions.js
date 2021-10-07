function showMessage(message, time){
  let div = document.getElementById("message");
  div.style.opacity = "1";
  div.innerHTML = message;
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      div.style.opacity = "0";
      resolve();
    }, time * 1000);
  });
}

function showMessage2(message, time){
  let div = document.getElementById("message2");
  div.style.opacity = "1";
  div.innerHTML = message;
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      div.style.opacity = "0";
      resolve();
    }, time * 1000);
  });
}

function showMessage3(message){
  let div = document.getElementById("message");
  div.style.opacity = "1";
  div.innerHTML = message;
}