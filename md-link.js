#!/usr/bin/env node
 //'use strict';
const process = require('process');
const path = require('path');
const extractLinks = require('./utils.js');
const args = process.argv[2];
path.normalize(`${args}`);
const fs = require('fs');
const axios = require('axios');
let isDirectory = false;

const absoluted = path.resolve(`${args}`); //resuelve la ruta a absoluta

//funcion para traer archivo md
const extension = (route) => path.extname(route) === ".md";


const readPathFile = (path) => new Promise((resolve, reject) => {

  fs.readFile(path, 'utf-8', (err, data) => {
    if (err) {
      reject('error', err);
    } else {
           
      let fileName = (isDirectory)? absoluted+'\\'+path : path;

      const fileNameAndData = {
        fileName:  fileName,
        data: data
      }
      resolve(fileNameAndData);
    }
  })
})

const readPathDir = (path) => new Promise((resolve, reject) => {
  fs.readdir(path, (err, files) => {
    if (err) {
      reject('error', err);
    } else {
      resolve(files);
    }
  })
})

const sendGetRequest = async (url) => {
  try {
    //console.log(url);
    const response = await axios.get(url);

    return {
      status: response.status,
      statusText: response.statusText
      
    };

  } catch (err) {
    //console.log(err.message);
    if (err.response === undefined || err.response === null) { //err.message.includes('ENOTFOUND')){
      return {
         status: 402,
        statusText: 'fail'
      };
     } else {
       return {
         status: err.response.status,
         statusText: 'Fail'
       };
    }
  }
};

// 
const validLinks = async (url) => {
  //console.log('el arrreglo de url lelgo',url);
  let promiseResolv = [];
  for (let i = 0; i < url.length; i++) {
    let result = await sendGetRequest(url[i].href);

     result={
      href: url[i].href,
      text: url[i].text,
       path: url[i].path,
      status: result.status,
      statusText: result.statusText
    }
  
    promiseResolv.push(result)
    //console.log(promiseResolv);
 //promiseResolv.push(objet)
  
  // promiseResolv.push(result)
  }
  return promiseResolv; //await Promise.all(promiseResolv);
}

const pathFile = (path) => new Promise((resolve, reject) => {
  fs.stat(path, (err, stats) => {
    if (err) {
      reject('El directorio o archivo no existe');
    }
    if (stats) {
      resolve(stats.isFile())
    }
  })
})


const readFileAndDirectory = () => {
  return pathFile(absoluted)
    .then((stat) => {
      // es una ruta absoluta con archivo
      if (stat) {
        isDirectory = false;
        return [absoluted];
      } else {
        // es una ruta absoluta solo con directorio
        isDirectory = true;
        return readPathDir(absoluted)
      }
    })
    .then((files) => files.filter((extension)))
    .then(filesMd => Promise.all(filesMd.map(readPathFile)))
}

const extractAllLinks = (path) => new Promise((resolve, reject) => {
  readFileAndDirectory(path)
    .then(res => {
      // res arreglo de archivo y contenido de cada archivo
      //console.log(res);
      let linksAllFiles = [];
      res.forEach(function (element) {
        const links = extractLinks(element);
        linksAllFiles = linksAllFiles.concat(links);
      });
      //console.log(linksAllFiles);
      resolve(linksAllFiles);
    })
    .catch((error) => {
      reject('error:', error);
    })
})

const mdLinks = (path, optionValid ) => {
  extractAllLinks(path)
    .then((arrayLinks) => {
     if(optionValid){
     return validLinks(arrayLinks)
      }else{
        return arrayLinks;
      }
     })
    .catch((errr) => {
      const errMenssage= 'ups algo fallo'
      return errr,errMenssage
    })
}
module.exports = (mdLinks)
// extractAllLinks(path)
// .then((res) => {
//   //console.log(res);
//   validLinks(res).then((resValid) => {
//       console.log(resValid);
//     })
// })
// .catch((errr) => {
//   const errMenssage= 'No se encontraron links'
//   return errr,errMenssage
// })
//const validLink = (url) => {
//   let ok = {}
//   //console.log('mando peticion ',url)
//   axios.get(url.href)
//     .then(response => {
//       //console.log('estoy bien',response.status)
//       //JSON.parse(JSON.stringify(response));
//       if (response.status >= 200 && response.status < 400) {
//          ok = {
//            'status': response.status,
//            'ok': 'OK'
//          }
//          return ok;
//          //console.log(ok);
//        }

//     })
//     .catch(err => {
//       //console.log('Error: ', err.message);
//       //console.log('el error '+err.response.status)
//       if (err.response.status === 400) {
//         ok = {
//           status: err.response.status,
//           ok:'fail'
//         }
//         return ok;
//       }
//     })
// }
