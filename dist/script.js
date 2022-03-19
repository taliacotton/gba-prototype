let drawHandles = false;

let sliders = document.querySelectorAll("input[type='range']");
let ctrl_numLayers = document.getElementById("numLayers");
let ctrl_layerMess = document.getElementById("layerMess");
let ctrl_lineWeight = document.getElementById("lineWeight");
let ctrl_lineVariation = document.getElementById("lineWeightVariation");
let numLayers, lineWeight, lineVariation, minLineWeight, maxLineWeight, layerMess;
// let layerMess = 3;
let colors = ["red", "green", "magenta", "blue", "yellow"];
let green = ["#E1FF8C"];
let black = ["#000000"];
let red = ["#ff0000"];
let blue = ["#ff0000"];
let colorPalette = black;
let linecapType = "round";

const cw = 800;
const ch = cw*0.75;


let states = [{
    layers: {
        min: 4,
        max: null
    },
    blur: false,
    mess: {
        min: null,
        max: null
    },
    weight: {
        min: null,
        max: 10
    },
    variation: {
        min: null,
        max: 12
    },
    palette: [colors]
},{
    layers: {
        min: null,
        max: 3
    },
    blur: false,
    mess: {
        min: null,
        max: 3
    },
    weight: {
        min: 7,
        max: 40
    },
    variation: {
        min: null,
        max: 7
    },
    palette: [black]
},{
    layers: {
        min: null,
        max: 4
    },
    blur: true,
    mess: {
        min: null,
        max: 5
    },
    weight: {
        min: 5,
        max: 12
    },
    variation: {
        min: null,
        max: 3
    },
    palette: [black, red, blue]
},{
    layers: {
        min: 3,
        max: null
    },
    blur: false,
    mess: {
        min: 1,
        max: null
    },
    weight: {
        min: null,
        max: 5
    },
    variation: {
        min: null,
        max: 10
    },
    palette: [black, red]
},{
    layers: {
        min: 6,
        max: null
    },
    blur: false,
    mess: {
        min: 1,
        max: 3
    },
    weight: {
        min: null,
        max: 3
    },
    variation: {
        min: null,
        max: 2
    },
    palette: [['#000000', '#0000ff'], black, red]
},{
    layers: {
        min: 3,
        max: null
    },
    blur: false,
    mess: {
        min: null,
        max: null
    },
    weight: {
        min: null,
        max: 40
    },
    variation: {
        min: null,
        max: null
    },
    palette: [green]
},{
    layers: {
        min: 3,
        max: null
    },
    blur: false,
    mess: {
        min: null,
        max: 4
    },
    weight: {
        min: null,
        max: 24
    },
    variation: {
        min: null,
        max: 12
    },
    palette: [green, ['#f7ee6d', '#d0e85a', '#b4ff5e'], ['##ff82ec', '#e6abff'], ['##75baff', '#4accff', '#3b8cff'], ['#ffe491','#ffbb4d']]
},{
    layers: {
        min: 12,
        max: null
    },
    blur: true,
    mess: {
        min: null,
        max: 1
    },
    weight: {
        min: 30,
        max: 40
    },
    variation: {
        min: null,
        max: 3
    },
    palette: [colors]
},{
    layers: {
        min: 2,
        max: 7
    },
    blur: false,
    mess: {
        min: null,
        max: 3
    },
    weight: {
        min: 8,
        max: 30
    },
    variation: {
        min: 1,
        max: 4
    },
    palette: [black]
}]



var c = document.getElementById('can');
var ctx = c.getContext('2d');

function draw(){

        ctx.globalCompositeOperation = 'multiply';
        ctx.shadowColor = randFromArr(colorPalette);

        // clear the canvas
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.lineJoin = ctx.lineCap = linecapType;

        // for (let i=0;i<numLayers;i++){

                // G Curve
                const g_x1 = ran2nums(250, 315);
                const g_y1 = ran2nums(182, 248);
                const g_h1_x = ran2nums(55,120);
                const g_h1_y = ran2nums(39,75);
                const g_h2_x = ran2nums(0,180);
                const g_h2_y = ran2nums(457,687);
                const g_x2 = g_x1+ran2nums(1,10);
                const g_y2 = g_y1+ran2nums(57,133);
                drawSingleBezierCurve(g_x1, g_y1, g_h1_x, g_h1_y, g_h2_x, g_h2_y, g_x2, g_y2)


                // G Bend
                // choose a number a little less than the last X point in G curve
                let g_bend_x1 = g_x2 - ran2nums(85, 110); 
                // if that number is too close to the smaller of the two handle's x coords, move it closer
                g_bend_x1 = Math.max(g_bend_x1, Math.max(g_h1_x,g_h2_x)+65) 
                // get the average of the handle's y coordinates
                let g_bend_y1 = (g_h1_y+g_h2_y)/2;
                while ((g_x2 - g_bend_x1)/(g_y2 - g_bend_y1) < 0 && (g_x2 - g_bend_x1)/(g_y2 - g_bend_y1) > -1.8) {
                    g_bend_y1--;
                }

                const g_bend_x3 = g_x2;
                const g_bend_y3 = g_y2 + ran2nums(80,165);
                drawLine([g_bend_x1,g_bend_y1,g_x2,g_y2,g_bend_x3,g_bend_y3]);

        
                // B Stem
                let bs_x1 = g_x2 + ran2nums(15, 45);
                let counter = 0;
                // make sure the b and g are not drawn too close for comfort
                while(bs_x1 - g_x2 <= maxLineWeight*0.75 && counter <= 19){
                    bs_x1 = g_x2 + ran2nums(15, 45);
                    // console.log(g_x2, bs_x1, maxLineWeight, bs_x1 - g_x2);
                    // console.log("while loop")
                    counter++;
                }
                const bs_y1 = ran2nums_sm(150,203);
                const bs_x2 = bs_x1 + ran2nums(0,50);
                const bs_y2 = bs_y1 + ran2nums(230,290);
                drawLine([bs_x1, bs_y1,bs_x2,bs_y2]);


                // B CURVE CALCULATIONS
                // point 1, handle 1
                const bc_x1 = bs_x1 + ran2nums(-100,30);
                // console.log(bc_x1);
                const bc_y1 = bs_y1 + ran2nums(-50,50);

                const bc_h1_x = bs_x1 + ran2nums(82, 260);
                const bc_h1_y = bs_y1 - ran2nums(14, 21);

                // bottom point & handle
                const bc_x3_additor = ran2nums(-60, 60);
                const bc_x3 = bs_x2 + bc_x3_additor;

                let bc_y3;
                if (bc_x3_additor < 33) {
                    bc_y3 = Math.random() > 0.5 ? bs_y2 - ran2nums(16, 60) : bs_y2 + ran2nums(11, 38);
                    // console.log("route 1")
                } else {
                    bc_y3 = bs_y2 + ran2nums(-8,8); 
                    // console.log("route 2")
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

                // const bc_mid_run = ran2nums(-16,100);
                // const bc_mid_rise = ran2nums(50,60);

                const bc_mid_run = ran2nums(-80,80);
                const bc_mid_rise = ran2nums(-80,80);
                

                // DRAWING THE B CURVE
                for (let i=0;i<numLayers;i++){
                    ctx.beginPath();
                    ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
                    ctx.moveTo(bc_x1,bc_y1);
                    ctx.bezierCurveTo(  bc_h1_x + ran2nums(-i*layerMess, i*layerMess),
                                        bc_h1_y + ran2nums(-i*layerMess, i*layerMess),
                                        bc_mid_x+bc_mid_run + ran2nums(-i*layerMess, i*layerMess), 
                                        bc_mid_y+bc_mid_rise + ran2nums(-i*layerMess, i*layerMess),
                                        bc_mid_x + ran2nums(-i*layerMess, i*layerMess),
                                        bc_mid_y + ran2nums(-i*layerMess, i*layerMess));
                    ctx.bezierCurveTo(  bc_mid_x-bc_mid_run + ran2nums(-i*layerMess, i*layerMess), 
                                        bc_mid_y-bc_mid_rise + ran2nums(-i*layerMess, i*layerMess),
                                        bc_h3_x + ran2nums(-i*layerMess, i*layerMess),
                                        bc_h3_y + ran2nums(-i*layerMess, i*layerMess),
                                        bc_x3 + ran2nums(-i*layerMess, i*layerMess),
                                        bc_y3 + ran2nums(-i*layerMess, i*layerMess))
                    ctx.stroke();
                    ctx.closePath();
                }


                // A BEND
                const a_width = ran2nums(100,150);
                const a_baseline_offset = ran2nums(20,100);

                const a_x1 = (bc_x3+bc_h3_x)/2 + ran2nums(0,35);
                const a_y1 = bc_y3 - ran2nums(0,100);

                const a_x3 = a_x1+a_width;
                const a_y3 = a_y1+a_baseline_offset;

                const a_x2 = ran2nums(a_x1,a_x3);
                const a_y2 = bs_y1+ran2nums(0,15);
                
                const a_quad1 = pointAlongLine(a_x1,a_y1,a_x2,a_y2,ran2nums(10,100));
                const a_quad2 = pointAlongLine(a_x3,a_y3,a_x2,a_y2,ran2nums(10,100));

                const a_strokeWidth = ran2nums(minLineWeight,maxLineWeight);
                drawLine([a_x1,a_y1,a_quad1[0],a_quad1[1]],a_strokeWidth);
                drawLine([a_quad2[0],a_quad2[1], a_x3, a_y3],a_strokeWidth);

                // Make it quadratic curve on top
                drawSingleQuadCurve(a_quad1[0],a_quad1[1],a_x2,a_y2,a_quad2[0],a_quad2[1],a_strokeWidth)

                

                // A Crossbar
                const a_cb_x1 = a_x1 - Math.min(ran2nums(-10,120),ran2nums(-10,120));
                const a_cb_y1 = (a_y1+a_y2)/2 - ran2nums(-30,40);
                const a_cb_x2 = a_x3 + ran2nums(-15,60);
                const a_cb_y2 = (a_y3+a_y2)/2 + ran2nums(-30,40);
                drawLine([a_cb_x1, a_cb_y1,a_cb_x2,a_cb_y2]);

        // }   

}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~
// INTERFACE BUTTON FUNCTIONS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~

document.getElementById("linecap_butt").addEventListener("mousedown", function(){
    linecapType = "butt";
    updateValues();
})
document.getElementById("linecap_round").addEventListener("mousedown", function(){
    linecapType = "round";
    updateValues();
})

document.getElementById("colored").addEventListener("mousedown", function(){
    colorPalette = colors;
    console.log(colorPalette)
    updateValues();
})
document.getElementById("bw").addEventListener("mousedown", function(){
    colorPalette = ["#222222"];
    updateValues();
})
document.getElementById("green").addEventListener("mousedown", function(){
    colorPalette = green;
    updateValues();
})
document.getElementById("red").addEventListener("mousedown", function(){
    colorPalette = red;
    updateValues();
})

document.getElementById("soft").addEventListener("mousedown", function(){
    ctx.shadowBlur = 4;
    updateValues();
})

document.getElementById("hard").addEventListener("mousedown", function(){
    ctx.shadowBlur = 0;
    updateValues();
})






function randomize(){
    linecapType = "round";

    for (let slider of sliders){
        // full random
        slider.value = ran2nums(slider.min, slider.max);
        // if (Math.random()>0.7){
        //     console.log("chance")
        //     ctrl_numLayers.value = 1
        // }
    }

    let randomState = states[Math.floor(Math.random() * states.length)]
    // let randomState = states[6];

    // console.log(randomState.palette)

    ctx.shadowBlur = randomState.blur ? 2.5 : 0;
    colorPalette = randomState.palette[Math.floor(Math.random() * randomState.palette.length)];
    ctrl_numLayers.value = ran2nums(randomState.layers.min || ctrl_numLayers.min, randomState.layers.max || ctrl_numLayers.max);
    ctrl_layerMess.value = ran2nums(randomState.mess.min || ctrl_layerMess.min, randomState.mess.max || ctrl_layerMess.max);
    ctrl_lineWeight.value = ran2nums(randomState.weight.min || ctrl_lineWeight.min, randomState.weight.max || ctrl_lineWeight.max);
    ctrl_lineVariation.value = ran2nums(randomState.variation.min || ctrl_lineVariation.min, randomState.variation.max || ctrl_lineVariation.max);


    updateValues();
}

function updateValues(){
    numLayers = parseInt(ctrl_numLayers.value);
    layerMess = parseInt(ctrl_layerMess.value);
    lineWeight = parseInt(ctrl_lineWeight.value);
    lineVariation = parseInt(ctrl_lineVariation.value);
    minLineWeight = Math.min(lineWeight, lineWeight - lineVariation);
    maxLineWeight = Math.max(lineWeight, lineWeight + lineVariation);

    console.log("line weight: " + lineWeight + ", line variation: " + lineVariation + ", num layers: " + numLayers + ", mess: " + layerMess)

    // console.log(numLayers, lineWeight, minLineWeight, maxLineWeight);
    draw();
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DRAWING SOME LINES MADE EASY
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function drawLine(coordsArray,wght){
    for (let i=0;i<numLayers;i++){
        ctx.beginPath();
        ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
        if (wght){
            ctx.lineWidth = wght;
        }
        ctx.moveTo( (coordsArray[0] + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                    (coordsArray[1] + ran2nums(-i*layerMess, i*layerMess))/800*cw);
        ctx.lineTo( (coordsArray[2] + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                    (coordsArray[3] + ran2nums(-i*layerMess, i*layerMess))/800*cw);
        if(coordsArray[4]){
            ctx.lineTo(coordsArray[4] + ran2nums(-i*layerMess, i*layerMess),coordsArray[5] + ran2nums(-i*layerMess, i*layerMess));
        }
        ctx.strokeStyle = randFromArr(colorPalette);
        ctx.stroke();
        ctx.closePath();
    }

    // if(drawHandles){
    //     drawPoint(x1, y1);
    //     drawPoint(x2, y2);
    //     drawHandle(x1,y1,x2,y2);
    //     if (x3){
    //         drawPoint(x3, y3);
    //         drawHandle(x2,y2,x3,y3);
    //     }
    //     ctx.strokeStyle = "#222222";
    // }
}

function drawSingleBezierCurve(x1,y1,h1x,h1y,h2x,h2y,x2,y2){
    for (let i=0;i<numLayers;i++){
        ctx.beginPath();
        ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
        ctx.moveTo(x1 + ran2nums(-i*layerMess, i*layerMess),y1 + ran2nums(-i*layerMess, i*layerMess));
        ctx.bezierCurveTo(  (h1x + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                            (h1y + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                            (h2x + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                            (h2y + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                            (x2 + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                            (y2 + ran2nums(-i*layerMess, i*layerMess))/800*cw);
        ctx.strokeStyle = randFromArr(colorPalette);
        ctx.stroke();
        ctx.closePath();
    }

    if(drawHandles){
        drawPoint(x1, y1);
        drawPoint(x2, y2);
        drawCurveOutline(x1,y1,h1x,h1y,h2x,h2y,x2,y2);
        ctx.strokeStyle = randFromArr(colorPalette);
    }
}

function drawSingleQuadCurve(x1,y1,x2,y2,x3,y3, weight){
    for (let i=0;i<numLayers;i++){
        ctx.beginPath();
        ctx.lineWidth = ran2nums(minLineWeight,maxLineWeight);
        if (weight){
            ctx.lineWidth = weight;
        }
        ctx.moveTo(x1 + ran2nums(-i*layerMess, i*layerMess),y1 + ran2nums(-i*layerMess, i*layerMess));
        ctx.quadraticCurveTo(   (x2 + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                                (y2 + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                                (x3 + ran2nums(-i*layerMess, i*layerMess))/800*cw,
                                (y3 + ran2nums(-i*layerMess, i*layerMess))/800*cw);
        ctx.strokeStyle = randFromArr(colorPalette);
        ctx.stroke();
        ctx.closePath();
    }

    if(drawHandles){
        drawPoint(x1, y1);
        drawPoint(x3, y3);
    }
}

function pointAlongLine(x1,y1,x2,y2,dist){
    // This link helped me figure out the formula: https://math.stackexchange.com/questions/175896/finding-a-point-along-a-line-a-certain-distance-away-from-another-point
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    const unitVector = [dx/d, Math.abs(dy/d)];
    return [x2 - unitVector[0]*dist, y2 + unitVector[1]*dist];
    
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// IF DRAWING HANDLES, A FEW HELPER FUNCTIONS:
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function drawPoint(x, y){
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
}

function drawHandle(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();
}

function drawCurveOutline(x1,y1,h1x,h1y,h2x,h2y,x2,y2){
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(x1,y1);
    ctx.bezierCurveTo(h1x,h1y,h2x,h2y,x2,y2);
    ctx.strokeStyle = "red";
    ctx.stroke();
    ctx.closePath();

    drawHandle(x1,y1,h1x,h1y);
    drawHandle(h2x,h2y,x2,y2);
    drawPoint(h1x,h1y);
    drawPoint(h2x,h2y);
}


// ~~~~~~~
// HELPERS
// ~~~~~~~

function ran2nums (a,b){
 return Math.random() * (b - a + 1) + a;
}

function ran2nums_sm (a,b){
    return Math.min(ran2nums(a,b),ran2nums(a,b),ran2nums(a,b))
}
function ran2nums_lg (a,b){
    return Math.max(ran2nums(a,b),ran2nums(a,b),ran2nums(a,b))
}

function download(){
    var link = document.createElement('a');
    link.download = 'gba-logo-screengrab.png';
    link.href = document.getElementById('can').toDataURL()
    link.click();
}

function randFromArr(arr){
    return arr[Math.floor(Math.random() * arr.length)];
}

// ~~~~~~~~~~
// AND, DRAW:
// ~~~~~~~~~~

c.addEventListener("mouseup", function(){
    randomize();
})

updateValues();
randomize();