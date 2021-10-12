// file es un objeto que contiene el nombre del archivo y el contenido de ese archivo
module.exports = function extractLinks(file) {
  const text = file.data;
  if (text === '') {
    return 'Error not Found'
  };
  

  let urls = text.match(/([a-z\-_0-9\/\:\.]*\/*)|(https?:\/\/.*\.(?:png|jpg))/gi);
  //let alt = text.match(/\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)/gi);
  // let alt = text.match(/\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)|/gi);
  let alt = text.match(/!\[(.*)\]\((.+)\)|\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)/gi);

console.log(alt);
  if (urls === null) {
    return '';
  }
  if (typeof text === 'string') {
    let urlObj = {}
    let links = []
    // extrae los links que solo incluyan https:// y http://
    if (urls !== null || urls !== undefined) {
      urls.map((urls,) => {
        if (urls.includes('https://') || urls.includes('http://')) {
           let text = findUrlInArray(urls, alt);
         //console.log(alt);
          //console.log(text);
          //const text=  extraxtTitle(alt, urls)
          urlObj = {
            href: urls,
            path: file.fileName,
            text: text
          }
          links.push(urlObj);
          }
        
      });
    }
    //console.log(alt);
    //console.log(links);
    //console.log(links.length);
    //console.log(alt.length);
    return links
  }
};

function extractTitle(text) {
    return text.substring(1,text.indexOf("]"));

}
 function findUrlInArray( array, alt){

 //console.log('url es:',url);
 // console.log('array es:',array);
  
 for (let index = 0; index < alt.length; index++) {
  
     if (null !== alt[index] &&
        undefined !== alt[index] && 
        array.includes(alt)[index]) 
     {
      let text = extractTitle(alt[index]);
      //console.log('lo encontre', text);
      //arr.splice(index, 1);
       console.log(text);
    }
  }
}
