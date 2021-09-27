const http = require('http');
const hostname = 'localhost';
const port = 5000;
const fs = require('fs');
const readline = require('readline');

englishToSpanish = {};
englishToGerman = {};

async function loadTheData(filename, dictionary){
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
  for await(const line of rl){
    components = line.split('\t');
    if(components[0][0] != '#' && components.length >= 2){
      baseWord = components[0];
      translation_lis = components[1];
      let i;
      let index;
      for(i = 0; i < translation_lis.length; i++ ){
        var char = translation_lis[i];
        if(char == '[' || char == ',' || char == '('){
          index = i;
          break;
        }
      }
      translation = translation_lis.substring(0,index)
      //console.log(translation);
      dictionary[baseWord] = translation;
    }
  }
}

loadTheData('Spanish.txt',englishToSpanish);
loadTheData('German.txt', englishToGerman);

//loadTheData('German.txt', englishToGerman);

const server = http.createServer( function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.statusCode = 200;
  //http://127.0.0.1:5000/translate/e2s/you+want+to+sail
  if(req.url != '/favicon.ico'){
    urlComponents = req.url.split('/');

    type = urlComponents[2];
    content = urlComponents[3].split('+');
    if(type == 'e2s'){
      var retVal = '';
      for(let word of content){
        retVal += englishToSpanish[word] + ' ';
      }
    }else if(type == 'e2g'){
      var retVal = '';
      for(let word of content){
        retVal += englishToGerman[word] + ' ';
      }
    }
    res.end(retVal);
  } // end of favicon
});

server.listen(port, hostname,function () {
  console.log(`Server running at http://${hostname}:${port}/`);
});
