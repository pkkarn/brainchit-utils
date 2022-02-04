# A package with useful functions

**Basically this package is for personal use, but you can use if you your want**

### import { filterQuery } from 'brainchit-utils'; 

A function which will help you to filter out specifc set of sentence that starts and endswith some unique thing.
It's kind of thing that you can use to extract markup langugage.

But we will `recommend` you to use this function with only specially defined words.

e.g

```
const { filterQuery } = require('brainchit-utils');

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

console.log(filterQuery(strObj)); // ['pk is a founder of codechit']
```