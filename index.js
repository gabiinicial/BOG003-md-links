const fn = require('./md-link.js')
let args = process.argv[3];
const argv = process.argv[2]
 const path = require('path');
const options= {
    validate: false,
    stats: false,
}
console.log(args);
const absoluted = path.resolve(`${args}`); //resuelve la ruta a absoluta
//console.log(args);
process.argv.forEach(command => {
    if(command ==='--stats'){
        options.stats= true
    }if(command ==='--validate'){
       options.validate = true
    }
       //console.log(command);
   });
 fn.mdLinks(absoluted, options)
 .then((res)=>{
    if(options.validate && !options.stats){
    console.log(res);
}if(!options.validate && !options.stats){
    console.log(res);
}if(options. stats && !options.validate){
    let objet= {}
    let array=[]
res.forEach((el)=>{
objet += el
array.push(objet);
})
const unique= array.length
console.log(unique);
}
 })
 .catch((err)=>{
console.log(err);
 })
 
// function statss (data, options){
// const totalLinks= data.length;
// // console.log(totalLinks + 'esto essss');
// let arrayObject=[];
// let objet={};
//  for (let i = 0; i < totalLinks.length; i++) {
//      if(options.stats && !options.validate){
//      objet[totalLinks[i]] = 0
//      arrayObject.push(objet);
//      }

//  }
//  console.log(arrayObject);
// } 
//statss(data,option)