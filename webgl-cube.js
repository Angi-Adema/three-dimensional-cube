// Use strict helps catch errors while coding
"use strict";

// Declare the WebGL context
var gl;

// Create an array to store cube vertex positions
var points = [];

// Create an array to store cube vertex colors
var colors = [];

// Set the initial rotation angle for the cube
var theta = 0.0;

// Declare a variable to hold the location of the model-view matrix uniform in the shader program
var modelViewMatrixLoc;

// Create the eight vertices of the cube front square and back square, each represented as a 4D vector (x, y, z, w)
var vertices = [
    vec4(-0.5, -0.5,  0.5, 1.0),  // Vertex 0: front bottom left
    vec4(-0.5,  0.5,  0.5, 1.0),  // Vertex 1: front top left
    vec4( 0.5,  0.5,  0.5, 1.0),  // Vertex 2: front top right
    vec4( 0.5, -0.5,  0.5, 1.0),  // Vertex 3: front bottom right
    vec4( 0.5,  0.5, -0.5, 1.0),  // Vertex 4: back bottom left
    vec4( 0.5, -0.5, -0.5, 1.0),  // Vertex 5: back bottom right
    vec4(-0.5, -0.5, -0.5, 1.0),  // Vertex 6: back top right
    vec4(-0.5,  0.5, -0.5, 1.0),  // Vertex 7: back bottom right
];

// Colors of cube faces, each represented as a 4D vector (r, g, b, a)
var vertexColors = [
    vec4(0.961, 0.569, 0.988, 1.0),  // #F591FC
    vec4(0.839, 0.039, 0.980, 1.0),  // #D60AFA
    vec4(0.635, 0.008, 0.969, 1.0),  // #A202F7
    vec4(0.376, 0.286, 0.890, 1.0),  // #6049E3
    vec4(0.408, 0.545, 0.961, 1.0),  // #688BF5
    vec4(0.035, 0.773, 0.839, 1.0),  // #09C5D6
    vec4(0.208, 0.922, 0.871, 1.0),  // #35EBDE
    vec4(0.259, 0.878, 0.682, 1.0)   // #42E0AE
];

// Run init functions after the page has loaded to ensure the canvas is available
window.onload = function init()
{   
    // Retrieve canvas element from the HTML document by its ID
    var canvas = document.getElementById("glCanvas");

    // Create the WebGL rendering context for the canvas using the WebGL utility library
    gl = WebGLUtils.setupWebGL(canvas);

    // Error handling to ensure WebGL was successfully initialized
    if (!gl)
    {
        // Display alert is WebGL is not available in the user's browser
        alert("WebGL is not available.");
    }

    // Create the six face cube by calling the colorCube function, which generates the vertex positions and colors for each face of the cube
    colorCube();

    // Set the viewport to match the canvas dimensions, clear the color buffer with a light gray color, and enable depth testing for proper 3D rendering
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Load and initialize the vertex and fragment shaders
    var program = initShaders(
        gl,
        "vertex-shader",
        "fragment-shader"
    );

    // Tell WebGL to use the shader program
    gl.useProgram(program);

    // Color buffer storing the cube's color data, which is sent to the GPU for rendering
    var cBuffer = gl.createBuffer();

    // Bind the color buffer as the current array buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

    // Load the color data into the color buffer on the GPU using the flatten function to convert the colors array into a format suitable for WebGL
    gl.bufferData(
        gl.ARRAY_BUFFER,
        flatten(colors),
        gl.STATIC_DRAW
    );

    // Locate the aColor attribute in the shader program and enable it to receive color data from the color buffer
    var aColor = gl.getAttribLocation(program, "aColor");
    
    // Specify how the color data is stored in the buffer and how it should be interpreted by the shader program
    gl.vertexAttribPointer(
        aColor,    // Shader attribute location
        4,         // Four values for each color (r, g, b, a)
        gl.FLOAT,  // Each value is a floating-point number
        false,     // Ensure values are not normalized
        0,         // Default spacing between consecutive colors in the buffer
        0          // Start reading from the beginning of the buffer
    );
    // Enable the aColor attribute to allow the shader program to access the color data for rendering
    gl.enableVertexAttribArray(aColor);

    // Create a buffer to store the cube's vertex positions, which will be sent to the GPU for rendering
    var vBuffer = gl.createBuffer();

    // Bind the position buffer as the current array buffer, allowing subsequent operations to affect this buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    // Copy the vertex positions data into the position buffer using the flatten function to convert the points
    gl.bufferData(
        gl.ARRAY_BUFFER,
        flatten(points),
        gl.STATIC_DRAW
    );

    // Locate the aPosition attribute in the shader program and enable it to receive vertex position data from the position buffer
    var aPosition =
        gl.getAttribLocation(program, "aPosition");

    // Specify how the vertex position data is stored in the buffer and how it should be interpreted by the shader program
    gl.vertexAttribPointer(
        aPosition,  // Shader attribute location
        4,          // Four values for each vertex position (x, y, z, w)
        gl.FLOAT,   // Each value is a floating-point number
        false,      // Ensure values are not normalized
        0,          // Default spacing between
        0           // Start reading from the beginning of the buffer
    );
    // Enable the aPosition attribute to allow the shader program to access the vertex position data for rendering
    gl.enableVertexAttribArray(aPosition);

    //Find the model-view matrix uniform location in the shader program, which will be used to apply transformations to the cube during rendering
    modelViewMatrixLoc =
        gl.getUniformLocation(
            program,
            "uModelViewMatrix"
        );

    // Start the rendering loop by calling the render function, which will continuously update the cube's rotation and redraw it on the canvas
    render();
};

// Generate all six faces of the cube by calling the quad function for each face, specifying the indices of the vertices that make up each face
function colorCube()
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

// Create two triangles for each face of the cube by specifying the indices of the vertices that make up the triangles, and store the vertex positions and colors in the points and colors arrays
function quad(a, b, c, d)
{
    // Square face is divided into two triangles, and the indices of the vertices for each triangle are specified in the indices array
    var indices = [
        a, b, c,
        a, c, d
    ];

    // Loop through the six vertex indices for the two triangles, and for each index, push the corresponding vertex position and color into the points and colors arrays
    for (var i = 0; i < indices.length; i++)
    {
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[a]);
    }
}

// Draw the cube on the canvas by clearing the color and depth buffers, updating the rotation angle, calculating the model-view matrix, sending it to the shader program, and drawing the cube using the vertex data stored in the buffers. The render function is called repeatedly using requestAnimationFrame to create a smooth animation of the rotating cube.
function render()
{
    // Clear the previous frame's color and depth information to prepare for drawing the new frame
    gl.clear(
        gl.COLOR_BUFFER_BIT |
        gl.DEPTH_BUFFER_BIT
    );

    // Update the rotation angle for the next frame, creating a continuous rotation effect for the cube
    theta += 0.5;

    // Create a matrix that rotates the cube on the x and y axes based on the current rotation angle, allowing the cube to appear as if it is spinning in 3D space
    var modelViewMatrix =
        mult(
            rotateX(theta), // Rotate around x-axis
            rotateY(theta)  // Rotate around y-axis
        );

    // Send the model-view matrix to the shader program, allowing the vertex positions to be transformed according to the current rotation before being rendered on the canvas
    gl.uniformMatrix4fv(
        modelViewMatrixLoc,      // Location of the matrix in the shader
        false,                   // Do not transpose the matrix
        flatten(modelViewMatrix) // Convert the matrix into WebGL format
    );

    // Draw the cube as triangles using all 36 vertices (6 faces * 2 triangles per face * 3 vertices per triangle), creating a complete 3D representation of the cube on the canvas
    gl.drawArrays(
        gl.TRIANGLES,  // Draw groups of vertices as triangles
        0,             // Begin with the first vertex
        36             // Draw all 36 vertices to form the cube
    );

    // Request another animation frame and run the render function again, creating a loop that continuously updates the cube's rotation and redraws it on the canvas for smooth animation
    requestAnimationFrame(render);
}