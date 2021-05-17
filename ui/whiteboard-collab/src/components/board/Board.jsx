import React, {setState, useEffect} from 'react';
import './style.css';
import io from 'socket.io-client';

function Board (props) {
  // console.log(props)
  let timeout = 0
  const socket = io.connect('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });
  let ctx = 0
  const isDrawing = false
    //receive the event of server
  socket.on('canvas-data', function(data){
    var root = this
    var interval = setInterval(function(){
      if (root.isDrawing) return
      root.isDrawing = true;
      clearInterval(interval);
      var image = new Image();
      var canvas = document.querySelector('#board');
      var ctx = canvas.getContext('2d');
      // console.log(ctx)
      image.onload = function(){
        ctx.drawImage(image, 0, 0);

        root.isDrawing = false;
      };
      image.src = data
      // console.log(image.src)
    },200)
  })
  useEffect(()=>drawOnCanvas(), [props.color, props.size])

  // componentWillReceiveProps(newProps){
  //   this.ctx.strokeStyle = newProps.color;
  //   this.ctx.lineWidth = newProps.size;
  // }

  const drawOnCanvas = () => {
    // var canvas = document.querySelector('#board');
    var canvas = document.getElementById('board');
    ctx = canvas.getContext('2d');
    var ctx = ctx
    var sketch = document.querySelector('#sketch');
    var sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    var mouse = {x: 0, y: 0};
    var last_mouse = {x: 0, y: 0};

    /* Mouse Capturing Work */
    canvas.addEventListener('mousemove', function(e) {
        last_mouse.x = mouse.x;
        last_mouse.y = mouse.y;

        mouse.x = e.pageX - this.offsetLeft;
        mouse.y = e.pageY - this.offsetTop;
    }, false);


    /* Drawing on Paint App */
    ctx.lineWidth = props.size;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = props.color;

    canvas.addEventListener('mousedown', function(e) {
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);
    var onPaint = function() {
        ctx.beginPath();
        ctx.moveTo(last_mouse.x, last_mouse.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.closePath();
        ctx.stroke();
        // clear single settimeout function not the earlier one
        if (timeout !== undefined) clearTimeout(timeout);
        timeout = setTimeout(function () {
          const base64ImageData = canvas.toDataURL('image/png');
          props.setImageUrl(base64ImageData)
          //console.log(base64ImageData)
          socket.emit('canvas-data',base64ImageData)
        }, 500);
    };
  }
  return (
    <div className='sketch' id = 'sketch'>
      <canvas className='board' id='board'></canvas>
    </div>
  )
}

export default Board
