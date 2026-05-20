function* oneToSeven(){
    for(let i = 1; i <= 7; i++){
        yield i;
    }
}

let hoge = oneToSeven();
console.log(hoge.next().value); // 1
console.log(hoge.next().value); // 2
console.log(hoge.next().value); // 3
console.log(hoge.next().value); // 4
console.log(hoge.next().value); // 5
console.log(hoge.next().value); // 6
console.log(hoge.next().value); // 7
console.log(hoge.next().value); // undefined

function* generatorFunc()
{
    yield 1;
    yield 2;
    yield 3;
}
 var generator = generatorFunc();

//  for (let value of generator) {
//     console.log(value); // 1, 2, 3


 console.log(generator.next().value); // 1
 console.log(generator.next().value); // 2
 console.log(generator.next().value); // 3

 let numbers = {
    *[Symbol.iterator]() {
        for (let i = 1; i <= 5; i++) {
            yield i;
        }
    }
 }
console.log("================")



for (let num of numbers) {
    console.log(num); // 1, 2, 3, 4, 5
}

let allNUmbers = [...numbers];
console.log(allNUmbers); // [1, 2, 3, 4, 5]

let [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4, 5]