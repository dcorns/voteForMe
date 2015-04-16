/**
 * client
 * Created by dcorns on 4/15/15.
 */
'use strict';
function main(){
  var imagesIn = [];
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
      console.dir(this.selected);
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
      imagesIn[e.target.dataset.idx].votes += 1;
      console.log(imagesIn[e.target.dataset.idx].votes);
      var chgImg = getNewImage();
      pic2.setAttribute('src', chgImg.img);
      pic2.setAttribute('data-idx', chgImg.idx);
    });
    pic2.addEventListener('click', function(e){
      imagesIn[e.target.dataset.idx].votes += 1;
      console.log(imagesIn[e.target.dataset.idx].votes);
      var chgImg = getNewImage();
      pic1.setAttribute('src', chgImg.img);
      pic1.setAttribute('data-idx', chgImg.idx);
    });
    document.getElementById('btnLoadMatch').addEventListener('click', function(e){
      pic1.setAttribute('src', getNewImage().img);
      pic2.setAttribute('src', getNewImage().img);
    });
    var picNew = getNewImage();
    pic1.setAttribute('src', picNew.img);
    pic1.setAttribute('data-idx', picNew.idx);
    picNew = getNewImage();
    pic2.setAttribute('src', picNew.img);
    pic2.setAttribute('data-idx', picNew.idx);
  }

  function getNewImage(oppositeImg){
    var opImg = oppositeImg || -1;
    var sLen = tracker.selected.length;
    var iLen = imagesIn.length;
    var idx;
    if(sLen < iLen - 1){
      idx = getRandomInt(iLen);
      while(!(tracker.addImageIdx(idx) === idx)){
        var newIdx = getRandomInt(iLen);
        if(!(opImg == newIdx)) idx = newIdx;
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