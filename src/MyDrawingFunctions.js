import {mat4} from './glMatrix';

export var myDrawing = {};

//-----------------------------------------------------------------------------
// DRAWING HELPER FUNCTIONS
//----------------------------------------------------------------

function setMatrixUniforms(gl, modelMatrix, viewMatrix, projectionMatrix, matrixUniformlocs) {

    gl.uniformMatrix4fv(matrixUniformlocs.model, false, modelMatrix);

    gl.uniformMatrix4fv(matrixUniformlocs.projection, false, projectionMatrix);

    gl.uniformMatrix4fv(matrixUniformlocs.view, false, viewMatrix);
    
    //SET UP NORMAL Matrix

    var modelView = mat4.multiply(mat4.create(viewMatrix), mat4.create(modelMatrix));
    var normalMatrix = mat4.inverse(modelView);
    var normalMatrix = mat4.transpose(normalMatrix);

    gl.uniformMatrix4fv(matrixUniformlocs.normal, false, normalMatrix);

    var viewToWorldMatrix = mat4.create();

    mat4.identity(viewToWorldMatrix);
    viewToWorldMatrix = mat4.multiply(viewToWorldMatrix, viewMatrix);
    //viewToWorldMatrix = mat4.inverse(viewToWorldMatrix);     
    viewToWorldMatrix = mat4.transpose(viewToWorldMatrix);
    
    gl.uniformMatrix4fv(matrixUniformlocs.eyeToWorldMatrix, false, viewToWorldMatrix);
}

function setMatUniformsMesh(gl, meshToSet, materialUniformlocs) {

    var meshMaterial = meshToSet.materialsByIndex[0];

    gl.uniform4fv(materialUniformlocs.ambient, [meshMaterial.ambient[0], meshMaterial.ambient[1], meshMaterial.ambient[2], 1]);
    
    gl.uniform4fv(materialUniformlocs.diffuse, [meshMaterial.diffuse[0], meshMaterial.diffuse[1], meshMaterial.diffuse[2], 1]);

    gl.uniform4fv(materialUniformlocs.specular, [meshMaterial.specular[0], meshMaterial.specular[1], meshMaterial.specular[2], 1]);

    gl.uniform1f(materialUniformlocs.shininess, meshMaterial.specularExponent);
}

function setMatUniforms(gl, myMat, materialUniformlocs) {

    gl.uniform4fv(materialUniformlocs.ambient, myMat.ambient);
    
    gl.uniform4fv(materialUniformlocs.diffuse, myMat.diffuse);

    gl.uniform4fv(materialUniformlocs.specular, myMat.specular);

    gl.uniform1f(materialUniformlocs.shininess, myMat.shininess);
}

function setMatUniformsLight(gl, lightUniformlocs, light) {
    gl.uniform4fv(lightUniformlocs.ambient, light.ambient);
    
    gl.uniform4fv(lightUniformlocs.diffuse, light.diffuse);

    gl.uniform4fv(lightUniformlocs.specular, light.specular);

    gl.uniform4fv(lightUniformlocs.position, light.pos());
}

function setTexture(gl, textureToSet, cubeMapText, textureUniformlocs) {
    
    gl.activeTexture(gl.TEXTURE1);   // set texture unit 1 to use 
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMapText);    // bind the texture object to the texture unit 
    gl.uniform1i(textureUniformlocs.cubeMap, 1);   // pass the texture unit to the shader
    
    gl.activeTexture(gl.TEXTURE0);   // set texture unit 0 to use 
	gl.bindTexture(gl.TEXTURE_2D, textureToSet);    // bind the texture object to the texture unit 
    gl.uniform1i(textureUniformlocs.sampler2D, 0);   // pass the texture unit to the shader
}

/**
 * Draws an object given the buffer for the kind of object to draw. and the model matrix of that object.
 */
myDrawing.drawMyObject = function(gl, modelMatrix, buffers, myMat, textureNumber, uniforms, lightInfo, globalViewMatrix, globalProjMatrix, drawingMode) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.posBuffer);
    gl.vertexAttribPointer(0, buffers.posBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normalBuffer);
    gl.vertexAttribPointer(1, buffers.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);
    
    //set uniforms
    setMatrixUniforms(gl, modelMatrix, globalViewMatrix, globalProjMatrix, uniforms.matrixUniformlocs);
    setMatUniforms(gl, myMat, uniforms.materialUniformlocs);
    setMatUniformsLight(gl, uniforms.lightUniformlocs, lightInfo);
    gl.uniform1i(uniforms.textureUniformlocs.textureNumber, textureNumber); 

    if (drawingMode == 1) { gl.drawArrays(gl.LINE_LOOP, 0, buffers.posBuffer.numItems); }
    else {gl.drawElements(gl.TRIANGLES, buffers.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0); }
}

/**
 * Draws an object given the buffer for the kind of object to draw. and the model matrix of that object.
 */
myDrawing.drawOBJObject = function (gl, modelMatrix, meshToDraw, textureToSet, cubeMapText, textureNumber, uniforms, lightInfo, globalViewMatrix, globalProjMatrix, drawingMode) {    
    gl.bindBuffer(gl.ARRAY_BUFFER, meshToDraw.vertexBuffer);
    gl.vertexAttribPointer(0, meshToDraw.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, meshToDraw.normalBuffer);
    gl.vertexAttribPointer(1, meshToDraw.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, meshToDraw.textureBuffer);
    gl.vertexAttribPointer(2, meshToDraw.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshToDraw.indexBuffer);
    
    //set uniforms
    setMatrixUniforms(gl, modelMatrix, globalViewMatrix, globalProjMatrix, uniforms.matrixUniformlocs);
    setMatUniformsMesh(gl, meshToDraw, uniforms.materialUniformlocs);
    setMatUniformsLight(gl, uniforms.lightUniformlocs, lightInfo);
    gl.uniform1i(uniforms.textureUniformlocs.textureNumber, textureNumber); 

    setTexture(gl, textureToSet, cubeMapText, uniforms.textureUniformlocs);

    if (drawingMode == 1) { gl.drawArrays(gl.LINE_LOOP, 0, meshToDraw.vertexBuffer.numItems); }
    else { gl.drawElements(gl.TRIANGLES, meshToDraw.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0); }
}
