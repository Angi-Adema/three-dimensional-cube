// Use strict helps catch errors while coding
"use strict";

// Declare the WebGL context
var gl;

// Create an arrays to store cube vertex positions and colors
var points = [];
var colors = [];

// Set the initial rotation angle for the cube
var theta = 0.0;

// Declare a variable to hold the location of the model-view matrix uniform in the shader program
var modelViewMatrixLoc;

// Create the eight vertices of the cube front square and back square, each represented as a 4D vector (x, y, z, w)
var vertices = [
    [-0.5, -0.5,  0.5, 1.0],  // Vertex 0: front bottom left
    [-0.5,  0.5,  0.5, 1.0],  // Vertex 1: front top left
    [0.5,  0.5,  0.5, 1.0],  // Vertex 2: front top right
    [0.5, -0.5,  0.5, 1.0],  // Vertex 3: front bottom right
    [0.5,  0.5, -0.5, 1.0],  // Vertex 4: back bottom left
    [0.5, -0.5, -0.5, 1.0],  // Vertex 5: back bottom right
    [-0.5, -0.5, -0.5, 1.0],  // Vertex 6: back top right
    [-0.5,  0.5, -0.5, 1.0],  // Vertex 7: back bottom right
];

// Colors of cube faces, each represented as a 4D vector (r, g, b, a)
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

// Run init functions after the page has loaded to ensure the canvas is available
window.onload = function init()
{   
    // Retrieve canvas element from the HTML document by its ID
    var canvas = document.getElementById("glCanvas");

    // Create the WebGL rendering context
    gl = canvas.getContext("webgl");

    // Error handling to ensure WebGL is available
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

    // Create and compile the shader program, which contains the vertex and fragment shaders that will be used to render the cube
    var program = createShaderProgram();

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

// Convert the nested arrays into a Float32Array required by WebGL
function flatten(array)
{
    // Create an empty array to hold the flattened data
    var result = [];

    // Loop through each item in the array
    for (var i = 0; i < array.length; i++)
    {
        // Loop through each value in the item
        for (var j = 0; j < array[i].length; j++)
        {
            // Push the value into the result array
            result.push(array[i][j]);
        }
    }
    // Convert the result array into a Float32Array and return it, which is the format required by WebGL for buffer data
    return new Float32Array(result);
}

// Create and compile the shader program
function createShaderProgram()
{
    // Get the vertex shader code from the HTML page
    var vertexSource =
        document.getElementById("vertex-shader").text;

    // Get the fragment shader code from the HTML page
    var fragmentSource =
        document.getElementById("fragment-shader").text;

    // Create the vertex shader
    var vertexShader =
        gl.createShader(gl.VERTEX_SHADER);

    // Add the vertex shader source code
    gl.shaderSource(vertexShader, vertexSource);

    // Compile the vertex shader
    gl.compileShader(vertexShader);

    // Check whether the vertex shader compiled correctly
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        console.log(
            gl.getShaderInfoLog(vertexShader)
        );
    }

    // Create the fragment shader
    var fragmentShader =
        gl.createShader(gl.FRAGMENT_SHADER);

    // Add the fragment shader source code
    gl.shaderSource(fragmentShader, fragmentSource);

    // Compile the fragment shader
    gl.compileShader(fragmentShader);

    // Check whether the fragment shader compiled correctly
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    {
        console.log(
            gl.getShaderInfoLog(fragmentShader)
        );
    }

    // Create the shader program
    var program = gl.createProgram();

    // Attach the vertex shader
    gl.attachShader(program, vertexShader);

    // Attach the fragment shader
    gl.attachShader(program, fragmentShader);

    // Link the shaders together
    gl.linkProgram(program);

    // Check whether the program linked correctly
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.log(
            gl.getProgramInfoLog(program)
        );
    }

    // Return the finished shader program
    return program;
}

// Create a rotation matrix for the x-axis
function rotateX(angle)
{
    // Convert degrees to radians
    var radians = angle * Math.PI / 180.0;

    // Calculate cosine and sine values
    var c = Math.cos(radians);
    var s = Math.sin(radians);

    // Return the rotation matrix
    return [
        1, 0, 0, 0,
        0, c, s, 0,
        0, -s, c, 0,
        0, 0, 0, 1
    ];
}

// Create a rotation matrix for the y-axis
function rotateY(angle)
{
    // Convert degrees to radians
    var radians = angle * Math.PI / 180.0;

    // Calculate cosine and sine values
    var c = Math.cos(radians);
    var s = Math.sin(radians);

    // Return the rotation matrix
    return [
        c, 0, -s, 0,
        0, 1, 0, 0,
        s, 0, c, 0,
        0, 0, 0, 1
    ];
}

// Multiply two 4x4 matrices
function multiplyMatrices(a, b)
{
    var result = new Array(16);

    // Loop through each row
    for (var row = 0; row < 4; row++)
    {
        // Loop through each column
        for (var column = 0; column < 4; column++)
        {
            var sum = 0;

            // Multiply and add matching values
            for (var i = 0; i < 4; i++)
            {
                sum +=
                    a[i * 4 + row] *
                    b[column * 4 + i];
            }

            result[column * 4 + row] = sum;
        }
    }

    return result;
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

    // Create x- and y-axis rotation matrices based on the current rotation angle, which will be used to transform the cube's vertex positions in 3D space
    var xRotation = rotateX(theta);
    var yRotation = rotateY(theta);

    // Create a matrix that rotates the cube on the x and y axes based on the current rotation angle, allowing the cube to appear as if it is spinning in 3D space
    var modelViewMatrix =
        multiplyMatrices(
            xRotation, // Rotate around x-axis
            yRotation  // Rotate around y-axis
        );

    // Send the model-view matrix to the shader program, allowing the vertex positions to be transformed according to the current rotation before being rendered on the canvas
    gl.uniformMatrix4fv(
        modelViewMatrixLoc,      // Location of the matrix in the shader
        false,                   // Do not transpose the matrix
        new Float32Array(modelViewMatrix)
    );

    // Draw all 36 cube vertices as triangles, using the vertex data stored in the buffers and transformed by the model-view matrix to create the appearance of a rotating 3D cube on the canvas
    gl.drawArrays(
        gl.TRIANGLES,
        0,
        36
    );

    // Request another animation frame and run the render function again, creating a loop that continuously updates the cube's rotation and redraws it on the canvas for smooth animation
    requestAnimationFrame(render);
}