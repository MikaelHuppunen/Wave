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

let neck_base = [canvas.width/2, canvas.height/2-torso_length];

let body_angle = Math.PI/2;
let neck_angle = -Math.PI/2;
let head_angle = -Math.PI/2;
let right_arm_angle = 0;
let left_arm_angle = Math.PI;
let right_forearm_angle = 0;
let left_forearm_angle = Math.PI;
let right_wrist_angle = 0;
let left_wrist_angle = Math.PI;
let right_leg_angle = Math.PI/4;
let left_leg_angle = 3*Math.PI/4;
let right_knee_angle = Math.PI/2;
let left_knee_angle = Math.PI/2;


let ass = calculate_position(neck_base, body_angle, torso_length);
let right_elbow = calculate_position(neck_base, right_arm_angle, arm_length);
let left_elbow = calculate_position(neck_base, left_arm_angle, arm_length);
let right_wrist = calculate_position(right_elbow, right_forearm_angle, forearm_length);
let left_wrist = calculate_position(left_elbow, left_forearm_angle, forearm_length);
let right_fingertips = calculate_position(right_wrist, right_wrist_angle, hand_length);
let left_fingertips = calculate_position(left_wrist, left_wrist_angle, hand_length);

let baseline_y = canvas.height / 2 - torso_length;
let middle_x = canvas.width / 2;
let mass = 1.0;
let time = 0;
let meters_per_pixel = 0.01;
let wave_speed = 4;

function draw_line(start_position, end_position){
    ctx.beginPath();
    ctx.moveTo(start_position[0], start_position[1]);
    ctx.lineTo(end_position[0], end_position[1]);
    ctx.stroke();
    ctx.closePath();
}

function draw_circle(center, radius){
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();
}

function calculate_position(start_position, angle, length){
    return [start_position[0]+Math.cos(angle)*length, start_position[1]+Math.sin(angle)*length];
}

function move_randomly(speed){
    body_angle += speed*(Math.random()-0.5);
    neck_angle += speed*(Math.random()-0.5);
    head_angle += speed*(Math.random()-0.5);
    right_arm_angle += speed*(Math.random()-0.5);
    left_arm_angle += speed*(Math.random()-0.5);
    right_forearm_angle += speed*(Math.random()-0.5);
    left_forearm_angle += speed*(Math.random()-0.5);
    right_wrist_angle += speed*(Math.random()-0.5);
    left_wrist_angle += speed*(Math.random()-0.5);
    right_leg_angle += speed*(Math.random()-0.5);
    left_leg_angle += speed*(Math.random()-0.5);
    right_knee_angle += speed*(Math.random()-0.5);
    left_knee_angle += speed*(Math.random()-0.5);
}

function calculate_torque(wave_function, time, start_position, end_position, angle, dx){
    let torque = 0;
    let direction = Math.sign(end_position[0]-start_position[0]);
    if(direction == 0){
        return 0;
    }
    for(let x = start_position[0]; direction*x <= direction*end_position[0]; x += dx*(end_position[0]-start_position[0])){
        let y = calculate_position(start_position, angle, Math.abs(x-end_position[0]))[1];
        torque += (wave_function(x, time)-y)*(end_position[0]-x)*dx*Math.abs(end_position[0]-start_position[0]);
    }
    return torque;
}

function angle_change(length, torque, dt){
    let moment_of_inertia = 1/3*mass*(length**2);
    let angular_acceleration = torque/moment_of_inertia;
    return 1/2*angular_acceleration*dt;
}

function zero_wave(x, time){
    return baseline_y;
}

function sine_wave(x, time){
    return baseline_y-0.3*Math.sin(meters_per_pixel*(x-middle_x)+wave_speed*time)/meters_per_pixel
}

function wave(wave_function, time, dt, dx){
    neck_base[1] = wave_function(middle_x, time);
    let torque = calculate_torque(wave_function, time, neck_base, right_elbow, right_arm_angle, dx);
    right_arm_angle += angle_change(arm_length, torque, dt);
    torque = calculate_torque(wave_function, time, neck_base, left_elbow, left_arm_angle, dx);
    left_arm_angle += angle_change(arm_length, torque, dt);
    torque = calculate_torque(wave_function, time, right_elbow, right_wrist, right_forearm_angle, dx);
    right_forearm_angle += angle_change(forearm_length, torque, dt);
    torque = calculate_torque(wave_function, time, left_elbow, left_wrist, left_forearm_angle, dx);
    left_forearm_angle += angle_change(forearm_length, torque, dt);
    torque = calculate_torque(wave_function, time, right_wrist, right_fingertips, right_wrist_angle, dx);
    right_wrist_angle += angle_change(hand_length, torque, dt);
    torque = calculate_torque(wave_function, time, left_wrist, left_fingertips, left_wrist_angle, dx);
    left_wrist_angle += angle_change(hand_length, torque, dt);
}

function draw(){
    for(let i = 0; i < 10; i++){
        wave(sine_wave, time, 0.01*1E-1, 1E-3);
    }
    ctx.strokeStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //torso
    ass = calculate_position(neck_base, body_angle, torso_length);
    draw_line(neck_base, ass);
    //neck
    head_base = calculate_position(neck_base, neck_angle, neck_length);
    draw_line(neck_base, head_base);
    //head
    head_center = calculate_position(head_base, head_angle, head_radius);
    draw_circle(head_center,head_radius);
    //arms
    right_elbow = calculate_position(neck_base, right_arm_angle, arm_length);
    left_elbow = calculate_position(neck_base, left_arm_angle, arm_length);
    draw_line(neck_base, right_elbow);
    draw_line(neck_base, left_elbow);

    right_wrist = calculate_position(right_elbow, right_forearm_angle, forearm_length);
    left_wrist = calculate_position(left_elbow, left_forearm_angle, forearm_length);
    draw_line(right_elbow, right_wrist);
    draw_line(left_elbow, left_wrist);

    right_fingertips = calculate_position(right_wrist, right_wrist_angle, hand_length);
    left_fingertips = calculate_position(left_wrist, left_wrist_angle, hand_length);
    draw_line(right_wrist, right_fingertips);
    draw_line(left_wrist, left_fingertips);
    //legs
    right_knee = calculate_position(ass, right_leg_angle, leg_length);
    left_knee = calculate_position(ass, left_leg_angle, leg_length)
    draw_line(ass, right_knee);
    draw_line(ass, left_knee);
    
    right_foot = calculate_position(right_knee, right_knee_angle, shin_length);
    left_foot = calculate_position(left_knee, left_knee_angle, shin_length);
    draw_line(right_knee, right_foot);
    draw_line(left_knee, left_foot);

    time += 0.01;
}

setInterval(draw, 10);