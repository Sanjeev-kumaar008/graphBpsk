let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let sampling_frequency_element = document.getElementById("Fs");
let wave_frequency_element = document.getElementById("Fm");
let wave_amplitude_element = document.getElementById("Am");
let delta_element = document.getElementById("Delta");
let vertical_scale_element = document.getElementById("vertical_scale_factor");
let horizontal_scale_element = document.getElementById("horizontal_scale_factor");
let check_unsampled_wave = document.getElementById("unsampled_wave");
let check_sampled_points = document.getElementById("sampled_points");
let check_staircase_wave = document.getElementById("staircase_wave");

var old_str = ""
function signal() {
    let v1 = document.getElementById("dig1").value
    let v3 = document.getElementById("dig3").value
    let v2 = document.getElementById("dig2").value
    let v5 = document.getElementById("dig5").value
    let v4 = document.getElementById("dig4").value
    old_str = v1 + " " + v2 + " " + v3 + " " + v4 + " " + v5
    return old_str
}



let canvas_width = window.screen.width - 50;
let canvas_height = 600;
let orgx = 200;
let orgy = 315;


// Set resolution for canvas
canvas.width = canvas_width;
canvas.height = canvas_height;

let wave_amplitude = document.getElementById("amplitude");
let wave_frequency = document.getElementById("frequency");
let sampling_frequency = document.getElementById("sampling_frequency");

let vertical_scaling_factor = vertical_scale_element.value;
let horizontal_scaling_factor = horizontal_scale_element.value;

let delta = 2 * Math.PI * wave_amplitude.value * wave_frequency.value / sampling_frequency.value;



function drawPoint(ctx, x, y) {
    var radius = 3.0;
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.lineWidth = 1;
    ctx.arc(x, y, radius * 1.3, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.closePath();
}

function drawAxes() {
    ctx.beginPath();
    // Vertical line
    ctx.moveTo(orgx, 100);
    ctx.lineTo(orgx, 530);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Horizontal line
    ctx.moveTo(100, 510);
    ctx.lineTo(window.screen.width - 100, 510);
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Base line
    ctx.moveTo(orgx, orgy);
    ctx.lineTo(window.screen.width - 100, orgy);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Amplitude", 100, 120, 90);
    ctx.fillText("Time", window.screen.width - 200, 530, 70);
    ctx.closePath();

}

function xrange(start, stop, step) {
    var res = [];
    var i = start;
    while (i <= stop) {
        res.push(i);
        i += step;
    }
    return res;
}

function plotStairCase(arr) {



    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.moveTo(orgx, orgy);

    // Scale the values in the array for plotting

    arr.forEach((_, idx) => {
        arr[idx] *= vertical_scaling_factor;
    });

    ctx.moveTo(orgx, orgy - arr[0]);
    ctx.lineWidth = 1;

    var px = orgx;
    var py = arr[0];

    for (var i = 1; i < arr.length; i++) {
        var xoff = i * horizontal_scaling_factor;
        ctx.lineTo(xoff + orgx, orgy - py);
        ctx.lineTo(xoff + orgx, orgy - arr[i]);
        px = xoff;
        py = arr[i];
    }

    ctx.stroke();
    ctx.closePath();
}

function plotSine(ctx, xOffset, yOffset) {
    var width = 1000;
    var amplitude = wave_amplitude.value;
    var frequency = wave_frequency.value;
    var Fs = sampling_frequency.value;
    var StopTime = 1;
    var dt = 1 / Fs;
    var t = xrange(0, StopTime + dt, dt);
    var arr = stair()
    console.log(arr)
    var x = [];

    // t.forEach((val) => {
    //     arr.forEach((ele) => {
    //         x.push(ele * amplitude * Math.sin(2 * Math.PI * frequency * val));
    //         // console.log(ele)
    //     });

    // });
    arr.forEach((ele) => {
        t.forEach((val) => {
            x.push(ele * amplitude * Math.sin(2 * Math.PI * frequency * val));
        })
        // console.log(ele)
    });
    // t.forEach((val) => {
    //     x.push(1 * amplitude * Math.sin(2 * Math.PI * frequency * val));
    // });
    console.log(x)

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(66,44,255)";

    var idx = 0;
    if (check_unsampled_wave.checked) {
        while (idx < width) {
            ctx.lineTo(xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx]);
            idx++;
        }
    }
    ctx.stroke();
    ctx.save();


    // delta = ((2 * Math.PI * amplitude * frequency) / Fs).toFixed(4);
    // if (check_sampled_points.checked) {
    //     var idx = 0;
    //     while (idx < width) {
    //         drawPoint(ctx, xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx]);

    //         ctx.moveTo(xOffset + idx * horizontal_scaling_factor, yOffset - vertical_scaling_factor * x[idx])
    //         ctx.lineTo(xOffset + idx * horizontal_scaling_factor, orgy)
    //         ctx.stroke();
    //         idx++;
    //     }
    // }

    // var e = new Array(x.length);
    // var eq = new Array(x.length);
    // var xq = new Array(x.length);

    // for (var i = 0; i < x.length; i++) {
    //     if (i == 0) {
    //         e[i] = x[i];
    //         eq[i] = delta * Math.sign(e[i]);
    //         xq[i] = parseFloat(eq[i].toFixed(2));
    //     } else {
    //         e[i] = x[i] - xq[i - 1]
    //         eq[i] = delta * Math.sign(e[i]);
    //         xq[i] = (eq[i] + xq[i - 1]);
    //     }
    // }

    // // Draw the stair case wave
    // if (check_staircase_wave.checked)
    //     plotStairCase(xq);
}

function stair() {
    let d = signal()
    let f = d.split(" ")
    // console.log(f)
    let int_arr = []
    f.map((val) => {
        if (val == "1") {
            int_arr.push(1)
        } else {
            int_arr.push(-1)
        }
    })
    // console.log(int_arr)
    return int_arr
}

function drawGraph() {
    drawAxes();
    // let d = signal()
    // let f = d.split(" ")
    // // console.log(f)
    // let int_arr = []
    // f.map((val) => {
    //     if (val == "1") {
    //         int_arr.push(1)
    //     } else {
    //         int_arr.push(-1)
    //     }
    // })
    // // console.log(int_arr)
    var int_ar = stair()

    plotStairCase(int_ar)
    plotSine(ctx, orgx, orgy);

}

function draw() {
    // Clear the screen
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas_width, canvas_height);

    wave_amplitude_element.innerText = wave_amplitude.value + ' V';
    wave_frequency_element.innerText = wave_frequency.value + ' Hz';
    sampling_frequency_element.innerText = sampling_frequency.value + ' Hz';
    delta_element.innerText = delta;
    vertical_scaling_factor = vertical_scale_element.value;
    horizontal_scaling_factor = horizontal_scale_element.value;

    drawGraph();

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
