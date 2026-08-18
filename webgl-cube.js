// Use strict helps catch errors while coding
"use strict";

// Declare gl globally to store the WebGL rendering context
var gl;

// Create empty arrays to store cube vertex positions and colors of the cube
var points = [];
var colors = [];

// Create variables to hold the rotation angles for the cube around the x- and y-axes 
var radius = 1.0;
var theta = 0.0;
var phi = 0.0;

// Store the calculated eye position
var eye;

// Ensure the camera is always looking at the center of the cube, which is at the origin (0, 0, 0) with y-axis as the up direction
const at = vec3[0.0, 0.0, 0.0];
const up = vec3[0.0, 1.0, 0.0];

// Create variables to hold the model-view and projection matrices
var modelViewMatrix;
var projectionMatrix;

// Create the orthographic viewing volume variables
var left = -1.0;
var right = 1.0;
var bottom = -1.0;
var ytop = 1.0;
var near = -1.0;
var far = 1.0;

// Create a variable to hold the orthographic projection matrix, used to transform the cube's vertex positions from 3D to 2D screen space
var projectionMatrix;

// Store the shader locations for the model-view and the projection matrices, which will be used to transform the cube's vertex positions in 3D space
var modelViewMatrixLoc;
var projectionMatrixLoc;

// Create the eight vertices or corners of the cube as 4D vertex positions (x, y, z, w)
var vertices = [
    [-0.5, -0.5, 0.5, 1.0],  // Vertex 0: front bottom left
    [-0.5, 0.5, 0.5, 1.0],   // Vertex 1: front top left
    [0.5, 0.5, 0.5, 1.0],    // Vertex 2: front top right
    [0.5, -0.5, 0.5, 1.0],   // Vertex 3: front bottom right
    [-0.5, -0.5, -0.5, 1.0], // Vertex 4: back bottom left
    [-0.5, 0.5, -0.5, 1.0],  // Vertex 5: back top left
    [0.5, 0.5, -0.5, 1.0],   // Vertex 6: back top right
    [0.5, -0.5, -0.5, 1.0],  // Vertex 7: back bottom right
];

// Colors of cube faces, each represented as a 4D vector (r, g, b, a)
// Each color is made up of red, green, blue, and alpha (opacity) components, with values ranging from 0.0 to 1.0
var vertexColors = [
    [0.961, 0.569, 0.988, 1.0],  // #F591FC
    [0.839, 0.039, 0.980, 1.0],  // #D60AFA
    [0.635, 0.008, 0.969, 1.0],  // #A202F7
    [0.376, 0.286, 0.890, 1.0],  // #6049E3
    [0.408, 0.545, 0.961, 1.0],  // #688BF5
    [0.035, 0.773, 0.839, 1.0],  // #09C5D6
    [0.208, 0.922, 0.871, 1.0],  // #35EBDE
    [0.259, 0.878, 0.682, 1.0]   // #42E0AE
];

// Once the web page has fully loaded, run the init function to set up WebGL, create the cube, and start the rendering loop
window.onload = function init()
{   
    // Retrieve canvas element from the HTML document by its ID
    var canvas = document.getElementById("glCanvas");

    // Create the WebGL 2.0 rendering context and store it in the global variable established above
    gl = canvas.getContext("webgl2");

    // Confirm if the WebGL 2.0 context was successfully created; if not, display an alert to the user indicating that WebGL is not available in their browser
    if (!gl)
    {
        // Display an alert if WebGL 2.0 is not available in the user's browser
        alert("WebGL 2.0 is not available.");
    }

    // Generate the six sides of the cube placing their vertex positions and colors into the points and colors arrays
    colorCube();

    // Define the canvas area that WebGL will use to render the cube. 
    gl.viewport(
        0,                // Begin at the left edge of the canvas
        0,                // Begin at the bottom edge of the canvas
        canvas.width,     // Use the full canvas width
        canvas.height);   // Use the full canvas height

    // Set the color to be used when the color buffer is cleared (background set to black)
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Enable depth testing so that WebGL can correctly determine front surfaces from back surfaces when rendering
    gl.enable(gl.DEPTH_TEST);

    // Create, compile, and link the vertex and fragment shaders into a single program
    var program = createShaderProgram();

    // Instruct WebGL to use this shader program for rendering the cube
    gl.useProgram(program);

    // Create a WebGL buffer for storing the cube's color data, which will be sent to the GPU for rendering
    var cBuffer = gl.createBuffer();

    // Set the color buffer as the active ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

    // Load the cube's color values into the currently bound WebGL buffer
    gl.bufferData(
        gl.ARRAY_BUFFER,   // Store the data in the active array buffer
        flatten(colors),   // Convert the nested color arrays to a flat Float32Array for WebGL
        gl.STATIC_DRAW     // Indicate that the data will not change frequently, allowing WebGL to optimize its storage and access
    );

    // Locate the aColor attribute in the shader program
    var aColor = gl.getAttribLocation(program, "aColor");
    
    // Specify how WebGL should read the color data from the active color buffer
    gl.vertexAttribPointer(
        aColor,    // Location of the aColor attribute
        4,         // Four values for each color (r, g, b, a)
        gl.FLOAT,  // Each value is stored as a floating-point number
        false,     // Ensure values are not normalized
        0,         // Colors are stored directly next to each other in the buffer with no spacing
        0          // Start reading from the beginning of the buffer
    );
    
    // Enable the aColor attribute to allow the shader program to access the color data for rendering
    gl.enableVertexAttribArray(aColor);

    // Create a WebGL buffer to store the cube's vertex positions
    var vBuffer = gl.createBuffer();

    // Set the vertex-position buffer as the active ARRAY_BUFFER, allowing WebGL to know where to read the vertex position data from
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

    // Copy the vertex positions data into the position buffer using the flatten function to convert the points
    gl.bufferData(
        gl.ARRAY_BUFFER,
        flatten(points),
        gl.STATIC_DRAW   // Data is static and will not change frequently
    );

    // Locate the aPosition attribute in the shader program
    var aPosition =
        gl.getAttribLocation(program, "aPosition");

    // Specify how WebGL should read the vertex position data from the active position buffer
    gl.vertexAttribPointer(
        aPosition,  // Shader attribute location
        4,          // Four values for each vertex position (x, y, z, w)
        gl.FLOAT,   // Each value is a floating-point number
        false,      // Ensure values are not normalized
        0,          // Default spacing between (vertex positions right next to each other with no spacing)
        0           // Start reading from the beginning of the buffer
    );
    // Enable the aPosition attribute to allow the shader program to access the vertex position data for rendering
    gl.enableVertexAttribArray(aPosition);

    //Find the model-view matrix uniform location in the shader program and store it so the rotation matrix can be sent to the shader
    modelViewMatrixLoc =
        gl.getUniformLocation(
            program,
            "uModelViewMatrix"
        );

    // Find the projection matrix uniform location in the shader program and store it so the projection matrix can be sent to the shader
    projectionMatrixLoc =
        gl.getUniformLocation(
            program,
            "uProjectionMatrix"
        );

    // Draw the first frame and start the continuous animation loop
    render();
};

// Generate all six faces of the cube by calling the quad function for each face, specifying the indices of the vertices that make up each face
function colorCube()
{
    quad(1, 0, 3, 2);   // Front face (vertices: 1, 0, 3, 2)
    quad(2, 3, 7, 6);   // Right face (vertices: 2, 3, 7, 6)
    quad(3, 0, 4, 7);   // Bottom face (vertices: 3, 0, 4, 7)
    quad(6, 5, 1, 2);   // Top face (vertices: 6, 5, 1, 2)
    quad(4, 5, 6, 7);   // Back face (vertices: 4, 5, 6, 7)
    quad(5, 4, 0, 1);   // Left face (vertices: 5, 4, 0, 1)
}

// Divide one square cube face into two triangles
function quad(a, b, c, d)
{
    // Store the six vertex indices needed to create the two triangles.
    // Triangle 1 uses a, b, c and triangle 2 uses a, c, d. This ensures that the two triangles together form a square face of the cube.
    var indices = [
        a, b, c,
        a, c, d
    ];

    // Loop through the six vertex indices for the two triangles, and for each index, push the corresponding vertex position and color into the points and colors arrays
    for (var i = 0; i < indices.length; i++)
    {
        points.push(vertices[indices[i]]);   // Store corresponding vertex positions in the points array
        colors.push(vertexColors[a]);        // Give each vertex of this face the same color, the first vertex index (a) sets the face color
    }
}

// flatten() function commented out as this function is now handled by the textbook version in matrix-vector.js.
// // Convert the nested arrays into a Float32Array required by WebGL
// function flatten(array)
// {
//     // Create an empty array to hold the flattened data
//     var result = [];

//     // Loop through each item in the array
//     for (var i = 0; i < array.length; i++)
//     {
//         // Loop through each value in the item
//         for (var j = 0; j < array[i].length; j++)
//         {
//             // Push the value into the result array
//             result.push(array[i][j]);
//         }
//     }
//     // Convert the result array into a Float32Array and return it, which is the format required by WebGL for buffer data
//     return new Float32Array(result);
// }

// Create, compile, and link the vertex and fragment shaders
function createShaderProgram()
{
    // Get the vertex shader source code from the HTML page
    var vertexSource =
        document.getElementById("vertex-shader").text;

    // Get the fragment shader source code from the HTML page
    var fragmentSource =
        document.getElementById("fragment-shader").text;

    // Create an empty WebGL vertex shader object to hold the compiled vertex shader code
    var vertexShader =
        gl.createShader(gl.VERTEX_SHADER);

    // Add the vertex shader source code to the vertex shader object, preparing it for compilation
    gl.shaderSource(vertexShader, vertexSource);

    // Compile the vertex shader source code so the GPU can execute it
    gl.compileShader(vertexShader);

    // Check whether the vertex shader compiled correctly
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        console.log(
            gl.getShaderInfoLog(vertexShader)  // Display the shader compiler error in the browser console if compilation failed
        );
    }

    // Create an empty WebGL fragment shader object to hold the compiled fragment shader code
    var fragmentShader =
        gl.createShader(gl.FRAGMENT_SHADER);

    // Add the fragment shader source code to the fragment shader object
    gl.shaderSource(fragmentShader, fragmentSource);

    // Compile the fragment shader source code so the GPU can execute it
    gl.compileShader(fragmentShader);

    // Check whether the fragment shader compiled correctly
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    {
        console.log(
            gl.getShaderInfoLog(fragmentShader)   // Display the error to the browser console if the fragment shader compilation failed
        );
    }

    // Create the shader program that will contain both shaders
    var program = gl.createProgram();

    // Attach the compiled vertex shader to the WebGL program
    gl.attachShader(program, vertexShader);

    // Attach the compiled fragment shader to the WebGL program
    gl.attachShader(program, fragmentShader);

    // Link the vertex and fragment shaders together into one usable program
    gl.linkProgram(program);

    // Check whether the program linked correctly
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.log(
            gl.getProgramInfoLog(program)  // Display the error to the browser console if the program linking failed
        );
    }

    // Return the finished shader program to the init function
    return program;
}

// Create a 4x4 matrix that represents rotation of the cube around the x-axis
function rotateX(angle)
{
    // Convert the rotation angle from degrees to radians as JavaScript's Math functions use radians
    var radians = angle * Math.PI / 180.0;

    // Calculate cosine and sine rotation angle values
    var c = Math.cos(radians);
    var s = Math.sin(radians);

    // Return the 4x4 x-axis rotation matrix
    return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1
    ];
}

// Create a 4x4 matrix representing rotation around the y-axis
function rotateY(angle)
{
    // Convert degrees to radians for JavaScript's Math functions
    var radians = angle * Math.PI / 180.0;

    // Calculate cosine and sine values of the rotation angle
    var c = Math.cos(radians);
    var s = Math.sin(radians);

    // Return the 4x4 y-axis rotation matrix
    return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
    ];
}

// Multiply two 4x4 matrices and return the resulting 4x4 matrix
function multiplyMatrices(a, b)
{
    // Create an array with 16 positions to store the resulting 4x4 matrix
    var result = new Array(16);

    // Loop through each of the 4 matrix rows
    for (var row = 0; row < 4; row++)
    {
        // Loop through each of the 4 matrix columns
        for (var column = 0; column < 4; column++)
        {
            var sum = 0;  // Start the value for the current result position at 0

            // Multiply the matching row and column values and add the four products together to get the value for the current position in the result matrix
            for (var i = 0; i < 4; i++)
            {
                sum +=
                    a[i * 4 + row] *
                    b[column * 4 + i];
            }

            // Store the calculated values in the appropriate position of the resulting matrix
            result[column * 4 + row] = sum;
        }
    }

    // Return the completed combined transformation matrix
    return result;
}

// Draw one frame of the cube and continuously repeat the process to animate the rotating cube
function render()
{
    // Clear the previous frame's color and depth information to prepare for drawing the new frame
    gl.clear(
        gl.COLOR_BUFFER_BIT |
        gl.DEPTH_BUFFER_BIT
    );

    // // Update the rotation angle for the next frame, creating a continuous rotation effect for the cube
    // theta += 0.5;

    // // Create x- and y-axis rotation matrices based on the current rotation angle, which will be used to transform the cube's vertex positions in 3D space
    // var xRotation = rotateX(theta);
    // var yRotation = rotateY(theta);

    // // Combine the x- and y-axis rotations into one transformation matrix
    // var modelViewMatrix =
    //     multiplyMatrices(
    //         xRotation, // Rotate around x-axis
    //         yRotation  // Rotate around y-axis
    //     );

    // Calculate the eye position in 3D space using spherical coordinates based on the current rotation angles theta and phi
    eye = vec3(
        radius * Math.sin(theta) * Math.cos(phi),  // x-coordinate of the eye position
        radius * Math.sin(theta) * Math.sin(phi),  // y-coordinate of the eye position
        radius * Math.cos(theta)                    // z-coordinate of the eye position
    );

    // Create a model-view matrix using the eye position, the center of the cube (at), and the up direction (up)
    modelViewMatrix = lookAt(
        eye,  // Position of the camera in 3D space
        at,   // Point the camera is looking at (center of the cube)
        up    // Up direction for the camera
    );

    // Create an orthographic projection matrix using the specified variables
    projectionMatrix = ortho(
        left,   // Left clipping plane
        right,  // Right clipping plane
        bottom, // Bottom clipping plane
        ytop,   // Top clipping plane
        near,   // Near clipping plane
        far     // Far clipping plane
    )

    // Send the combined transformation matrix to the uModelViewMatrix uniform in the vertex shader
    gl.uniformMatrix4fv(
        modelViewMatrixLoc,                 // Location of uModelViewMatrix in the shader program
        false,                              // WebGL expects this value to be false, indicating that the matrix is not transposed
        flatten(modelViewMatrix)            // Convert the matrix to WebGL-compatible data
    );

    // Send the orthographic projection matrix to the vertex shader
    gl.uniformMatrix4fv(
        projectionMatrixLoc,                 // Location of uProjectionMatrix in the shader program
        false,                               // WebGL expects this value to be false, indicating that the matrix is not transposed
        flatten(projectionMatrix)            // Convert the matrix to WebGL-compatible data  
    );

    // Draw the cube using all 36 vertices created by the colorCube and quad
    gl.drawArrays(
        gl.TRIANGLES,  // Each group of three vertices represents one triangle (2 triangles per cube face)
        0,             // Start drawing from the first vertex in the points array
        36             // Draw all 36 vertices or 12 triangles that make up the cube's six faces
    );

    // Request the browser to call render again before displaying the next frame as this will create the continuous rotation animation
    requestAnimationFrame(render);
}