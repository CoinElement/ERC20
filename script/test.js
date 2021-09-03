var str="abcd";
var string;
console.log(str);
// document.write("asad");

// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
//   })
  
//   readline.question(`你叫什么名字?`, name => {
//     console.log(`你好 ${name}!`)
//     readline.close()
//   })

var args = process.argv.splice(2)

console.log(args[0]);
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});