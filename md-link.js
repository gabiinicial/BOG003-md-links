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

      let fileName = (isDirectory) ? absoluted + '\\' + path : path;
      const fileNameAndData = {
        fileName: fileName,
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
      let linksAllFiles = [];
      res.forEach(function (element) {
        const links = extractLinks(element);
        linksAllFiles = linksAllFiles.concat(links);
      });
      resolve(linksAllFiles);
    })
    .catch((error) => {
      reject('archivo incorrecto', error);
    })
})
const sendGetRequest = (url) => {
  const arrayObjectLinks = url.map((links) => {
    //console.log(url);
    return axios.get(links.href)
      .then((res) => {
        return {
          href: links.href,
          text: links.text,
          path: links.path,
          status: res.status,
          statusText: res.statusText
        }
      })
      .catch((err) => {
        //console.log(err.message);
        if (err.response >= '400' || err.response === null  || err.response === undefined) { //err.message.includes('ENOTFOUND')){
          return {
            href: links.href,
            text: links.text,
            path: links.path,
            status: 400,
            statusText: 'Fail',
          };
        }
      })
  })
  return Promise.all(arrayObjectLinks);
}

mdLinks = (path, option) => new Promise((resolve, reject) => {
  extractAllLinks(path)
    .then((arrayLinks) => {
      if (option.validate && !option.stats) {
        sendGetRequest(arrayLinks).then(res => {
          resolve(res);
        })
      }  if(!option.validate && !option.stats){
         resolve(arrayLinks);
       }if( option.stats && !option.validate){
         resolve(arrayLinks);
       } if (option.validate && option.stats) {
        sendGetRequest(arrayLinks).then(res => {
          resolve(res);
        })
      }
    })
    .catch((errr) => {
      const errMenssage = 'ups algo fallo'
      reject(errr, errMenssage);
    })
})
//mdLinks()
module.exports = {
  mdLinks,
};
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
// 
// function validLinks(url) {
//   let promiseResolv = [];
//   url.map((links) => {
//     let result = sendGetRequest(links.href);
//     result = {
//       href: links.href,
//       text: links.text,
//       path: links.path,
//       status: response.status,
//       statusText: response.statusText
//     };
//     promiseResolv.push(result);
//   });
//   return Promise.all(promiseResolv);
// }
