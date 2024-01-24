let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let person_height = 400;
let head_radius = person_height/16;
let leg_length = person_height/4;
let shin_length = person_height/4;
let arm_length = 1.67/8*person_height;
let forearm_length = 1/8*person_height;
let torso_length = 2.67/8*person_height;
let neck_length = 0.33/8*person_height;
let hand_length = 0.75/8*person_height;
let x = canvas.width / 2;
let y = canvas.height / 4;

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
    ctx.arc(x, y, head_radius, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

    draw_line(x, y+head_radius, x, y+head_radius+neck_length);
    draw_line(x, y+head_radius+neck_length, x, y+head_radius+neck_length+torso_length);
    //arms
    draw_line(x, y+head_radius+neck_length, x+head_radius, y+head_radius+neck_length+arm_length);
    draw_line(x, y+head_radius+neck_length, x-head_radius, y+head_radius+neck_length+arm_length);
    draw_line(x+head_radius, y+head_radius+neck_length+arm_length, x+head_radius, y+head_radius+neck_length+arm_length+forearm_length);
    draw_line(x-head_radius, y+head_radius+neck_length+arm_length, x-head_radius, y+head_radius+neck_length+arm_length+forearm_length);
    draw_line(x+head_radius, y+head_radius+neck_length+arm_length+forearm_length, x+head_radius, y+head_radius+neck_length+arm_length+forearm_length+hand_length);
    draw_line(x-head_radius, y+head_radius+neck_length+arm_length+forearm_length, x-head_radius, y+head_radius+neck_length+arm_length+forearm_length+hand_length);
    //legs
    draw_line(x, y+head_radius+neck_length+torso_length, x+head_radius, y+head_radius+neck_length+torso_length+leg_length);
    draw_line(x, y+head_radius+neck_length+torso_length, x-head_radius, y+head_radius+neck_length+torso_length+leg_length);
    draw_line(x+head_radius, y+head_radius+neck_length+torso_length+leg_length, x+head_radius, y+head_radius+neck_length+torso_length+leg_length+shin_length);
    draw_line(x-head_radius, y+head_radius+neck_length+torso_length+leg_length, x-head_radius, y+head_radius+neck_length+torso_length+leg_length+shin_length);
}

setInterval(draw, 10);