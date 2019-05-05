var fs = require("fs"),
  parseString = require("xml2js").parseString,
  xml2js = require("xml2js");

fs.readFile("./XML/consultaStatus.xml", "utf-8", function(err, data) 
{
  if (err) console.log(err);
  // we log out the readFile results
  console.log(data);
  // we then pass the data to our method here
  parseString(data, function(err, result) 
  {
    if (err) console.log(err);
    // here we log the results of our xml string conversion
    console.log(result);

    var json = result;

    json.requisicao.metodo[0].parametros[0].parametro[0].valor[0] = "00000099999";

    // create a new builder object and then convert
    // our json back to xml.
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(json);

    fs.writeFile("./XML/consultaStatus.xml", xml, function(err, data) {
      if (err) console.log(err);

      console.log("successfully written our update xml to file");
    
  });
  });
});
