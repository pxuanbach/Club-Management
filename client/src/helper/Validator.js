function ValidateNormalField(value, preText) {
    if (value === '') {
        return preText + ' đang bỏ trống';
    }

    return '';
}

function ValidateImportantField(value, preText) {
    if (value === '') {
        return preText + ' đang bỏ trống';
    }
    if (value.length < 6) {
        return preText + ' ít hơn 6 ký tự';
    }

    return '';
}

function ValidateEmail(value) {
    
}

export {
    ValidateNormalField,
    ValidateImportantField
}