const TYPES = {
    'undefined': true,
    'number': true,
    'boolean': true,
    'string': true,
    '[object Function]': true,
    '[object RegExp]': true,
    '[object Array]': true,
    '[object Date]': true,
    '[object Error]': true,
    '[object Blob]': true,
    '[object Promise]': true // DOES NOT WORK in all browsers
};

const isObject = function(item) {
    // cautious: some browsers detect Promises as [object Object] --> we always need to check instance of :(
    return !!(!TYPES[typeof item] && !TYPES[({}.toString).call(item)] && item && (!Promise || (!(item instanceof Promise))));
};

/**
* Returns true if the item is a date
*
* @method itsa_isDate
* @static
* @param item {any} the item to test.
* @param [stringified] {Boolean} whether a stringified value should be tested as a valid Date pattern.
* @return {Boolean} true if the item is a date
*/
const isDate = function(item) {
    return (Object.prototype.toString.call(item)==='[object Date]');
};

const cloneObj = function(obj) {
    let copy, i, len, value, newObj;

    // Handle Array
    if (Array.isArray(obj)) {
        copy = [];
        len = obj.length;
        for (i=0; i<len; i++) {
            value = obj[i];
            copy[i] = (isObject(value) || Array.isArray(value) || isDate(value)) ? cloneObj(value) : value;
        }
        return copy;
    }

    // Handle Date
    if (isDate(obj)) {
        return new Date(obj);
    }

    // Handle Object
    if (isObject(obj)) {
        newObj = {};
        clone(obj, newObj);
        obj = newObj;
    }

    return obj;
};

const merge = function(source, target, replace) {
    let i = -1,
        keys, l, key;
    if (isObject(source)) {
        keys = Object.keys(source);
        l = keys.length;
        while (++i < l) {
            key = keys[i];
            if (isObject(source[key])) {
                if (!replace && isObject(target[key])) {
                    merge(source[key], target[key]);
                }
                else {
                    target[key] = {};
                    clone(source[key], target[key]);
                }
            }
            else {
                target[key] = source[key];
            }
        }
    }
};

// const merge = function(source, target, replace) {
//     let i = -1,
//         keys, l, key, propDescriptor;
//     if (isObject(source)) {
//         // keys = Object.keys(source);
//         keys = Object.getOwnPropertyNames(source);
//         l = keys.length;
//         while (++i < l) {
//             key = keys[i];
//             if (isObject(source[key])) {
//                 if (!replace && isObject(target[key])) {
//                     merge(source[key], target[key]);
//                 }
//                 else {
//                     target[key] = {};
//                     clone(source[key], target[key]);
//                 }
//             }
//             else {
//                 // target[key] = source[key];
//                 propDescriptor = Object.getOwnPropertyDescriptor(source, key);
//                 if (!propDescriptor.writable) {
//                     // instance[key] = obj[key];
//                     target[key] = source[key];
//                 }
//                 else {
//                     Object.defineProperty(target, key, propDescriptor);
//                 }
//             }
//         }
//     }
// };

const clone = function(source, target) {
    let keys = Object.getOwnPropertyNames(source),
        l = keys.length,
        i = -1,
        key, value;
    // loop through the members:
    while (++i < l) {
        key = keys[i];
        value = source[key];
        target[key] = (isObject(value) || Array.isArray(value) || isDate(value)) ? cloneObj(value) : value;
    }
};

const differentTypes = function(val1, val2) {
    let type1;
    if (typeof val1!==typeof val2) {
        return true;
    }
    type1 = Object.prototype.toString.call(val1);
    if (type1!==Object.prototype.toString.call(val2)) {
        return true;
    }
    // cautious: some browsers detect Promises as [object Object] --> we always need to check instance of :(
    if (type1!=='[object Object]') {
        return false;
    }
    // [object Object] --> we need to check if both are Objects
    return (isObject(val1)!==isObject(val2));
};

const checkArrayDif = function(arr1, arr2) {
    const l = arr1.length;
    if (l!==arr2.length) {
        return true;
    }
    let i = -1,
        different = false,
        arr1Value, arr2Value;
    // loop through the members:
    while ((++i < l) && !different) {
        arr1Value = arr1[i];
        arr2Value = arr2[i];
        if (differentTypes(arr1Value, arr2Value)) {
            different = true;
        }
        else if (isObject(arr1Value)) {
            different = checkPropertyDif(arr1Value, arr2Value);
        }
        else if (Array.isArray(arr1Value)) {
            different = checkArrayDif(arr1Value, arr2Value);
        }
        else if (isDate(arr1Value)) {
            different = (arr1Value.getTime()!==arr2Value.getTime());
        }
        else {
            different = (arr1Value!==arr2Value);
        }
    }
    return different;
};

const checkPropertyDif = function(obj, newMembers) {
    let keys = Object.getOwnPropertyNames(newMembers),
        l = keys.length,
        i = -1,
        different = false,
        key, objValue, memberValue;
    // loop through the members:
    while ((++i < l) && !different) {
        key = keys[i];
        objValue = obj[key];
        memberValue = newMembers[key];
        if ((objValue===undefined) || differentTypes(objValue, memberValue)) {
            different = true;
        }
        else if (isObject(memberValue)) {
            different = checkPropertyDif(objValue, memberValue);
        }
        else if (Array.isArray(memberValue)) {
            different = checkArrayDif(objValue, memberValue);
        }
        else if (isDate(memberValue)) {
            different = (memberValue.getTime()!==objValue.getTime());
        }
        else {
            different = (memberValue!==objValue);
        }
    }
    return different;
};

module.exports = {
    merge,
    clone,
    checkPropertyDif,
    differentTypes,
    isObject
};
