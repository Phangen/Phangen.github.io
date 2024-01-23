import {myMatrixMath} from "./MyMatrixMath";

export var myObject = {}

myObject.createDefault = function() {
    return {
        translationMatrix : myMatrixMath.Make3DTranslationMatrix(0,0,0),
        rotationMatrix : myMatrixMath.MakeIdentityMatrix(),
        scaleMatrix : myMatrixMath.MakeIdentityMatrix(),
        parents : {},
        getModelMatrix : function() {
            return myMatrixMath.fourByFourMatixMul(this.translationMatrix, (myMatrixMath.fourByFourMatixMul(this.rotationMatrix, this.scaleMatrix)))
        }
    }
}

myObject.create = function(tM, rM, sM) {
    return {
        translationMatrix : tM,
        rotationMatrix : rM,
        scaleMatrix : sM,
        parents : {},
        getModelMatrix : function() {
            return myMatrixMath.fourByFourMatixMul(this.translationMatrix, (myMatrixMath.fourByFourMatixMul(this.rotationMatrix, this.scaleMatrix)))
        }
    }
}

