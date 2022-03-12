// TO DO
// Random stroke width
// Finish spelling out characters
// Random B character
// sliders

let sliders = document.querySelectorAll("input[type='range']");
let ctrl_numLayers = document.getElementById("numLayers");
let ctrl_lineWeight = document.getElementById("lineWeight");
let ctrl_lineVariation = document.getElementById("lineWeightVariation");
let numLayers, lineWeight, lineVariation, minLineWeight, maxLineWeight;
let linecapType = "butt";

var c = document.getElementById('can');
var ctx = c.getContext('2d');

function draw(){

        // clear the canvas
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.lineJoin = ctx.lineCap = linecapType;

        for (let i=0;i<numLayers;i++){

                const g_x1 = ran2nums(250, 315);
                const g_y1 = ran2nums(182, 248);
                const g_x2 = g_x1+ran2nums(1,10);
                const g_y2 = g_y1+ran2nums(57,133);

                // G Curve
                ctx.beginPath();
                ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
                ctx.moveTo(g_x1,g_y1);
                ctx.bezierCurveTo(ran2nums(55,120),ran2nums(39,75),ran2nums(67,181),ran2nums(457,687),g_x2,g_y2);
                ctx.stroke();
                ctx.closePath();


                // G Bend
                ctx.beginPath();
                ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
                ctx.moveTo(g_x2 - ran2nums(65, 110),g_y2 + ran2nums(-40,40));
                ctx.lineTo(g_x2,g_y2);
                ctx.lineTo(g_x2,g_y2 + ran2nums(80,165));
                ctx.stroke();
                ctx.closePath();

                // B Stem
                // let bs_x1 = ran2nums(290, 343);
                const bs_x1 = g_x2 + ran2nums(15, 45);
                const bs_y1 = ran2nums_sm(150,203);
                const bs_x2 = bs_x1 + ran2nums(0,50);
                const bs_y2 = bs_y1 + ran2nums(230,290);

                ctx.beginPath();
                ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
                ctx.moveTo(bs_x1, bs_y1);
                ctx.lineTo(bs_x2,bs_y2);
                ctx.stroke();
                ctx.closePath();

                // B CURVE CALCULATIONS
                // point 1, handle 1
                const bc_x1 = bs_x1 + ran2nums(18,30);
                const bc_y1 = bs_y1 + ran2nums(6,15);

                const bc_h1_x = bs_x1 + ran2nums(82, 260);
                const bc_h1_y = bs_y1 - ran2nums(14, 21);

                // bottom point & handle
                const bc_x3_additor = ran2nums(7, 60);
                const bc_x3 = bs_x2 + bc_x3_additor;

                let bc_y3;
                if (bc_x3_additor < 33) {
                    bc_y3 = Math.random() > 0.5 ? bs_y2 - ran2nums(16, 60) : bs_y2 + ran2nums(11, 38);
                    console.log("route 1")
                } else {
                    bc_y3 = bs_y2 + ran2nums(-8,8); 
                    console.log("route 2")
                }

                // two types of bottom handles
                let bc_h3_x = bc_x3 + ran2nums(245,330);
                let bc_h3_y;
                if (Math.random()>0.5){
                    bc_h3_y = bc_y3 - ran2nums(90,115);
                } else {
                    bc_h3_y = bc_y3 + ran2nums(90,115);
                }

                // midpoint and angle and handles
                const bc_mid_x = bc_x3 + ran2nums(15,55);
                const bc_mid_y = bs_y1 + ran2nums(95,120);

                const bc_mid_run = ran2nums(-16,100);
                const bc_mid_rise = ran2nums(50,60);

                // DRAWING THE B CURVE
                ctx.beginPath();
                ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
                ctx.moveTo(bc_x1,bc_y1);
                ctx.bezierCurveTo(bc_h1_x,bc_h1_y,bc_mid_x+bc_mid_run, bc_mid_y+bc_mid_rise,bc_mid_x,bc_mid_y);
                ctx.bezierCurveTo(bc_mid_x-bc_mid_run, bc_mid_y-bc_mid_rise,bc_h3_x,bc_h3_y,bc_x3,bc_y3)
                ctx.stroke();
                ctx.closePath();

                // TEST POINTS
                // ctx.beginPath();
                // ctx.arc(bc_x1, bc_y1, 4, 0, 2 * Math.PI);
                // ctx.fillStyle = "red";
                // ctx.fill();

                // ctx.beginPath();
                // ctx.arc(bc_mid_x, bc_mid_y, 4, 0, 2 * Math.PI);
                // ctx.fillStyle = "red";
                // ctx.fill();

                // ctx.beginPath();
                // ctx.arc(bc_x3, bc_y3, 4, 0, 2 * Math.PI);
                // ctx.fillStyle = "red";
                // ctx.fill();


                // A BEND
                const a_width = ran2nums(100,150);
                const a_baseline_offset = ran2nums(20,100);

                const a_x1 = (bc_x3+bc_h3_x)/2 + ran2nums(0,35);
                const a_y1 = bc_y3 - ran2nums(0,100);

                const a_x3 = a_x1+a_width;
                const a_y3 = a_y1+a_baseline_offset;

                const a_x2 = ran2nums(a_x1,a_x3);
                const a_y2 = bs_y1+ran2nums(0,15);

                ctx.beginPath();
                ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
                ctx.moveTo(a_x1, a_y1);
                ctx.lineTo(a_x2,a_y2);
                ctx.lineTo(a_x3,a_y3);
                ctx.stroke();
                ctx.closePath();

                ctx.beginPath();
                ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
                ctx.moveTo((a_x1+a_x2)/2 - ran2nums(10,100), (a_y1+a_y2)/2) - ran2nums(10,100);
                ctx.lineTo((a_x3+a_x2)/2 + ran2nums(10,100), (a_y3+a_y2)/2) + ran2nums(10,100);
                ctx.stroke();
                ctx.closePath();

        }   

}


document.getElementById("linecap_butt").addEventListener("mousedown", function(){
    linecapType = "butt";
    updateValues();
})
document.getElementById("linecap_round").addEventListener("mousedown", function(){
    linecapType = "round";
    updateValues();
})

function updateValues(){
    numLayers = parseInt(ctrl_numLayers.value);
    lineWeight = parseInt(ctrl_lineWeight.value);
    lineVariation = parseInt(ctrl_lineVariation.value);
    minLineWeight = Math.min(lineWeight, lineWeight - lineVariation);
    maxLineWeight = Math.max(lineWeight, lineWeight + lineVariation);

    console.log(numLayers, lineWeight, minLineWeight, maxLineWeight);
    draw();
}


// helper functions

function ran2nums (a,b){
 return Math.random() * (b - a + 1) + a;
}

function ran2nums_sm (a,b){
    return Math.min(ran2nums(a,b),ran2nums(a,b),ran2nums(a,b))
}
function ran2nums_lg (a,b){
    return Math.max(ran2nums(a,b),ran2nums(a,b),ran2nums(a,b))
}




updateValues();