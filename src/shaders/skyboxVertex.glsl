#version 300 es

precision highp float;

layout(location = 0) in vec3 a_position;

//matrix uniforms
uniform mat4 viewMatrix;
uniform mat4 projMatrix;

out vec3 v_texture; //vertex texture
 
out vec4 v_position;

void main(void)
{
    /*
    v_position = vec4(a_position, 1);
    gl_Position = vec4(a_position, 1);
    gl_Position.z = 1.0;
    */

    v_texture = vec3(a_position.x, 1.0 - a_position.y, a_position.z);
    gl_Position = projMatrix * viewMatrix * vec4(a_position, 1);
    
}