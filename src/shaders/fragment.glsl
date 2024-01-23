#version 300 es
// fragment.glsl

precision highp float;

//Matrices
uniform mat4 modelMatrix; 
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix;
uniform mat4 eyeToWorldMatrix; 

//material uniforms
uniform vec4 ambient_coef;
uniform vec4 diffuse_coef;
uniform vec4 specular_coef;
uniform float mat_shininess; 

//light source uniforms
uniform vec4 light_ambient; 
uniform vec4 light_diffuse; 
uniform vec4 light_specular;
uniform vec4 light_pos;

//texture things
uniform sampler2D tex;
uniform int texture_number;
uniform samplerCube cubeMap;

in vec4 v_color;
in vec3 v_normal;
in vec4 eye_pos;
in vec4 v_texture;

out vec4 FragColor;

in vec3 cubeMap_normal;
in vec3 cubeMap_pos;

void main(void)
{
    vec3 view_vector, ref; 
    vec4 env_color = vec4(1,0,0,1);
    
    if (texture_number == 1) { // Cube Map ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        /*
        vec3 I = normalize(cubeMap_pos - vec3(eye_pos.x, eye_pos.y, eye_pos.z));
        vec3 R = reflect(I, normalize(cubeMap_normal));
        FragColor = vec4(texture(cubeMap, normalize(vec3(R.x, R.y, R.z))).rgb, 1.0);
        */
        ///*
        view_vector = normalize(vec3(vec4(0,0,0,1)-eye_pos));
        ref = normalize(reflect(-view_vector, v_normal));  // in eye space
	    ref = vec3(eyeToWorldMatrix*vec4(ref,0));   // convert to world space
        env_color = texture(cubeMap, vec3(ref.x, ref.y, ref.z));
        FragColor = env_color;
        //*/
    } 
    else if(texture_number == 2) { // Per Fragment texture shading  with lighting ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // /* 
        vec4 light_pos_in_eye = light_pos;      

        // // light vector L = l-p 
        vec3 light_vector = normalize(vec3(light_pos_in_eye - eye_pos)); 

        // // eye vector V = e-p, where e is (0,0,0) 
        vec3 eye_vector = normalize(-vec3(eye_pos));
        
        vec4 ambient = ambient_coef * light_ambient;

        float ndotl = max(dot(v_normal, light_vector), 0.0); 

        vec4 diffuse = diffuse_coef * light_diffuse * ndotl;

        
        vec3 R= normalize(vec3(reflect(-light_vector, v_normal))); 
    
        float rdotv = max(dot(R, eye_vector), 0.0);

        vec4 specular;  
        if (ndotl>0.0) 
            specular = specular_coef * light_specular * pow(rdotv, mat_shininess); 
        else
            specular = vec4(0,0,0,1);

        vec4 texColor = texture(tex, v_texture.st);

        FragColor = texColor + ambient + diffuse + specular;
        // */
    } else if(texture_number == 3) { //Mix shading
        vec4 light_pos_in_eye = light_pos;      

        // // light vector L = l-p 
        vec3 light_vector = normalize(vec3(light_pos_in_eye - eye_pos)); 

        // // eye vector V = e-p, where e is (0,0,0) 
        vec3 eye_vector = normalize(-vec3(eye_pos));
        
        vec4 ambient = ambient_coef * light_ambient;

        float ndotl = max(dot(v_normal, light_vector), 0.0); 

        vec4 diffuse = diffuse_coef * light_diffuse * ndotl;

        
        vec3 R= normalize(vec3(reflect(-light_vector, v_normal))); 
    
        float rdotv = max(dot(R, eye_vector), 0.0);

        vec4 specular;  
        if (ndotl>0.0) 
            specular = specular_coef * light_specular * pow(rdotv, mat_shininess); 
        else
            specular = vec4(0,0,0,1);

        vec4 texColor = texture(tex, v_texture.st);

        vec4 FinalLightingColor = ambient + diffuse + specular;

        view_vector = normalize(vec3(vec4(0,0,0,1)-eye_pos));
        ref = normalize(reflect(-view_vector, v_normal));;  // in eye space
	    ref = vec3(eyeToWorldMatrix*vec4(ref,0));   // convert to world space
        env_color = texture(cubeMap, ref);
        FragColor = mix(env_color, FinalLightingColor, texColor);
    }
    else if(texture_number == 4) { //No texture light shading
        // /* 
        vec4 light_pos_in_eye = light_pos;      

        // // light vector L = l-p 
        vec3 light_vector = normalize(vec3(light_pos_in_eye - eye_pos)); 

        // // eye vector V = e-p, where e is (0,0,0) 
        vec3 eye_vector = normalize(-vec3(eye_pos));
        
        vec4 ambient = ambient_coef * light_ambient;

        float ndotl = max(dot(v_normal, light_vector), 0.0); 

        vec4 diffuse = diffuse_coef * light_diffuse * ndotl;

        
        vec3 R= normalize(vec3(reflect(-light_vector, v_normal))); 
    
        float rdotv = max(dot(R, eye_vector), 0.0);

        vec4 specular;  
        if (ndotl>0.0) 
            specular = specular_coef * light_specular * pow(rdotv, mat_shininess); 
        else
            specular = vec4(0,0,0,1);

        FragColor = ambient + diffuse + specular;
        // */
    }
    else {
        FragColor = v_color;
    }

    
}