let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let radius = 50;
let x = canvas.width / 2;
let y = canvas.height / 2;

function draw_line(start_x, start_y, end_x, end_y){
    ctx.beginPath();
    ctx.moveTo(start_x, start_y);
    ctx.lineTo(end_x, end_y);
    ctx.stroke();
    ctx.closePath();
}

function draw(){
    ctx.strokeStyle = "black";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

    draw_line(x, y+radius, x, y+radius+100);
    draw_line(x, y+radius+10, x+radius, y+radius+100);
    draw_line(x, y+radius+10, x-radius, y+radius+100);
    draw_line(x, y+radius+100, x+radius, y+radius+200);
    draw_line(x, y+radius+100, x-radius, y+radius+200);
}

setInterval(draw, 10);