const generateHashId = (id) => {
    var hash = 0;
    if (id.length == 0)
        return hash;
    for (let i = 0; i < id.length; i++) {
        var charCode = id.charCodeAt(i);
        hash = ((hash << 7) - hash) + charCode;
        hash = hash & hash;
    }
    return hash;
}

module.exports = {
    generateHashId
}