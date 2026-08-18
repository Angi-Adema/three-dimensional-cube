/*
 * Matrix and vector functions taken from the MVnew.js file in the
 * Interactive Computer Graphics: A Top-Down Approach with WebGL (8th ed.) 
 * by Angel and Shreiner.
 * 
 * Only the applicable functions were included here from the original file.
 * 
 * Source:
 * https://www.interactivecomputergraphics.com/Code/Common/MVnew.js
 */

// Helper Functions

// Check whether the input is a two-, three-, or four-dimensional vector
function isVector(v) {
  if(v.type == "vec2" || v.type == "vec3" || v.type == "vec4") return true;
  return false;
}

// Check whether the input is a 2x2, 3x3, or 4x4 matrix
function isMatrix(v) {
  if(v.type == "mat2" || v.type == "mat3" || v.type == "mat4") return true;
  return false;
}

//  Vector Constructors

// Create a two-dimensional vector and identify it as a vec2 type. The function can be called with no arguments, one argument (another vector), or two arguments (the x and y components of the vector).
function vec2()
{
    var out = new Array(2);
    out.type = 'vec2';

    switch ( arguments.length ) {
      case 0:
        out[0] = 0.0;
        out[1] = 0.0;
        break;
      case 1:
        if(isVector(arguments[0] && (arguments[0].type != 'vec2'))) {
        out[0] = arguments[0][0];
        out[1] = arguments[0][1];
      }
        break;

      case 2:
        out[0] = arguments[0];
        out[1] = arguments[1];
        break;
    }
    return out;
}

// Create a three-dimensional vector and identify it as a vec3 type. The function can be called with no arguments, one argument (another vector), or three arguments (the x, y, and z components of the vector).
function vec3()
{
//var result = _argumentsToArray( arguments );

    var out = new Array(3);
    out.type = 'vec3';

    switch ( arguments.length ) {
    case 0:
      out[0] = 0.0;
      out[1] = 0.0;
      out[2] = 0.0;
      return out;
    case 1:
    if(isVector(arguments[0]) && (arguments[0].type == "vec3")) {
      out[0] = arguments[0][0];
      out[1] = arguments[0][1];
      out[2] = arguments[0][2];
      return out;
    }
    case 3:
      out[0] = arguments[0];
      out[1] = arguments[1];
      out[2] = arguments[2];
      return out;
      default:
        throw "vec3: wrong arguments";
    }

    return out;
}

// Create a four-dimensional vector and identify it as a vec4 type. The function can be called with no arguments, one argument (another vector), or four arguments (the x, y, z, and w components of the vector).
function vec4()
{
    var out = new Array(4);
    out.type = 'vec4';
    switch ( arguments.length ) {

      case 0:

        out[0] = 0.0;
        out[1] = 0.0;
        out[2] = 0.0;
        out[3] = 0.0;
        return out;

      case 1:
        if(isVector(arguments[0])) {
          if(arguments[0].type == "vec4") {
            out[0] = arguments[0][0];
            out[1] = arguments[0][1];
            out[2] = arguments[0][2];
            out[3] = arguments[0][3];
            return out;
          }
        }
          else if(arguments[0].type == "vec3") {
            out[0] = arguments[0][0];
            out[1] = arguments[0][1];
            out[2] = arguments[0][2];
            out[3] = 1.0;
            return out;
          }
          else {
            out[0] = arguments[0][0];
            out[1] = arguments[0][1];
            out[2] = arguments[0][2];
            out[3] = arguments[0][3];
            return out;
          }



      case 2:
        if(typeof(arguments[0])=='number'&&arguments[1].type == 'vec3') {
          out[0] = arguments[0];
          out[1] = arguments[1][0];
          out[2] = arguments[1][1];
          out[3] = arguments[1][2];
          return out;
      }
      return out;

      case 4:

      if(isVector(arguments[0])) {
        out[0] = arguments[0][0];
        out[1] = arguments[0][1];
        out[2] = arguments[0][2];
        out[3] = arguments[0][3];
        return out;
      }
        out[0] = arguments[0];
        out[1] = arguments[1];
        out[2] = arguments[2];
        out[3] = arguments[3];
        return out;
      case 3:
        out[0] = arguments[0][0];
        out[1] = arguments[0][1];
        out[2] = arguments[0][2];
        out[3] = 1.0;
        return out;
      default:
        throw "vec4: wrong arguments";
  }
}

//  Matrix Constructors

// Create a 2x2 matrix from input or create an identity matrix if no input is provided. The function can be called with no arguments, one argument (another matrix), or four arguments (the elements of the matrix).
function mat2()
{
    var out = new Array(2);
    out[0] = new Array(2);
    out[1] = new Array(2);

    switch ( arguments.length ) {
    case 0:
        out[0][0]=out[3]=1.0;
        out[1]=out[2]=0.0;
        break;
    case 1:
      if(arguments[0].type == 'mat2') {
        out[0][0] = arguments[0][0][0];
        out[0][1] = arguments[0][0][1];
        out[1][0] = arguments[0][1][0];
        out[1][1] = arguments[0][1][1];
        break;
      }

    case 4:
        out[0][0] = arguments[0];
        out[0][1] = arguments[1];
        out[1][0] = arguments[2];
        out[1][1] = arguments[3];
        break;
     default:
         throw "mat2: wrong arguments";
    }
    out.type = 'mat2';

    return out;
}

// Create a 3x3 matrix from input or create an identity matrix if no input is provided. The function can be called with no arguments, one argument (another matrix), or nine arguments (the elements of the matrix).
function mat3()
{
    // v = _argumentsToArray( arguments );

    var out = new Array(3);
    out[0] = new Array(3);
    out[1] = new Array(3);
    out[2] = new Array(3);

    switch ( arguments.length ) {
      case 0:
          out[0][0]=out[1][1]=out[2][2]=1.0;
          out[0][1]=out[0][2]=out[1][0]=out[1][2]=out[2][0]=out[2][1]=0.0;
          break;
    case 1:
         for(var i=0; i<3; i++) for(var j=0; j<3; j++) {
           out[i][j]=arguments[0][3*i+j];
         }
        break;

    case 9:
        for(var i=0; i<3; i++) for(var j=0; j<3; j++) {
          out[i][j] = arguments[3*i+j];
        }
        break;
    default:
        throw "mat3: wrong arguments";
    }
    out.type = 'mat3';

    return out;
}

// Create a 4x4 matrix for the model-view and projection transformations. The function can be called with no arguments, one argument (another matrix), or sixteen arguments (the elements of the matrix).
function mat4()
{
    //var v = _argumentsToArray( arguments );

    var out = new Array(4);
    out[0] = new Array(4);
    out[1] = new Array(4);
    out[2] = new Array(4);
    out[3] = new Array(4);

    switch ( arguments.length ) {
    case 0:
      out[0][0]=out[1][1]=out[2][2]=out[3][3] = 1.0;
      out[0][1]=out[0][2]=out[0][3]=out[1][0]=out[1][2]=out[1][3]=out[2][0]=out[2][1]
        =out[2][3]=out[3][0]=out[3][1]=out[3][2]=0.0;

      break;

    case 1:
      for(var i=0; i<4; i++) for(var i=0; i<4; i++) {
        out[i][j]=arguments[0][4*i+j];
      }
      break;

    case 4:
      if(arguments[0].type == "vec4") {
      for( var i=0; i<4; i++)
        for(var j=0; j<4; j++)
          out[i][j] = arguments[i][j];
       break;
      }

    case 16:
      for(var i=0; i<4; i++) for(var j=0; j<4; j++) {
        out[i][j] = arguments[4*i+j];
      }
      break;
    }
    out.type = 'mat4';

    return out;
}

//  Generic Mathematical Operations for Vectors and Matrices
// Compare two vectors or matrices for equality. Return true if they are equal, false otherwise.
function equal( u, v )
{
    if(!(isMatrix(u)&&isMatrix(v) || (isVector(u)&&isVector(v))))
      throw "equal: at least one input not a vec or mat";
    if ( u.type != v.type ) throw "equal: types different";
    if(isMatrix(u)) {
        for ( var i = 0; i < u.length; ++i ) for ( var j = 0; j < u.length; ++j )
            if ( u[i][j] !== v[i][j] )  return false;
        return true;
    }
    if(isVector(u)) {
        for ( var i = 0; i < u.length; ++i )
            if ( u[i] !== v[i] )  return false;
          return true;
        }
}

// Subtract one vector or matrix from another matching vector or matrix. Return the result as a new vector or matrix.
function subtract( u, v )
{

  if ( u.type != v.type ) {
      throw "subtract(): trying to subtract different types";
  }
  if(isVector(u)){
    if(u.type == 'vec2')  var result =vec2();
    if(u.type == 'vec3')  var result = vec3();
    if(u.type == 'vec4')  var result = vec4();
    result.type = u.type;
    for(var i=0; i<u.length; i++) {
      result[i] = u[i] - v[i];
      }
      return result;
    }
  if(isMatrix(u)){
    if(u.type == 'mat2')  var result = mat2();
    if(u.type == 'mat3')  var result = mat3();
    if(u.type == 'mat4')  var result = mat4();
    for(var i=0; i<u.length; i++) for(var j=0; j<u.length; j++){
       result[i][j] = u[i][j] - v[i][j];
      }
      return result;
    }
}

//  ModelView Matrix Generators
// Create a model-view matrix using the camera position, target position, and up direction. Return the result as a new 4x4 matrix.
function lookAt( eye, at, up )
{
    if ( eye.type != 'vec3') {
        throw "lookAt(): first parameter [eye] must be an a vec3";
    }

    if ( at.type != 'vec3') {
        throw "lookAt(): first parameter [at] must be an a vec3";
    }

    if (up.type != 'vec3') {
        throw "lookAt(): first parameter [up] must be an a vec3";
    }

    if ( equal(eye, at) ) {
        return mat4();
    }

    var v = normalize( subtract(at, eye) );  // view direction vector
    var n = normalize( cross(v, up) ); // perpendicular vector
    var u = normalize( cross(n, v) );        // "new" up vector
    v = negate( v );

    var result = mat4(
        n[0], n[1], n[2], -dot(n, eye),
        u[0], u[1], u[2], -dot(u, eye),
        v[0], v[1], v[2], -dot(v, eye),
        0.0,  0.0,  0.0,  1.0
    );

    return result;
}

//  Projection Matrix Generators
// Create an orthographic projection matrix from the viewing variables left, right, bottom, top, near, and far. Return the result as a new 4x4 matrix.
function ortho( left, right, bottom, top, near, far )
{
    if ( left == right ) { throw "ortho(): left and right are equal"; }
    if ( bottom == top ) { throw "ortho(): bottom and top are equal"; }
    if ( near == far )   { throw "ortho(): near and far are equal"; }

    var w = right - left;
    var h = top - bottom;
    var d = far - near;

    var result = mat4();

    result[0][0] = 2.0 / w;
    result[1][1] = 2.0 / h;
    result[2][2] = -2.0 / d;

    result[0][3] = -(left + right) / w;
    result[1][3] = -(top + bottom) / h;
    result[2][3] = -(near + far) / d;
    result[3][3] = 1.0;

    return result;
}

//  Vector Functions
// Compute the dot product of two vectors. Return the result as a scalar value.
function dot( u, v )
{

    if ( u.type != v.type ) {
      throw "dot(): types are not the same ";
    }
    if (u.type != 'vec2' && u.type != 'vec3' && u.type != 'vec4') {
      throw "dot(): not a vector ";
    }

    var sum = 0.0;
    for ( var i = 0; i < u.length; i++ ) {
        sum += u[i] * v[i];
    }
    return sum;
}

// Compute the negation of a vector. Return the result as a new vector.
function negate( u )
{
  if (u.type != 'vec2' && u.type != 'vec3' && u.type != 'vec4') {
    throw "negate(): not a vector ";
  }
  var result = new Array(u.length);
  result.type = u.type;
  for ( var i = 0; i < u.length; ++i ) {
    result[i] = -u[i];
  }
    return result;
}

// Compute the cross product of two three-dimensional vectors. Return the result as a new vector.
function cross( u, v )
{
    if ( u.type == 'vec3' && v.type == 'vec3') {
      var result = vec3(
          u[1]*v[2] - u[2]*v[1],
          u[2]*v[0] - u[0]*v[2],
          u[0]*v[1] - u[1]*v[0]
      );
      return result;
    }

    if ( v.type == 'vec4' && v.type == 'vec4') {
      var result = vec3(
          u[1]*v[2] - u[2]*v[1],
          u[2]*v[0] - u[0]*v[2],
          u[0]*v[1] - u[1]*v[0]
      );
      return result;
    }

    throw "cross: types aren't matched vec3 or vec4";
}

// Convert a vector to unit length preserving the direction. Return the result as a new vector. If excludeLastComponent is true, the last component of the vector will not be normalized.
function normalize( u, excludeLastComponent )
{
    if(u.type != 'vec3' && u.type != 'vec4') {

      throw "normalize: not a vector type";
    }
    switch(u.type) {
      case 'vec2':
        var len = Math.sqrt(u[0]*u[0]+u[1]*u[1]);
        var result = vec2(u[0]/len, u[1]/len);
        return result;
      break;
      case 'vec3':
        if(excludeLastComponent) {
          var len = Math.sqrt(u[0]*u[0]+u[1]*u[1]);
          var result = vec3(u[0]/len, u[1]/len, u[2]);
          return result;
          break;
        }
        else {
        var len = Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]);
        var result = vec3(u[0]/len, u[1]/len, u[2]/len);
        return result;
        break;
      }
      case 'vec4':
      if(excludeLastComponent) {
        var len = Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]);
        var result = vec4(u[0]/len, u[1]/len, u[2]/len, u[3]);
        return result;
        break;
      }
      else {
        var len = Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]+u[3]*u[3]);
        var result = vec4(u[0]/len, u[1]/len, u[2]/len, u[3]/len);
        return result;
        break;
      }
    }
}

// Vector and Matrix utility functions
// Convert a vector, matrix, or nested-array to a Float32Array for use with WebGL. Return the result as a new Float32Array.
function flatten( v )
{

    if(isVector(v)) {
      var floats = new Float32Array(v.length)
      for(var i =0; i<v.length; i++) floats[i] = v[i];
      return floats;
    }
    if(isMatrix(v)) {

        var floats = new Float32Array(v.length*v.length);
        for(var i =0; i<v.length; i++) for(j=0;j<v.length; j++) {
          floats[i*v.length+j] = v[j][i];
        }
        return floats;
      }

      var floats = new Float32Array( v.length*v[0].length  );

      for(var i = 0; i<v.length; i++) for(var j=0; j<v[0].length; j++) {
        floats[i*v[0].length+j] = v[i][j];
      }
      return floats;
}