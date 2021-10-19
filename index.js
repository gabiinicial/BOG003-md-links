const fn = require('./md-link.js')
let args = process.argv;
const argv = process.argv[2]
 const path = require('path');
const options= {
    validate: false,
    stats: false,
}
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
 fn.mdLinks(args, options)
 .then((res)=>{
    if(options.validate && !options.stats){
    console.log(res);
}if(!options.validate && !options.stats){
    console.log(res);
}if(options.stats && !options.validate){
    statss (res, options)
}if(options.validate && options.stats || options.stats && options.validate){
    let arrayBroken =[]
    res.forEach((el)=>{
     if(el.status === 400){
     arrayBroken.push(el);
     }
    })
    statss (res)
      console.log('Broken:',arrayBroken.length);
}
 })
 .catch((err)=>{
console.log(err);
 })
 
function statss (data){
   let array=data
   let object= {};
    let uniques = array.filter(obj => !object[obj.href] && (object[obj.href] = true));
    //console.log(array)
    console.log('total:',array.length)
    console.log('unique:', uniques.length);
} 