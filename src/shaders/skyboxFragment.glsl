#version 300 es
// fragment.glsl

precision highp float;

uniform int texture_number;

uniform samplerCube cubeMap;
uniform mat4 viewDirectionProjectionInverse;

in vec3 v_texture;

in vec4 v_position;

out vec4 FragColor;

void main(void)
{
    /*
    vec4 t = viewDirectionProjectionInverse * v_position;
    FragColor = texture(cubeMap, normalize(t.xyz / t.w));
    */
    
    FragColor = texture(cubeMap, v_texture);
    //FragColor = vec4(1,1,1,1);
}