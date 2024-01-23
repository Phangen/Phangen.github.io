
export function getUniforms(gl, shaderProgram) {
    
    var uniforms = {
        matrixUniformlocs : {
            model : gl.getUniformLocation(shaderProgram, "modelMatrix"),
            view : gl.getUniformLocation(shaderProgram, "viewMatrix"),
            projection : gl.getUniformLocation(shaderProgram, "projMatrix"),
            normal: gl.getUniformLocation(shaderProgram, "normalMatrix"),
            eyeToWorldMatrix : gl.getUniformLocation(shaderProgram, "eyeToWorldMatrix"),
        },
        
        materialUniformlocs : {
            diffuse : gl.getUniformLocation(shaderProgram, "diffuse_coef"),
            ambient : gl.getUniformLocation(shaderProgram, "ambient_coef"),
            specular : gl.getUniformLocation(shaderProgram, "specular_coef"),
            shininess : gl.getUniformLocation(shaderProgram, "mat_shininess")
        },
        
        lightUniformlocs : {
            ambient : gl.getUniformLocation(shaderProgram, "light_ambient"),
            diffuse : gl.getUniformLocation(shaderProgram, "light_diffuse"),
            specular : gl.getUniformLocation(shaderProgram, "light_specular"),
            position : gl.getUniformLocation(shaderProgram, "light_pos")
        },
        
        textureUniformlocs : {
            sampler2D : gl.getUniformLocation(shaderProgram, "tex"),
            textureNumber : gl.getUniformLocation(shaderProgram, "texture_number"),
            cubeMap : gl.getUniformLocation(shaderProgram, "cubeMap")
        }

    }

    return uniforms;
}

export function getSkyBoxUniforms(gl, skyBoxShaderProgram) {
    
    var uniforms = {
        matrixUniformlocs : {
            view : gl.getUniformLocation(skyBoxShaderProgram, "viewMatrix"),
            projection : gl.getUniformLocation(skyBoxShaderProgram, "projMatrix"),
            viewDirectionProjectionInverseMatrix : gl.getUniformLocation(skyBoxShaderProgram, "viewDirectionProjectionInverseMatrix")

        },
        
        textureUniformlocs : {
            textureNumber : gl.getUniformLocation(skyBoxShaderProgram, "texture_number"),
            cubeMap : gl.getUniformLocation(skyBoxShaderProgram, "cubeMap")
        }

    }

    return uniforms;
}

export function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

export function createBuffer(gl, data, dataLength, isElementBuffer) {
    let buffer = gl.createBuffer();

    if (!isElementBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    }
    else {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);
    }
    buffer.itemSize = dataLength;
    buffer.numItems = data.length/dataLength;

    return buffer;
}