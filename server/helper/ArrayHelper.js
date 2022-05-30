function isElementInArray(key, array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i]._id.toString() === key) {
            return true;
        }
    }
    return false;
}

function uniqueIdObjArray(array) {
    return [...new Map(array.map((item) => [item["_id"], item])).values()];
}

module.exports = {
    isElementInArray,
    uniqueIdObjArray
}