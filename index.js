function filterQuery(strObj) {
    const onelineStr = strObj.str.replace(/(\r\n|\n|\r)/gm, ' ');
    return onelineStr.split(`${strObj.start} `)
        .filter((item) => item.includes(` ${strObj.end}`))
        .map((item) => item.split(` ${strObj.end}`)[0].trim());
}


module.exports = {
    filterQuery,
}