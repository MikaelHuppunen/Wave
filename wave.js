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
let floor_height = 450;
let right_foot = [340, floor_height];
let left_foot = [268, floor_height];

let body_angle = Math.PI/2;
let neck_angle = -Math.PI/2;
let head_angle = -Math.PI/2;
let right_arm_angle = 0;
let left_arm_angle = Math.PI;
let right_forearm_angle = 0;
let left_forearm_angle = Math.PI;
let right_wrist_angle = 0;
let left_wrist_angle = Math.PI;
let right_leg_angle = 5*Math.PI/16;
let left_leg_angle = 11*Math.PI/16;
let right_knee_angle = 11*Math.PI/16;
let left_knee_angle = 5*Math.PI/16;


let ass = calculate_position(neck_base, body_angle, torso_length);
let right_elbow = calculate_position(neck_base, right_arm_angle, arm_length);
let left_elbow = calculate_position(neck_base, left_arm_angle, arm_length);
let right_wrist = calculate_position(right_elbow, right_forearm_angle, forearm_length);
let left_wrist = calculate_position(left_elbow, left_forearm_angle, forearm_length);
let right_fingertips = calculate_position(right_wrist, right_wrist_angle, hand_length);
let left_fingertips = calculate_position(left_wrist, left_wrist_angle, hand_length);

let baseline_y = canvas.height / 2 - torso_length;
let middle_x = canvas.width / 2;
let mass = 1.0E8;
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
    let margin_of_error = 1E-6
    for(let x = start_position[0]; direction*x <= direction*end_position[0]-margin_of_error; x += dx*(end_position[0]-start_position[0])){
        let y = calculate_position(start_position, angle, Math.abs(x-start_position[0]))[1];
        torque += (wave_function(x, time)-y)*(x-start_position[0])*dx*Math.abs(end_position[0]-start_position[0]);
    }
    return torque;
}

function zero_wave(x, time){
    return baseline_y;
}

function sine_wave(x, time){
    return baseline_y-0.3*Math.sin(meters_per_pixel*(x-middle_x)+wave_speed*time)/meters_per_pixel
}

function sine_wave(x, time){
    return baseline_y-0.3*Math.sin(meters_per_pixel*(x-middle_x)+wave_speed*time)/meters_per_pixel
}

function mirror_wave(x, time){
    return baseline_y-0.3*Math.sin(meters_per_pixel*Math.abs(x-middle_x)+wave_speed*time)/meters_per_pixel
}

function square_wave(x, time){
    return baseline_y-0.3*Math.sign(Math.sin(meters_per_pixel*(x-middle_x)+wave_speed*time))/meters_per_pixel
}

function triangle_wave(x, time){
    return baseline_y-0.3*Math.asin(Math.sin(meters_per_pixel*(x-middle_x)+wave_speed*time))/meters_per_pixel
}

function wave(wave_function, time, dt, dx){
    right_arm_angle -= Math.atan(2*(wave_function(middle_x, time)-neck_base[1])/(right_elbow[0]-neck_base[0]));
    left_arm_angle -= Math.atan(2*(wave_function(middle_x, time)-neck_base[1])/(left_elbow[0]-neck_base[0]));
    neck_base[1] = wave_function(middle_x, time);

    //right arm
    let torque = calculate_torque(wave_function, time, neck_base, right_elbow, right_arm_angle, dx);
    let angle_change = torque/mass;
    right_arm_angle += angle_change;
    right_forearm_angle -= angle_change;

    torque = calculate_torque(wave_function, time, right_elbow, right_wrist, right_forearm_angle, dx);
    angle_change = torque/mass;
    right_forearm_angle += angle_change;
    right_wrist_angle -= angle_change;

    torque = calculate_torque(wave_function, time, right_wrist, right_fingertips, right_wrist_angle, dx);
    angle_change = torque/mass;
    right_wrist_angle += angle_change;

    //left arm
    torque = calculate_torque(wave_function, time, neck_base, left_elbow, left_arm_angle, dx);
    angle_change = torque/mass;
    left_arm_angle += angle_change;
    left_forearm_angle -= angle_change;

    torque = calculate_torque(wave_function, time, left_elbow, left_wrist, left_forearm_angle, dx);
    angle_change = torque/mass;
    left_forearm_angle += angle_change;
    left_wrist_angle -= angle_change;

    torque = calculate_torque(wave_function, time, left_wrist, left_fingertips, left_wrist_angle, dx);
    angle_change = torque/mass;
    left_wrist_angle += angle_change;
}

function draw_wave(wave_function, time){
    let previous_y = wave_function(0, time);
    for(let x = 0; x < canvas.width; x++){
        let new_y = wave_function(x, time);
        draw_line([x-1, previous_y], [x, new_y])
        previous_y = new_y;
    }
}

function draw(){
    let chosen_wave = sine_wave;
    let time_steps_per_frame = 1E3;
    for(let i = 0; i < time_steps_per_frame; i++){
        wave(chosen_wave, time, 0.01/time_steps_per_frame, 1E-1);
    }
    ctx.strokeStyle = "black";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_line([0, floor_height], [canvas.width, floor_height]);
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
    //assumes that leg_length == shin_length
    right_leg_angle = 2*Math.atan((2*leg_length-Math.sqrt(4*leg_length**2-(right_foot[1]-ass[1])**2))/(right_foot[1]-ass[1]))-Math.atan((right_foot[0]-ass[0])/(right_foot[1]-ass[1]));
    left_leg_angle = 2*Math.atan((2*leg_length+Math.sqrt(4*leg_length**2-(right_foot[1]-ass[1])**2))/(right_foot[1]-ass[1]))+Math.atan((right_foot[0]-ass[0])/(right_foot[1]-ass[1]));
    
    right_knee = calculate_position(ass, right_leg_angle, leg_length);
    left_knee = calculate_position(ass, left_leg_angle, leg_length);
    draw_line(ass, right_knee);
    draw_line(ass, left_knee);
    
    draw_line(right_knee, right_foot);
    draw_line(left_knee, left_foot);

    time += 0.01;
}

setInterval(draw, 10);