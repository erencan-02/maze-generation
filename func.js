
//Source: https://javascript.info/task/shuffle
const shuffle = (array) => {
  if(array.length <= 1){
    return;
  }

  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const fold = (reducer, init, xs) => {
    let acc = init;
    for (const x of xs) {
        acc = reducer(acc, x);
    }
    return acc;
};

const removeFromArray = (array, e) => {
  return array.filter((x) => x !== e);
}

const prepend = (value, array) => {
  var newArray = array.slice();
  newArray.unshift(value);
  return newArray;
}
