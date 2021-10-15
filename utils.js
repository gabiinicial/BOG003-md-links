// file es un objeto que contiene el nombre del archivo y el contenido de ese archivo
 const extractLinks= (file) =>{
  const text = file.data;
  if (text === '') {
    return 'Error not Found'
  };
  let urls = text.match(/\[(.*?)\]\((https?:\/\/.*\.(?:png|jpg)|(https?:\/\/[\w\d./?=#]+)\))/gi);

  // let alt = text.match(/\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)|/gi);
  //let alt = text.match(/(https?:\/\/.*\.(?:png|jpg)|(https?:\/\/[\w\d./?=#]+)\))/gi);
 // const text= (alt)=>{

if (urls === null) {
    return '';
  }
  if (typeof text === 'string') {
    let urlObj = {}
    let links = []
    // extrae los links que solo incluyan https:// y http://
    if (urls !== null || urls !== undefined) {
      urls.map((urls) => {
        //if (urls.includes('https://') || urls.includes('http://')){
          //const filterUrl= urls.includes('https://'||'http://');
          let url= '';
          if(urls.includes(')')){
            url +=  urls.substring(urls.indexOf('https'), urls.length -1)
          }else{
           url += urls.substring(urls.indexOf('https'))
          }
          urlObj = {
            href: url,
            path: file.fileName,
            text: urls.substring(1,urls.indexOf("]"))
          }
          links.push(urlObj);
      });
    }
    //console.log(alt);
    //console.log(links);
    //console.log(links.length);
    //console.log(alt.length);
    return links
  }
};

   //let text = findUrlInArray(urls, alt);
         //console.log(alt);
          //console.log(text);
          //const text=  extraxtTitle(alt, urls)
// function extractTitle(text) {
//     return text.substring(1,text.indexOf("]"));

// }
  function findUrlInArray(alt){
alt.map((url)=>{
return url;
})
 }
module.exports = (extractLinks)