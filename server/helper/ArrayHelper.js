function isElementInArray(key, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].toString() === key) {
            return true;
        }
    }
    return false;
}

function isElementInArrayObject(key, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i]._id.toString() === key) {
            return true;
        }
    }
    return false;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

function uniqueArray(array) {
    const unique = array.filter(onlyUnique);
    return unique;
}


function uniqueIdObjArray(array) {
    return [...new Map(array.map((item) => [item["_id"], item])).values()];
}

module.exports = {
    isElementInArray,
    isElementInArrayObject,
    uniqueArray,
    uniqueIdObjArray
}