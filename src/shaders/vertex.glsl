#version 300 es
// vertex.glsl

precision highp float;

layout(location = 0) in vec3 a_position;
//layout(location = 1) in vec4 a_color;
layout(location = 1) in vec3 a_VertexNormal;

layout(location = 2) in vec2 a_TextCoord;

//Matrices
uniform mat4 modelMatrix; 
uniform mat4 viewMatrix;
uniform mat4 projMatrix;
uniform mat4 normalMatrix; 

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
uniform samplerCube cubeMap;

out vec4 eye_pos;  //vertex position in eye space 
out vec3 v_normal;  // vertex normal
out vec4 v_color;
out vec4 v_texture;

out vec3 cubeMap_normal;
out vec3 cubeMap_pos;
 

void main(void)
{
    /* Per vertex Shading ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    // transform light pos from local to eye space
    //vec4 light_pos_in_eye = viewMatrix * light_pos;
    vec4 light_pos_in_eye = light_pos;      

    // // transform normal from local to eye space: normal matrix is the inverse transpose of the modelview matrix 
    v_normal = normalize(vec3(normalMatrix * vec4(a_VertexNormal,0.0)));

    // // transform the vertex position to eye space 
    eye_pos = viewMatrix * modelMatrix * vec4(a_position, 1);;

    // // light vector L = l-p 
    vec3 light_vector = normalize(vec3(light_pos_in_eye - eye_pos)); 

    // // eye vector V = e-p, where e is (0,0,0) 
    vec3 eye_vector = normalize(-vec3(eye_pos));
    
    vec4 ambient = ambient_coef * light_ambient;

    float ndotl = max(dot(v_normal, light_vector), 0.0); 

    vec4 diffuse = diffuse_coef * light_diffuse * ndotl;

    // //both lines below are okay. One is to use the reflect function the other is to compute by yourself 
    vec3 R= normalize(vec3(reflect(-light_vector, v_normal))); 
    // vec3 R = normalize(2.0 * ndotl *v_normal-eye_vector);
    float rdotv = max(dot(R, eye_vector), 0.0);

    vec4 specular;  
    if (ndotl>0.0) 
         specular = specular_coef * light_specular * pow(rdotv, mat_shininess); 
     else
         specular = vec4(0,0,0,1);



    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position, 1);

    v_color = ambient + diffuse + specular;

    */

    // /* Per fragment Shading ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~   

    // // transform normal from local to eye space: normal matrix is the inverse transpose of the modelview matrix
    eye_pos = viewMatrix * modelMatrix * vec4(a_position, 1);;

    v_normal = normalize(vec3(normalMatrix * vec4(a_VertexNormal,0.0)));

    gl_Position = projMatrix * viewMatrix * modelMatrix * vec4(a_position, 1);

    v_color = vec4(v_normal, 1.0);

    v_texture = vec4(a_TextCoord.st, 0.0, 1.0);

    cubeMap_normal = mat3(transpose(inverse(modelMatrix))) * a_VertexNormal;
    cubeMap_pos = vec3(modelMatrix * vec4(a_position.x, a_position.y, a_position.z, 1.0));
    // */
}