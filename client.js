/**
 * client
 * Created by dcorns on 4/15/15.
 */
'use strict';
function main(){
  var imagesIn = [];
  var barChart;
  var tracker = {
    selected:[]
    , checkSelected: function(checkIdx){
      var c = 0;
      var len = this.selected.length;
      for(c; c < len; c++){
        if(this.selected[c] === checkIdx) return true;
      }
      return false;
    },
    addImageIdx: function(idx){
      if(!(this.checkSelected(idx))){
        this.selected.push(idx);
        return idx;
      }else{
        return -1;
      }
    },
    resetSelected: function(){
      this.selected.length = 0;
    }
  };

  //Aquire image data, add image objects to imagesIn++++++++++++++++++++++
  ajaxGet('https://api.imgur.com/3/album/DDoWy', function(err, response){
    if(err) alert(err.XMLHttpRequestError);
    var c = 0;
    var len = response.data.images.length;
    for(c; c < len; c++){
      imagesIn.push(response.data.images[c]);
      imagesIn[c].votes = 0;
    }
    nextF();
  }, 'Client-ID a5ed186e4fdf274');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  function nextF(){
    var pic1 = document.getElementById('img1');
    var pic2 = document.getElementById('img2');
    pic1.addEventListener('click', function(e){
      var idx = e.target.dataset.idx;
      imagesIn[idx].votes += 1;
      barChart.datasets[0].bars[idx].value = imagesIn[idx].votes;
      barChart.update();
      setPic(pic2, pic1);
    });
    pic2.addEventListener('click', function(e){
      var idx = e.target.dataset.idx;
      imagesIn[idx].votes += 1;
      barChart.datasets[0].bars[idx].value = imagesIn[idx].votes;
      barChart.update();
      setPic(pic1, pic2);
    });
    document.getElementById('btnZeroOut').addEventListener('click', function(e){
      zeroOutVotes();
      setPic(pic1);
      setPic(pic2);
    });
    setPic(pic1);
    setPic(pic2);
    buildChart();

  }

  function buildChart(){
    var ctx = document.getElementById("csv").getContext("2d");
    var c = 0, len = imagesIn.length, data = {labels:[], datasets: [{data:[]}]};
    for(c; c < len; c++){
      data.labels.push(imagesIn[c].id);
      data.datasets[0].data.push(imagesIn[c].votes);
    }
    barChart = new Chart(ctx).Bar(data);
  }

  function zeroOutVotes(){
    var c = 0;
    var len = imagesIn.length;
    for(c; c < len; c++){
      imagesIn[c].votes = 0;
    }
  }
//sets the new image to an image that is not already displayed, don't want to vote against yourself
  function setPic(pic, otherPic){
    var picNew, otherIdx;
    if(otherPic) otherIdx = otherPic.dataset.idx;
    else otherIdx = -1;
    do{
      picNew = getNewImage();
    }while(picNew.idx == otherIdx);
    pic.setAttribute('src', picNew.img);
    pic.setAttribute('data-idx', picNew.idx);
  }
//gets a random image that has not yet been used and if all have been used resets to cycle through again
  function getNewImage(){
    var sLen = tracker.selected.length;
    var iLen = imagesIn.length;
    var idx;
    if(sLen < iLen - 1){
      idx = getRandomInt(iLen);
      while(!(tracker.addImageIdx(idx) === idx)){
        idx = getRandomInt(iLen);
      }
    }else{
      tracker.resetSelected();
      idx = getRandomInt(iLen);
    }
    return {idx: idx, img: imagesIn[idx].link};
  }

}



function getRandomInt(maxInt){
  return Math.floor(Math.random() * (maxInt - 1));
}

function ajaxGet (url, cb, token) {
  var ajaxReq = new XMLHttpRequest();
  ajaxReq.addEventListener('load', function () {
    if (ajaxReq.status === 200) cb(null, JSON.parse(ajaxReq.responseText));
    else cb(JSON.parse(ajaxReq.response), null);
  });
  ajaxReq.addEventListener('error', function (data) {
    cb({XMLHttpRequestError: 'A fatal error occurred, see console for more information'}, null);
  });

//Must open before setting request header, so this orageDatader is required
  ajaxReq.open('GET', url, true);
  //ajaxReq.setRequestHeader('Content-Type', 'application/json');
  if (token) {
    ajaxReq.setRequestHeader('Authorization', token);
  }
  ajaxReq.send();
}


document.addEventListener('load', main());