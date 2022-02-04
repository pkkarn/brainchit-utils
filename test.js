const { filterQuery } = require('./index');

const testString = `
My name is karn
$ed pk is a founder of codechit ed$ but ther is hack
a
`;

const strObj = {
    str: testString,
    start: '$ed',
    end: 'ed$',
}

console.log(filterQuery(strObj));