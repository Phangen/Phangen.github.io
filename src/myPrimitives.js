

//////////////////////////////////////////////////////.........
//
//  Methods to create primitives to be used in the main Lab document    
//

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Primitive creation Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export var myPrimitives = {};

/**
 * returns an array of all vertices needed to draw a cube
 * 
 * @param {float} size - length of one side of the cube
 *  
 * @param {vec3} postion - the center postion of the cube 
 */
myPrimitives.createCube = function(size, postion, color){
    var squareHalf = size/2
    var vertexArray = [
        postion[0] + squareHalf, postion[1] + squareHalf, postion[2] + squareHalf,
        postion[0] - squareHalf, postion[1] + squareHalf, postion[2] + squareHalf,
        postion[0] + squareHalf, postion[1] - squareHalf, postion[2] + squareHalf,
        postion[0] - squareHalf, postion[1] - squareHalf, postion[2] + squareHalf,

        postion[0] + squareHalf, postion[1] + squareHalf, postion[2] - squareHalf,
        postion[0] - squareHalf, postion[1] + squareHalf, postion[2] - squareHalf,
        postion[0] + squareHalf, postion[1] - squareHalf, postion[2] - squareHalf,
        postion[0] - squareHalf, postion[1] - squareHalf, postion[2] - squareHalf,
    ]

    if(color[0] + 0.2 > 1 || color[1] + 0.2 > 1 || color[2] + 0.2 > 1 ||
        color[0] - 0.2 < 0 || color[1] - 0.2 < 0 || color[2] - 0.2 < 0){
            console.log("Cube color - color passed is not a valid color");
            return null;
        }

    var colorVertices = [
        color[0] + 0.2, color[1], color[2],
        color[0] + 0.2, color[1], color[2], 
        color[0], color[1] + 0.2, color[2], 
        color[0], color[1] + 0.2, color[2], 

        color[0], color[1], color[2] + 0.2,
        color[0], color[1], color[2] + 0.2, 
        color[0] - 0.2, color[1], color[2], 
        color[0] - 0.2, color[1], color[2]
    ]

    var indexArr = [0,1,3, 
        0,3,2, //front face 
        
        4,7,5,
        4,6,7, //back face 
        
        0,2,4, 
        2,6,4, //right face 
        
        1,5,3,
        3,5,7, //left face
        
        1,4,5, 
        0,4,1, //top face 
        
        3,7,6,
        2,3,6 //bottom face 
        ];

    return {
        vertices : vertexArray,
        colors: colorVertices,
        indices :indexArr
    };
}

/**
 * returns an array of all vertices needed to draw a cube
 * 
 * @param {float} size - length of one side of the cube
 *  
 * @param {vec3} postion - the center postion of the cube 
 */
myPrimitives.createSkyboxCube = function(){
    var skyboxVertices = [          
        -10.0,  10.0, -10.0,
        -10.0, -10.0, -10.0,
         10.0, -10.0, -10.0,
         10.0, -10.0, -10.0,
         10.0,  10.0, -10.0,
        -10.0,  10.0, -10.0,
    
        -10.0, -10.0,  10.0,
        -10.0, -10.0, -10.0,
        -10.0,  10.0, -10.0,
        -10.0,  10.0, -10.0,
        -10.0,  10.0,  10.0,
        -10.0, -10.0,  10.0,
    
         10.0, -10.0, -10.0,
         10.0, -10.0,  10.0,
         10.0,  10.0,  10.0,
         10.0,  10.0,  10.0,
         10.0,  10.0, -10.0,
         10.0, -10.0, -10.0,
    
        -10.0, -10.0,  10.0,
        -10.0,  10.0,  10.0,
         10.0,  10.0,  10.0,
         10.0,  10.0,  10.0,
         10.0, -10.0,  10.0,
        -10.0, -10.0,  10.0,
    
        -10.0,  10.0, -10.0,
         10.0,  10.0, -10.0,
         10.0,  10.0,  10.0,
         10.0,  10.0,  10.0,
        -10.0,  10.0,  10.0,
        -10.0,  10.0, -10.0,
    
        -10.0, -10.0, -10.0,
        -10.0, -10.0,  10.0,
         10.0, -10.0, -10.0,
         10.0, -10.0, -10.0,
        -10.0, -10.0,  10.0,
         10.0, -10.0,  10.0
    ];

    return {
        vertices : skyboxVertices,
        colors: null,
        indices : null
    };
}

function getUnitCircleVertices(numberOfSlices){
    var sectorStep = 2 * Math.PI/numberOfSlices;
    var unitCircleVectices = [];
    for (let i = 0; i < numberOfSlices; i++) {
        var sectorAngle = i * sectorStep;
        unitCircleVectices = unitCircleVectices.concat([Math.cos(sectorAngle), Math.sin(sectorAngle), 0]);
    }
    return unitCircleVectices;
}

//Builds all triangles between layers built in stacks and slices
function getIndicesBetweenLayersCly(numberOfSlices, numberOfStacks){
    var indexArr = [];
    if(numberOfSlices < 3){
        console.error("numberOfSlices to small")
        return null;
    }

    for(let i = 0; i < numberOfStacks; i++){
        indexArr = indexArr.concat([i*numberOfSlices, i*numberOfSlices + numberOfSlices, i*numberOfSlices+ 1, 
            i*numberOfSlices, + i*numberOfSlices + 2*numberOfSlices - 1, i*numberOfSlices + numberOfSlices]); //0, 4, 1 and 0, 7, 4
        for(let j = i*numberOfSlices + 1; j < i*numberOfSlices + numberOfSlices; j++){
            indexArr = indexArr.concat([j, j + numberOfSlices, j + 1, j, j + numberOfSlices - 1, j + numberOfSlices]); //1, 5, 2 and 1, 5, 4
        }
        indexArr = indexArr.concat([i*numberOfSlices + numberOfSlices-1, i*numberOfSlices + 2*numberOfSlices -1, i*numberOfSlices,
            i*numberOfSlices + numberOfSlices-1, i*numberOfSlices + 2*numberOfSlices -1, i*numberOfSlices]); //3, 6, 7 and 3, 7 ,0
    }
    return indexArr;
}

function getIndicesBetweenLayersSphere(numberOfSlices, numberOfStacks){
    var indexArr = [];
    
    for(let i = 0; i < numberOfStacks; i++){
        
        var startingIndexForStack = i * (numberOfSlices + 1);
        var startingIndexForNextStack = startingIndexForStack + numberOfSlices +1;

        for(let j = 0; j < numberOfSlices; j++, startingIndexForNextStack++, startingIndexForStack++){
            if(i != 0){
                indexArr = indexArr.concat([startingIndexForStack, startingIndexForNextStack, startingIndexForStack +1]);
            }
            if(i != numberOfStacks -1){
                indexArr = indexArr.concat([startingIndexForStack + 1, startingIndexForNextStack, startingIndexForNextStack + 1]);
            }
        }
        
    }
    return indexArr;
}


function getIndicesForCircles(numberOfSlices, numberOfStacks, indexOfTopCenter, indexOfBottomCenter){
    var indexArr = [];
    
    

    for(let i = 0; i < numberOfSlices -1; i++){
        indexArr = indexArr.concat([i, i+1, indexOfBottomCenter]);  
    }

    indexArr = indexArr.concat([numberOfSlices -1, 0, indexOfBottomCenter]);


    
    for(let i = numberOfStacks * numberOfSlices; i < (numberOfStacks + 1) * numberOfSlices -1; i++){
        indexArr = indexArr.concat([i, indexOfTopCenter, i+1]); 
    }
    indexArr = indexArr.concat([(numberOfStacks + 1) * numberOfSlices -1,  indexOfTopCenter, numberOfStacks * numberOfSlices]);
    

    return indexArr;
}

/**
 * returns an array of all vertices needed to draw a cylinder
 * 
 * @param {float} size - size of the 
 *  
 * @param {vec3} postion - the center postion of the cube 
 */
myPrimitives.createCylinder = function(baseRadius, topRadius, height, numberOfSlices, numberOfStacks, postion, color){
    var ucVertices = getUnitCircleVertices(numberOfSlices);
    
    //console.log(ucVertices);

    var cylinderVertices = [];
    var colorArray = [];

    for (let i = 0; i <= numberOfStacks; i++){
        var curHeight = -(height * 0.5) + i / numberOfStacks * height;      // vertex position z
        var radius = baseRadius + i / numberOfStacks * (topRadius - baseRadius);     // lerp

        for (let j = 0; j < ucVertices.length; j+=3){
            cylinderVertices = cylinderVertices.concat([radius*ucVertices[j], radius*ucVertices[j+1], curHeight + ucVertices[j+2]]);
            colorArray = colorArray.concat([color[0] + 0.1 * i, color[1] + 0.1 * i, color[2] + 0.1 * i]);
            
        }
    }
    //do all indices for just the sides of cylinder
    var indexArr = [] 
    
    indexArr = getIndicesBetweenLayersCly(numberOfSlices, numberOfStacks)
    
    //add in vertices for center of circles
    //top circle center
    var indexOfTopCenter = cylinderVertices.length/3;
    cylinderVertices = cylinderVertices.concat([0, 0, height *0.5]);
    colorArray = colorArray.concat([color[0] + 0.1 * numberOfStacks, color[1] + 0.1 * numberOfStacks, color[2] + 0.1 * numberOfStacks]);


    //bottom  circle center
    var indexOfBottomCenter = cylinderVertices.length/3;
    cylinderVertices = cylinderVertices.concat([0, 0, -height*0.5]);
    colorArray = colorArray.concat([color[0], color[1], color[2]]);
    //colorArray = colorArray.concat([color[0] + 0.1 * numberOfStacks, color[1] + 0.1 * numberOfStacks, color[2] + 0.1 * numberOfStacks]);

    //add indices for circle
    indexArr = indexArr.concat(getIndicesForCircles(numberOfSlices, numberOfStacks, indexOfTopCenter, indexOfBottomCenter))

    return {
        vertices : cylinderVertices,
        colors: colorArray,
        indices : indexArr
    };
}

/**
 * returns an array of all vertices needed to draw a sphere
 * 
 * @param {float} radius - size of the 
 *  
 * @param {vec3} postion - the center postion of the cube 
 */
myPrimitives.createSphere = function(radius, numberOfSlices, numberOfStacks, position, color){
    
    //console.log(ucVertices);

    var sphereVertices = [];
    var colorArray = [];
    var indexArr = [];

    var sliceStep = 2 * Math.PI/numberOfSlices;
    var stackStep = Math.PI /numberOfStacks;

    var index = 0;

    for (let i = 0; i <= numberOfStacks; i++){
        var stackAngle = Math.PI /2 - i * stackStep;
        
        var xyForStack = radius * Math.cos(stackAngle); 
        var zForStack = radius * Math.sin(stackAngle);

        for (let j = 0; j <= numberOfSlices; j++){
            var sliceAngle = sliceStep * j;

            sphereVertices = sphereVertices.concat([xyForStack*Math.cos(sliceAngle), xyForStack*Math.sin(sliceAngle), zForStack]);
            colorArray = colorArray.concat([color[0] + 0.05 * i, color[1] + 0.05 * i, color[2] + 0.05 * i]);
            indexArr = indexArr.concat([index]);
            index++;
        }
    }
    //do all indices for just the between stack of sphere
    
    
    indexArr = getIndicesBetweenLayersSphere(numberOfSlices, numberOfStacks)
    
    return {
        vertices : sphereVertices,
        colors: colorArray,
        indices : indexArr
    };
    
}

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END Primitive Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



/**
 * Generates an array of color data for each vertex in @vertices where each data point is the color defined by @color
 * 
 */
myPrimitives.generateColorData = function(vertices, vertexSize, color){
    var colorArray = [];
    
    for (let i = 0; i < vertices.length; i+=vertexSize) {
        colorArray = colorArray.concat([color[0], color[1], color[2], color[3]]);
    }

    return colorArray;
}

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ END Primitive Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

