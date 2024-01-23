import { Vec3 } from "webgl-obj-loader";
import {vec3} from "./glMatrix";

//////////////////////////////////////////////////////.........
//
//  Methods to normals
//

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Normalization Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export var myNormalCalculations = {};

myNormalCalculations.calculateVertexNormals = function(vertexArry, indexArr) {
    var normalsArray = [];

    //create a place to hold a normal for each vertex
    for (let i = 0; i < vertexArry.length; i+=3) {
        //pushes 3 zeros to the normals array to represent vec3(0,0,0)
        normalsArray.push(0);
        normalsArray.push(0);
        normalsArray.push(0);

    }

    //for each triangle in indexArr we calculate the face normals and then add them to corresponding vertex normals
    for (let i = 0; i < indexArr.length; i += 3) {
        var vertexPos1 = indexArr[i] * 3;
        var vertexPos2 = indexArr[i + 1] * 3;
        var vertexPos3 = indexArr[i + 2] * 3;

        //gets values of each vertex from the indicated postions
        var vertex1 = vec3.create([vertexArry[vertexPos1], vertexArry[vertexPos1 + 1], vertexArry[vertexPos1 + 2]]);
        var vertex2 = vec3.create([vertexArry[vertexPos2], vertexArry[vertexPos2 + 1], vertexArry[vertexPos2 + 2]]);
        var vertex3 = vec3.create([vertexArry[vertexPos3], vertexArry[vertexPos3 + 1], vertexArry[vertexPos3 + 2]]);

        //gets the face normal for the face made up of the three vertices
        var faceNormal = calculateFaceNormal(vertex1, vertex2, vertex3);

        //adds the face normal to the corresponding vertex normal
        normalsArray[vertexPos1] += faceNormal[0];
        normalsArray[vertexPos1 + 1] += faceNormal[1];
        normalsArray[vertexPos1 + 2] += faceNormal[2];

        normalsArray[vertexPos2] += faceNormal[0];
        normalsArray[vertexPos2 + 1] += faceNormal[1];
        normalsArray[vertexPos2 + 2] += faceNormal[2];
        
        normalsArray[vertexPos3] += faceNormal[0];
        normalsArray[vertexPos3 + 1] += faceNormal[1];
        normalsArray[vertexPos3 + 2] += faceNormal[2];

    }

    //normalize what we added to the normals array
    for (let i = 0; i < normalsArray.length; i+=3) {
        //create vertex
        var vertex = vec3.create([normalsArray[i], normalsArray[i + 1], normalsArray[i+2]]);
        //normalize vertex
        var normalizedVertex =vec3.normalize(vertex);

        //set values in the normals array to new normalized values
        normalsArray[i] = normalizedVertex[0];
        normalsArray[i + 1] = normalizedVertex[1];
        normalsArray[i + 2] = normalizedVertex[2];
    } 

    return normalsArray;

}

function calculateFaceNormal(v1, v2, v3){

   return vec3.cross(vec3.subtract(v2, v1), vec3.subtract(v3, v1));
}


//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Normalizaitons Methods ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

