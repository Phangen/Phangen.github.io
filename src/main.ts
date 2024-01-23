import { Module, debug } from "webpack";
import {mat4, mat3} from "./glMatrix";
import {myPrimitives} from "./myPrimitives";
import {myMatrixMath} from "./MyMatrixMath";
import {myObject} from "./myObject";
import { myNormalCalculations } from "./myNormalCalculation";

import {TextureHelper} from "./TextureHelpers.js";

import {Mesh, MaterialLibrary , Material} from 'webgl-obj-loader';

import {OBJ} from 'webgl-obj-loader';

import {myDrawing} from './MyDrawingFunctions';

import {getUniforms, getSkyBoxUniforms, createBuffer, createShader} from './InitHelpers';
import {CubeMapHelpers} from './MyCubeMapHelpers';

//-----------------------------------------------------------------------------
// CONSTANTS
//----------------------------------------------------------------

const lightObjectScale = 0.3;

//Buffer Constants
const VERTEX_POS_SIZE = 3;
const VERTEX_COLOR_SIZE = 3;

//Movement Constants
const radiansToRotateCamera = 10 * Math.PI / 180;
const distanceToMovePlayer = 0.1, distanceToMovelight = 0.1;
const amountToRotateMagnets = 0.5;
const MagnemiteMovementMultiplier = 0.3;

// Initialize the WebGL context.
const canvas = document.getElementById("webgl-canvas") as HTMLCanvasElement;
const canvasSizeMultipler = 1.5;
canvas.width = canvas.width * canvasSizeMultipler;
canvas.height = canvas.height * canvasSizeMultipler;
const gl : WebGL2RenderingContext = canvas.getContext("webgl2");

//Camera Constants
const camPostion = [0, 0, 5];
const centerOfInterest = [0, 0, 0];
const upVector = [0, 1, 0];
const fieldOfView = (60);

//Consts for all 3 primitives
const cubeSize = 1.0, cubePos = [0.0, 0.0, 0.0, 1], cubeColor = [0.2, 0.5, 0.2, 1];
const cylBaseRadius = 0.5, cylTopRadius = 0.2, cylHeight = 1.0, cylNumberOfSlices = 10, cylNumberOfStacks = 3, cylPostion = [0.0, 0.0, 0.0], cylColor =[0.0, 0.0, 0.2];
const sRadius = 0.5, sNumberOfSlices = 10, sNumberOfStacks = 10, sPosition = [0.0, 0.0, 0.0], sColor = [0.2, 0.0, 0.0];

const cubeMat = {
    ambient:  [0, 0, 0, 1],
    diffuse: [1, 1, 0, 1],
    specular: [.9, .9, .9, 1],
    shininess: 50
}

const sphereMat = {
    ambient:  [1, 1, 1, 1],
    diffuse: [1, 1, 1, 1],
    specular: [1, 1, 1, 1],
    shininess: 50
}

//---------------------------------------------------------------- END CONSTANTS

//-----------------------------------------------------------------------------
// UNIFORM LOCATION VARIABLES
//----------------------------------------------------------------

//unifrom variables

var uniforms;
var skyboxUniforms;

//---------------------------------------------------------------- END UNIFORM LOCATION VARIABLES

//-----------------------------------------------------------------------------
// GLOBALS
//----------------------------------------------------------------

var shaderProgram: WebGLProgram, skyboxShaderProgram : WebGLProgram;

//Variable for whether the camera rotates globally or locally.
var globalTransformEnabled : boolean = false;

var drawLightObject : boolean = true;

// Projection and View Variables
var globalProjMatrix = mat4.create();
var globalViewMatrix = mat4.create();

//Objects that hold external obj/json data
var triangle;

var MagnemiteMesh;

var MagnemiteBodyMesh, MagnemiteLeftMagnetMesh, MagnemiteRightMagnetMesh, MagnemiteEyeMesh;

var magnemiteTexture, magnemiteTextloc;

var cubeTextures, cubeMapTexture, numTexturesLoaded = 0, textureNumber = 3 , cubeImages;
var cubeImages2, cubeMapTexture2, numTexturesLoaded2 = 0;

var drawingModeNum = 0;

var skyboxEnabled: boolean = true;

//----------------------------------------------------------------------------- END GLOBALS


//-----------------------------------------------------------------------------
// SCENE OBJECTS
//----------------------------------------------------------------

var playerObject = myObject.createDefault();
var eyeObject = myObject.createDefault();
var LeftMagnetObject = myObject.createDefault();
var RightMagnetObject = myObject.createDefault();


//---------------------------------------------------------------- END

//-----------------------------------------------------------------------------
// LIGHT VARIABLES
//----------------------------------------------------------------

var lightInfo = {
    lightObject : myObject.createDefault(),
    ambient : [0,0,0,1], 
    diffuse : [.8,.8,.8,1],
    specular : [1,1,1,1], 
    pos : function() { return mat4.multiplyVec4(this.lightObject.getModelMatrix(), [0,0,0,1]);}
}


//---------------------------------------------------------------- END LIGHT VARIABLES

//-----------------------------------------------------------------------------
// BUFFERS
//----------------------------------------------------------------

var cubeBuffers = {
    posBuffer: null,
    colorBuffer: null,
    indexBuffer: null,
    normalBuffer: null,
    textureBuffer: null
}

var sphereBuffers = {
    posBuffer: null,
    colorBuffer: null,
    indexBuffer: null,
    normalBuffer: null,
    textureBuffer: null
}

var skyboxBuffers = {
    posBuffer: null,
}

//----------------------------------------------------------------------------- END BUFFERS



//----------------------------------------------------------------------------- END BUFFERS

//-----------------------------------------------------------------------------
// INTIALIZATION FUNCTIONS
//----------------------------------------------------------------

function createShaderProgram() {
    shaderProgram = gl.createProgram();

    // Load the shaders
    let vertexShaderSource = require("./shaders/vertex.glsl");
    let fragmentShaderSource = require("./shaders/fragment.glsl");

    // Create the shaders
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the shaders
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    gl.useProgram(shaderProgram);
}

function createSkyboxShaderProgram() {
    skyboxShaderProgram = gl.createProgram();

    // Load the shaders
    let vertexShaderSource = require("./shaders/skyboxVertex.glsl");
    let fragmentShaderSource = require("./shaders/skyboxFragment.glsl");

    // Create the shaders
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    // Link the shaders
    gl.attachShader(skyboxShaderProgram, vertexShader);
    gl.attachShader(skyboxShaderProgram, fragmentShader);
    gl.linkProgram(skyboxShaderProgram);

    gl.useProgram(skyboxShaderProgram);
}

function setupMatrices(){
    var aspect = gl.canvas.width / gl.canvas.height;

    mat4.perspective(fieldOfView, aspect, 1, 200, globalProjMatrix);

    mat4.lookAt(camPostion, centerOfInterest, upVector, globalViewMatrix);
}

function initBuffers(){

    var cube = myPrimitives.createCube(cubeSize, cubePos, cubeColor);

    var cubNormalsArray = myNormalCalculations.calculateVertexNormals(cube.vertices, cube.indices);

    cubeBuffers.posBuffer = createBuffer(gl, cube.vertices, VERTEX_POS_SIZE, false);
    cubeBuffers.indexBuffer = createBuffer(gl, cube.indices, 1, true);
    cubeBuffers.normalBuffer = createBuffer(gl, cubNormalsArray, VERTEX_POS_SIZE, false);

    var sphere = myPrimitives.createSphere(sRadius, sNumberOfSlices, sNumberOfStacks, sPosition, sColor);

    var sphereNormalsArray = myNormalCalculations.calculateVertexNormals(sphere.vertices, sphere.indices);

    sphereBuffers.posBuffer = createBuffer(gl, sphere.vertices, VERTEX_POS_SIZE, false);
    sphereBuffers.indexBuffer = createBuffer(gl, sphere.indices, 1, true);
    sphereBuffers.normalBuffer = createBuffer(gl, sphereNormalsArray, VERTEX_POS_SIZE, false);

    OBJ.initMeshBuffers(gl, MagnemiteMesh);

    MagnemiteMesh.indicesBuffer = createBuffer(gl, MagnemiteMesh.indices, 1, true);
    if(isNaN(MagnemiteMesh.vertexNormals[0])){
        MagnemiteMesh.normalBuffer = createBuffer(gl, myNormalCalculations.calculateVertexNormals(MagnemiteMesh.vertices, MagnemiteMesh.indices), VERTEX_POS_SIZE, false);
    }

    OBJ.initMeshBuffers(gl, MagnemiteBodyMesh);

    MagnemiteBodyMesh.indicesBuffer = createBuffer(gl, MagnemiteBodyMesh.indices, 1, true);
    if(isNaN(MagnemiteBodyMesh.vertexNormals[0])){
        MagnemiteBodyMesh.normalBuffer = createBuffer(gl, myNormalCalculations.calculateVertexNormals(MagnemiteBodyMesh.vertices, MagnemiteBodyMesh.indices), VERTEX_POS_SIZE, false);
    }

    OBJ.initMeshBuffers(gl, MagnemiteLeftMagnetMesh);

    MagnemiteLeftMagnetMesh.indicesBuffer = createBuffer(gl, MagnemiteLeftMagnetMesh.indices, 1, true);
    if(isNaN(MagnemiteLeftMagnetMesh.vertexNormals[0])){
        MagnemiteLeftMagnetMesh.normalBuffer = createBuffer(gl, myNormalCalculations.calculateVertexNormals(MagnemiteLeftMagnetMesh.vertices, MagnemiteLeftMagnetMesh.indices), VERTEX_POS_SIZE, false);
    }

    OBJ.initMeshBuffers(gl, MagnemiteRightMagnetMesh);

    MagnemiteRightMagnetMesh.indicesBuffer = createBuffer(gl, MagnemiteRightMagnetMesh.indices, 1, true);
    if(isNaN(MagnemiteRightMagnetMesh.vertexNormals[0])){
        MagnemiteRightMagnetMesh.normalBuffer = createBuffer(gl, myNormalCalculations.calculateVertexNormals(MagnemiteRightMagnetMesh.vertices, MagnemiteRightMagnetMesh.indices), VERTEX_POS_SIZE, false);
    }

    OBJ.initMeshBuffers(gl, MagnemiteEyeMesh);

    MagnemiteEyeMesh.indicesBuffer = createBuffer(gl, MagnemiteEyeMesh.indices, 1, true);
    if(isNaN(MagnemiteEyeMesh.vertexNormals[0])){
        MagnemiteEyeMesh.normalBuffer = createBuffer(gl, myNormalCalculations.calculateVertexNormals(MagnemiteEyeMesh.vertices, MagnemiteEyeMesh.indices), VERTEX_POS_SIZE, false);
    }

    var skyboxObject = myPrimitives.createSkyboxCube();

    skyboxBuffers.posBuffer = createBuffer(gl, skyboxObject.vertices, VERTEX_POS_SIZE, false);
}

function loadInExternalObjects(){
    triangle = require("../assets/triangle.json");

    //let Magnemite = require("../assets/Magnemite_obj/MagnemiteObj.obj");
    let Magnemite = require("../assets/MyMagnemite/mag2.obj");
    MagnemiteMesh = Magnemite.default;

    let MagnemiteB = require("../assets/MyMagnemite/MagBody.obj");
    MagnemiteBodyMesh = MagnemiteB.default;

    let MagnemiteLM = require("../assets/MyMagnemite/LeftMagnet.obj");
    MagnemiteLeftMagnetMesh = MagnemiteLM.default;

    let MagnemiteRM = require("../assets/MyMagnemite/RightMagnet.obj");
    MagnemiteRightMagnetMesh = MagnemiteRM.default;

    let MagnemiteEye = require("../assets/MyMagnemite/MagEye.obj");
    MagnemiteEyeMesh = MagnemiteEye.default;

    magnemiteTextloc = require("../assets/MyMagnemite/texture.jpg");

    magnemiteTexture = TextureHelper.loadTexture(gl, magnemiteTextloc.default);

    loadCubeMap();
}

function checkLoadFunc(){
    numTexturesLoaded++;
    if (numTexturesLoaded >= 6){
        cubeMapTexture = CubeMapHelpers.HandleCubeMap(gl, cubeImages);
    }
}

function checkLoadFunc2(){
    numTexturesLoaded2++;
    if (numTexturesLoaded2 >= 6){
        cubeMapTexture2 = CubeMapHelpers.HandleCubeMap(gl, cubeImages2);
    }
}

function loadCubeMap(){
    cubeImages = {
        posX : CubeMapHelpers.SetupImage(require("../assets/CubeMap/posx.jpg").default, checkLoadFunc),
        negX : CubeMapHelpers.SetupImage(require("../assets/CubeMap/negx.jpg").default, checkLoadFunc),
        posY : CubeMapHelpers.SetupImage(require("../assets/CubeMap/posy.jpg").default, checkLoadFunc),
        negY : CubeMapHelpers.SetupImage(require("../assets/CubeMap/negy.jpg").default, checkLoadFunc),
        posZ : CubeMapHelpers.SetupImage(require("../assets/CubeMap/posz.jpg").default, checkLoadFunc),
        negZ : CubeMapHelpers.SetupImage(require("../assets/CubeMap/negz.jpg").default, checkLoadFunc)
    }

    cubeImages2 = {
        posX : CubeMapHelpers.SetupImage(require("../assets/CubeMap/posx2.jpg").default, checkLoadFunc2),
        negX : CubeMapHelpers.SetupImage(require("../assets/CubeMap/negx2.jpg").default, checkLoadFunc2),
        posY : CubeMapHelpers.SetupImage(require("../assets/CubeMap/posy2.jpg").default, checkLoadFunc2),
        negY : CubeMapHelpers.SetupImage(require("../assets/CubeMap/negy2.jpg").default, checkLoadFunc2),
        posZ : CubeMapHelpers.SetupImage(require("../assets/CubeMap/posz2.jpg").default, checkLoadFunc2),
        negZ : CubeMapHelpers.SetupImage(require("../assets/CubeMap/negz2.jpg").default, checkLoadFunc2)
    }
    //wait until all images are loaded
    //while(numTexturesLoaded < 6){}

    
}


function createInitialObjects() {
    playerObject = myObject.create(myMatrixMath.Make3DTranslationMatrix(0,0,0), myMatrixMath.MakeRotationMatrixAroundY(90), myMatrixMath.MakeIdentityMatrix());

    lightInfo.lightObject = myObject.create(myMatrixMath.Make3DTranslationMatrix(0,0,0), myMatrixMath.MakeIdentityMatrix(), myMatrixMath.Make3DScaleMatrix(lightObjectScale, lightObjectScale, lightObjectScale));
}

function unloadTexture(){
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([85, 115, 135, 0.6]); // opaque blue
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );

    magnemiteTexture = texture;
}

//---------------------------------------------------------------- END INTIALIZATION FUNCTIONS

//---------------------------------------------------------------- END DRAWING HELPER FUNCTIONS


function getNewViewMatrix (viewMatrix) {
    var newviewMatrix = mat4.create();
    
    mat4.set(viewMatrix, newviewMatrix);

    //mat4.inverse(newviewMatrix);

    newviewMatrix[12] = 0;
    newviewMatrix[13] = 0;
    newviewMatrix[14] = 0;
    /*
    newviewMatrix[12] = 0;
    newviewMatrix[13] = 0;
    newviewMatrix[14] = 0;
    newviewMatrix[15] = 1;
    */

    return newviewMatrix;
}

/*
var per, cam, view;

    var aspect = gl.canvas.width / gl.canvas.height;
    mat4.perspective(fieldOfView, aspect, 1, 200, per);

    mat4.lookAt(camPostion, centerOfInterest, upVector, cam);

    view = mat4.inverse(globalViewMatrix)

    var viewDirectionProjectionMatrix = mat4.multiply(globalProjMatrix, view);
    var viewDirectionProjectionInverseMatrix = mat4.inverse(viewDirectionProjectionMatrix);

    gl.uniformMatrix4fv(skyboxUniforms.matrixUniformlocs.viewDirectionProjectionInverseMatrix, false, viewDirectionProjectionInverseMatrix)
*/

function drawSkybox(){
    //disable depth testing
    
    gl.depthFunc(gl.LEQUAL);

    gl.useProgram(skyboxShaderProgram);
    // ... set view and projection matrix

    
    gl.uniformMatrix4fv(skyboxUniforms.matrixUniformlocs.projection, false, globalProjMatrix);
    gl.uniformMatrix4fv(skyboxUniforms.matrixUniformlocs.view, false, getNewViewMatrix(globalViewMatrix));


    gl.bindBuffer(gl.ARRAY_BUFFER, skyboxBuffers.posBuffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE1);   // set texture unit 1 to use 
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMapTexture);    // bind the texture object to the texture unit 
    gl.uniform1i(skyboxUniforms.textureUniformlocs.cubeMap, 1);   // pass the texture unit to the shader

    gl.drawArrays(gl.TRIANGLES, 0, 36);
    
}

function drawNotSkybox() {
    //enable depth testing
    //gl.depthMask(true);
    gl.depthFunc(gl.LESS);

    gl.useProgram(shaderProgram);
    if(drawLightObject)myDrawing.drawMyObject(gl, lightInfo.lightObject.getModelMatrix(), sphereBuffers, sphereMat, 4, uniforms, lightInfo, globalViewMatrix, globalProjMatrix, drawingModeNum);

    //myDrawing.drawOBJObject(gl, playerObject.getModelMatrix(), MagnemiteMesh, magnemiteTexture, cubeMapTexture, textureNumber, uniforms, lightInfo, globalViewMatrix, globalProjMatrix, drawingModeNum);
    myDrawing.drawOBJObject(gl, playerObject.getModelMatrix(), MagnemiteBodyMesh, magnemiteTexture, cubeMapTexture2, textureNumber, uniforms, lightInfo, globalViewMatrix, globalProjMatrix, drawingModeNum);
    
    let hierarchicalEye = myMatrixMath.fourByFourMatixMul(playerObject.getModelMatrix(), eyeObject.getModelMatrix());
    myDrawing.drawOBJObject(gl, hierarchicalEye, MagnemiteEyeMesh, magnemiteTexture, cubeMapTexture2, textureNumber, uniforms, lightInfo, globalViewMatrix, globalProjMatrix, drawingModeNum);
    
    let hierarchicalLM = myMatrixMath.fourByFourMatixMul(playerObject.getModelMatrix(), LeftMagnetObject.getModelMatrix());
    myDrawing.drawOBJObject(gl, hierarchicalLM, MagnemiteLeftMagnetMesh, magnemiteTexture, cubeMapTexture2, textureNumber, uniforms, lightInfo, globalViewMatrix, globalProjMatrix, drawingModeNum);
    
    let hierarchicalERM = myMatrixMath.fourByFourMatixMul(playerObject.getModelMatrix(), RightMagnetObject.getModelMatrix());
    myDrawing.drawOBJObject(gl, hierarchicalERM, MagnemiteRightMagnetMesh, magnemiteTexture, cubeMapTexture2, textureNumber, uniforms, lightInfo, globalViewMatrix, globalProjMatrix, drawingModeNum);
}

var oldTranslationMatrix = null;

function updatePosBasedOnTime(timeInSeconds: number){
    //update rotation of magnets
    LeftMagnetObject.rotationMatrix = myMatrixMath.fourByFourMatixMul(myMatrixMath.Make2DRotationMatrixAroundPoint(amountToRotateMagnets, 0.25, -0.1), LeftMagnetObject.rotationMatrix);
    RightMagnetObject.rotationMatrix = myMatrixMath.fourByFourMatixMul(myMatrixMath.Make2DRotationMatrixAroundPoint(-amountToRotateMagnets, -0.25, -0.1), RightMagnetObject.rotationMatrix);


    //Have player follow a equation for movement
    //x(t) = a * cos(t)
    //y(t) = a * cos^2(t)

    let newX = MagnemiteMovementMultiplier * Math.cos(timeInSeconds);
    let newY = MagnemiteMovementMultiplier * Math.pow(Math.cos(timeInSeconds), 2);

    var newTranslationMatrix = myMatrixMath.Make3DTranslationMatrix(newX, newY, 0.0);
    
    if(oldTranslationMatrix != null){
        
        //add new
        playerObject.translationMatrix = myMatrixMath.fourByFourMatixTranslationAdd(playerObject.translationMatrix, newTranslationMatrix);
        //sub old
        playerObject.translationMatrix = myMatrixMath.fourByFourMatixTranslationSub(playerObject.translationMatrix, oldTranslationMatrix);
        //set new old
        oldTranslationMatrix = newTranslationMatrix;
    } else {
        
        oldTranslationMatrix = newTranslationMatrix;
        playerObject.translationMatrix = oldTranslationMatrix; //myMatrixMath.fourByFourMatixMul(playerObject, myMatrixMath.Make3DTranslationMatrix(newX, newY, 0.0));
    }
    
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// MAIN DRAW METHOD

/**
 * Draws all objects in the scene by calling the helper functions for each shape
 */
function drawScene(time) {
    // convert to seconds
    let timeInSeconds = time * 0.001;

    updatePosBasedOnTime(timeInSeconds)

    gl.clear(gl.COLOR_BUFFER_BIT);

    drawNotSkybox(); 

    if(skyboxEnabled) drawSkybox();
    
    window.requestAnimationFrame(drawScene);
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//-----------------------------------------------------------------------------
// INPUT HELPER FUNCTIONS
//----------------------------------------------------------------

function initInput(){
    document.addEventListener('keydown', onKeyDown);
}

/**
 * Performs all functionality when a key is pressed
 */
function onKeyDown(event) {
    
    switch(event.key){
        case 'P':  //Rotate camera pitch increasing
            console.log(event.key + " pressed - pitch increasing");

            if(globalTransformEnabled){
                globalViewMatrix = mat4.rotate(globalViewMatrix, radiansToRotateCamera, [1, 0, 0]);
            } else{
                globalViewMatrix = mat4.multiply(mat4.rotate(mat4.identity(mat4.create()), radiansToRotateCamera, [1, 0, 0]), globalViewMatrix);
            }

            //drawScene();
            
            break;
        case 'p':  //Rotate camera pitch decreasing
            console.log(event.key + " pressed - pitch decreasing");
            
            if(globalTransformEnabled){
                globalViewMatrix = mat4.rotate(globalViewMatrix, -radiansToRotateCamera, [1, 0, 0]);
            } else{
                globalViewMatrix = mat4.multiply(mat4.rotate(mat4.identity(mat4.create()), -radiansToRotateCamera, [1, 0, 0]), globalViewMatrix);
            }

            //drawScene();
            
            break;
        case 'Y':  //Rotate camera yaw increasing
            console.log(event.key + " pressed - yaw increasing");
            
            if(globalTransformEnabled){
                globalViewMatrix = mat4.rotate(globalViewMatrix, radiansToRotateCamera, [0, 1, 0]);
            } else{
                globalViewMatrix = mat4.multiply(mat4.rotate(mat4.identity(mat4.create()), radiansToRotateCamera, [0, 1, 0]), globalViewMatrix);
            }

            //drawScene();

            break;
        case 'y':  //Rotate camera yaw decreasing
            console.log(event.key + " pressed - yaw decreasing");
            
            if(globalTransformEnabled){
                globalViewMatrix = mat4.rotate(globalViewMatrix, -radiansToRotateCamera, [0, 1, 0]);
            } else{
                globalViewMatrix = mat4.multiply(mat4.rotate(mat4.identity(mat4.create()), -radiansToRotateCamera, [0, 1, 0]), globalViewMatrix);
            }

            //drawScene();

            break;
        case 'R':  //Rotate camera roll increasing
            console.log(event.key + " pressed - roll increasing");
            
            if(globalTransformEnabled){
                globalViewMatrix = mat4.rotate(globalViewMatrix, radiansToRotateCamera, [0, 0, 1]);
            } else{
                globalViewMatrix = mat4.multiply(mat4.rotate(mat4.identity(mat4.create()), radiansToRotateCamera, [0, 0, 1]), globalViewMatrix);
            }

            //drawScene();

            break;
        case 'r':  //Rotate camera roll decreasing
            console.log(event.key + " pressed - roll decreasing");
            
            if(globalTransformEnabled){
                globalViewMatrix = mat4.rotate(globalViewMatrix, -radiansToRotateCamera, [0, 0, 1]);
            } else{
                globalViewMatrix = mat4.multiply(mat4.rotate(mat4.identity(mat4.create()), -radiansToRotateCamera, [0, 0, 1]), globalViewMatrix);
            }

            //drawScene();

            break;
        case 'w':  //move object forward
            console.log(event.key + " pressed - moving object forward");

            playerObject.translationMatrix = myMatrixMath.fourByFourMatixMul(playerObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(0, 0, -distanceToMovePlayer));
            //drawScene();
            break;
        case 'a':  //move object left
            console.log(event.key + " pressed - moving object left");

            playerObject.translationMatrix = myMatrixMath.fourByFourMatixMul(playerObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(-distanceToMovePlayer, 0, 0));
            //drawScene();
            break;
        case 's':  //move object backward
            console.log(event.key + " pressed - moving object backward");

            playerObject.translationMatrix = myMatrixMath.fourByFourMatixMul(playerObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(0, 0, distanceToMovePlayer));
            //drawScene();
            break;
        case 'd':  //move object right
            console.log(event.key + " pressed - moving object right");

            playerObject.translationMatrix = myMatrixMath.fourByFourMatixMul(playerObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(distanceToMovePlayer, 0, 0));
            //drawScene();
            break;
        case 'G':  //change rotation to Global
            console.log(event.key + " pressed - Global camera rotation");

            globalTransformEnabled = true;
            break;
        case 'g':  //change rotation to local
            console.log(event.key + " pressed - local camera rotation");

            globalTransformEnabled = false;
            break;
        case 'ArrowUp':  
            console.log(event.key + " pressed - rotate mouth clockwise");

            //uppperMouthRotationMatrix = MyMatrixMath.fourByFourMatixMul(MyMatrixMath.Make2DRotationMatrixAroundPoint(degreesToRotateMouth, mouthRotationXPos, mouthRotationYPos), uppperMouthRotationMatrix );
            //drawScene();
            break;
        case 'ArrowDown':  
            console.log(event.key + " pressed - rotate mouth counter-clockwise");

            //uppperMouthRotationMatrix = MyMatrixMath.fourByFourMatixMul(MyMatrixMath.Make2DRotationMatrixAroundPoint(-degreesToRotateMouth, mouthRotationXPos, mouthRotationYPos), uppperMouthRotationMatrix);
            //drawScene();
            
            console.log("new light pos = " + lightInfo.pos());
            break;
        case '1':  
            console.log(event.key + " pressed - move light UP globally");

            lightInfo.lightObject.translationMatrix = myMatrixMath.fourByFourMatixMul(lightInfo.lightObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(0, distanceToMovelight, 0));
            
            //console.log("new light pos = " + light_pos);
            //drawScene();
            break;
        case '2':  
            console.log(event.key + " pressed - move light DOWN globally");

            lightInfo.lightObject.translationMatrix = myMatrixMath.fourByFourMatixMul(lightInfo.lightObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(0, -distanceToMovelight, 0));
            
            //console.log("new light pos = " + light_pos);
            //drawScene();
            break;
        case '3':  
            console.log(event.key + " pressed - move light LEFT globally");

            lightInfo.lightObject.translationMatrix = myMatrixMath.fourByFourMatixMul(lightInfo.lightObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(-distanceToMovelight,0, 0));
            
            //console.log("new light pos = " + light_pos);
            //drawScene();
            break;
        case '4':  
            console.log(event.key + " pressed - move light RIGHT globally");

            lightInfo.lightObject.translationMatrix = myMatrixMath.fourByFourMatixMul(lightInfo.lightObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(distanceToMovelight, 0, 0));
            
            //console.log("new light pos = " + light_pos);
            //drawScene();
            break;
        case '5':  
            console.log(event.key + " pressed - move light FORWARD globally");

            lightInfo.lightObject.translationMatrix = myMatrixMath.fourByFourMatixMul(lightInfo.lightObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(0, 0, -distanceToMovelight));
            
            //console.log("new light pos = " + light_pos);
            //drawScene();
            break;
        case '6':  
            console.log(event.key + " pressed - move light BACKWARD globally");

            lightInfo.lightObject.translationMatrix = myMatrixMath.fourByFourMatixMul(lightInfo.lightObject.translationMatrix, myMatrixMath.Make3DTranslationMatrix(0, 0, distanceToMovelight));

            //console.log("new light pos = " + light_pos);
            //drawScene();
            break;
        case 'L':
            console.log(event.key + " pressed - enable Light object");

            
            drawLightObject = true;
            break;
        case 'l':
            console.log(event.key + " pressed - disable Light object");

            drawLightObject = false;
            break;
        default:
            console.log(event.key + " pressed - no function")
    }
}

//---------------------------------------------------------------- END INPUT HELPER FUNCTIONS

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// MAIN METHOD CALL
window.requestAnimationFrame(drawScene);

main();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * Make sure the WebGL context has been initialized, then clear the canvas.
 */
function main() {
    //intialize the intput
    initInput();

    // Validate the rendering context.
    if (gl === null) {
        console.error("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }

    // Load external objects 
    loadInExternalObjects();

    // create shader program for skybox ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    createSkyboxShaderProgram();

    //get all uniform locations
    skyboxUniforms = getSkyBoxUniforms(gl, skyboxShaderProgram);

    gl.enableVertexAttribArray(0);

    // skybox shader end ~~~~~~~~~~~~~~~~~~~~~~~~~~

    // create main shader program object ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    createShaderProgram();

    //get all uniform locations
    uniforms = getUniforms(gl, shaderProgram);

    // Enable the attributes
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);

    // main shader program end ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    gl.enable(gl.DEPTH_TEST);

    // Create the buffers
    initBuffers();
    
    //setup all the global matrices
    setupMatrices();

    //Creates the intial state of objects in the scene
    createInitialObjects();

    // Clear the canvas.
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log("Hello, WebGL!");

    //drawScene(0);

    setUpListeners();
}

export function setTextureToDraw(textNum){
    textureNumber = textNum;
    console.log(textureNumber);
}

function setDrawingMode(modeNum){
    drawingModeNum = modeNum;
}

function setSkyBoxEnabled(val:boolean){
    skyboxEnabled = val;
}

function setUpListeners() {
    document.getElementById("TextureButton0").addEventListener("click", function(){setTextureToDraw(0);})//drawScene();})

    document.getElementById("TextureButton1").addEventListener("click", function(){setTextureToDraw(2);})//drawScene()})
 
    document.getElementById("TextureButton2").addEventListener("click", function(){setTextureToDraw(1);})//drawScene()})

    document.getElementById("TextureButton3").addEventListener("click", function(){setTextureToDraw(3);})//drawScene()})

    document.getElementById("DrawingModeButton0").addEventListener("click", function(){setDrawingMode(1);})//drawScene()})

    document.getElementById("DrawingModeButton1").addEventListener("click", function(){setDrawingMode(0);})//drawScene()})

    document.getElementById("SkyBoxModeButton0").addEventListener("click", function(){setSkyBoxEnabled(true);})//drawScene()})

    document.getElementById("SkyBoxModeButton1").addEventListener("click", function(){setSkyBoxEnabled(false);})//drawScene()})
}

