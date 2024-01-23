
export var myMatrixMath = {};

myMatrixMath.MakeIdentityMatrix = function(){
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ])
}

myMatrixMath.MakeProjectionMatrix = function(fovy, aspect, N, F){
    var f = 1/Math.tan(fovy/2);
    return new Float32Array([
        f/aspect, 0.0, 0.0, 0.0,
        0.0, f, 0.0, 0.0,
        0.0, 0.0, -1 * ((F+N)/(F-N)), -1,
        0.0, 0.0, -1 * ((2*F*N)/(F-N)), 0.0
    ])
}

myMatrixMath.Make2DRotationMatrix = function(theta){
    var rad = theta * Math.PI /180.0;
    return new Float32Array([
        Math.cos(rad), Math.sin(rad), 0.0, 0.0,
        -Math.sin(rad), Math.cos(rad), 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ])
}

myMatrixMath.MakeRotationMatrixAroundY = function(theta){
    var rad = theta * Math.PI /180.0;
    return new Float32Array([
        Math.cos(rad), 0.0, -Math.sin(rad), 0.0,
        0.0, 1.0, 0.0, 0.0,
        Math.sin(rad), 0.0, Math.cos(rad), 0.0,
        0.0, 0.0, 0.0 , 1.0
    ])
}

myMatrixMath.MakeRotationMatrixAroundX = function(theta){
    var rad = theta * Math.PI /180.0;
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, Math.cos(rad), Math.sin(rad), 0.0,
        0.0, -Math.sin(rad), Math.cos(rad), 0.0,
        0.0, 0.0, 0.0 , 1.0
    ])
}

myMatrixMath.Make2DRotationMatrixAroundPoint = function(theta, xPos, yPos){
    return myMatrixMath.fourByFourMatixMul(myMatrixMath.fourByFourMatixMul(myMatrixMath.Make3DTranslationMatrix(xPos, yPos, 0),myMatrixMath.Make2DRotationMatrix(theta)), myMatrixMath.Make3DTranslationMatrix(-xPos, -yPos, 0))
}

myMatrixMath.Make3DTranslationMatrix = function(changeInPosX, changeInPosY, changeInPosZ){
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        changeInPosX, changeInPosY, changeInPosZ, 1.0
    ])
}

myMatrixMath.Make3DScaleMatrix = function(scaleX, scaleY, scaleZ){
    return new Float32Array([
        scaleX, 0.0, 0.0, 0.0,
        0.0, scaleY, 0.0, 0.0,
        0.0, 0.0, scaleZ, 0.0,
        0.0, 0.0, 0.0, 1.0
    ])
}

myMatrixMath.fourByFourMatixMul = function(matrixA, matrixB){
    var multi = new Float32Array(16);
    var postionToAdd = 0;
    for (let i = 0; i < 16; i += 4) {
        for (let q = 0; q < 4; q++) {
            var currentSum = 0.0;
            for (let j = q, k = i; j < 16 && k < 16; j += 4, k++) {
                currentSum += matrixA[j] * matrixB[k];
            }
            multi[postionToAdd] = currentSum; 
            postionToAdd++;
        }
    }

    return multi;
}

myMatrixMath.fourByFourMatixTranslationAdd = function(matrixA, matrixB){
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        matrixA[12] + matrixB[12], matrixA[13] + matrixB[13], matrixA[14] + matrixB[14], 1.0
    ])
}

myMatrixMath.fourByFourMatixTranslationSub = function(matrixA, matrixB){
    return new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        matrixA[12] - matrixB[12], matrixA[13] - matrixB[13], matrixA[14] - matrixB[14], 1.0
    ])
}