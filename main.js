// Get reference to canvas
let canvas = document.getElementById('canvas');

// Get reference to canvas context
let context = canvas.getContext('2d');

// Get reference to loading screen
let loading_screen = document.getElementById('loading');

// Initialize loading variables
let loaded = false;
let load_counter = 0;

// Initilize images for layers
let background = new Image();
let floaties_1 = new Image();
let floaties_2 = new Image();
let shadows = new Image();
let mask = new Image();
let humans = new Image();
let floaties_3 = new Image();

// Create a list of layer objects
let layer_list = [
    {
        'image': background,
        'src': './images/background.png',
        'z_index': -2.25,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': floaties_1,
        'src': './images/background-components.png',
        'z_index': -2,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': shadows,
        'src': './images/shadows.png',
        'z_index': -0.5,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': mask,
        'src': './images/frame.png',
        'z_index': 0,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': humans,
        'src': './images/humans.png',
        'z_index': 0.8,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    },
    {
        'image': floaties_2,
        'src': './images/stars.png',
        'z_index': 2,
        'position': {x: 0, y: 0},
        'blend': null,
        'opacity': 1
    }
];

layer_list.forEach(function(layer, index) {
    layer.image.onload = function() {
        load_counter += 1;
        if (load_counter >= layer_list.length) {
            // hide loading screen
            // hideLoading();
            requestAnimationFrame(drawCanvas);
        }
    };
    layer.image.src = layer.src;
});

// function hideLoading() {
//     loading_screen.classList.add('hidden');
// }

function drawCanvas() {
    //clear whatever is in the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate how much the canvas should rotate
    let rotate_x = (pointer.y * -0.15) + (motion.y * -1.2);
    let rotate_y = (pointer.x * 0.15) + (motion.x * 1.2);

    let transform_string = "rotateX("+ rotate_x +"deg) rotateY("+ rotate_y +"deg)";

    // Actually rotate the canvas
    canvas.style.transform = transform_string;

    // Loop through each layer and draw it to canvas
    layer_list.forEach(function(layer, index) {

        layer.position = getOffset(layer);

        if (layer.blend) {
            context.globalCompositeOperation = layer.blend;
        } else {
            context.globalCompositeOperation = 'normal';
        }

        context.globalAlpha = layer.opacity;

        context.drawImage(layer.image, layer.position.x, layer.position.y);
    });

    requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {
    let touch_multiplier = 0.3; 
    let touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
    let touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

    let motion_multiplier = 2.5;
    let motion_offset_x = motion.x * layer.z_index;
    let motion_offset_y = motion.y * layer.z_index;

    let offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
    };

    return offset;
}
//// Touch and Mouse Controls

let moving = false;

let pointer_initial = {
    x: 0,
    y: 0
};

let pointer = {
    x: 0,
    y:0
};

canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event) {
    moving = true;
    if (event.type === 'touchstart') {
        pointer_initial.x = event.touches[0].clientX;
        pointer_initial.y = event.touches[0].clientY;
    } else if (event.type === 'mousedown') {
        pointer_initial.x = event.clientX;
        pointer_initial.y = event.clientY;
    }
}

window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event) {
    event.preventDefault();
    if (moving === true) {
        let current_x = 0;
        let current_y = 0;
        if (event.type === 'touchmove') {
            current_x = event.touches[0].clientX;
            current_y = event.touches[0].clientY;
        } else if (event.type === 'mousemove') {
            current_x = event.clientX;
            current_y = event.clientY;
        }
        pointer.x = current_x - pointer_initial.x;
        pointer.y = current_y - pointer_initial.y;
    }
}

canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
});

canvas.addEventListener('mousemove', function(event) {
    event.preventDefault();
});

window.addEventListener('touchend', function(event) {
    endGesture();
});

window.addEventListener('mouseup', function(event) {
    endGesture();
});

function endGesture() {
    moving = false;

    pointer.x = 0;
    pointer.y = 0;
}

//// Motion Controls ////

// Initialize variables for motion-based parallax

let motion_initial = {
    x: null,
    y: null
};

let motion = {
    x: 0,
    y: 0
};

// Listen to gyroscope events
window.addEventListener('deviceorientation', function() {
    // if this is first time through
    if (!motion_initial.x && !motion_initial.y) {
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }

    if (window.orientation === 0) {
        // The device is in potrait orientation
        motion.x = event.gamma = motion_initial.x;
        motion.y = event.beta - motion_initial.y;
    } else if (window.orientation === 90) {
        // The device is in landscape on its left side
        motion.x = event.beta - motion_initial.x;
        motion.y = -event.gamma + motion_initial.y;
    } else if (window.orientation === -90) {
        // The device is in landscape on its right side
        motion.x = -event.beta + motion_initial.x;
        motion.y = event.gamma - motion_initial.y;
    } else {
        // The device is upside down
        motion.x = -event.gamma + motion_initial.y;
        motion.y = -event.beta + motion_initial.x;
    }
});

window.addEventListener('orientationchange', function(event) {
    motion_initial.x = 0;
    motion_initial.y = 0;
})