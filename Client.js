// Import net module.
var net = require('net');
var fs = require('fs'),
parseString = require('xml2js').parseString,
xml2js = require('xml2js');

//Constant
var xmlConsultaPath = "./XML/consultaStatus.xml";
var xmlSubmeterPath = "./XML/submeter.xml";
global.xml = " "
global.abc = 'oi'

//Função que atualiza o xml de consulta
function getConsulta(xmlPath, cpf,callback)
{
        //Trazendo o conteúdo do arquivo
        fs.readFile(xmlPath, "utf-8", function(err, data) 
        {
          //Caso de erro
          if (err) callback(err,null)

          //Mostra o conteúdo do arquivo
          //console.log(data);

          //Realiza o parser do xml
          parseString(data, function(err, result) 
          {

            //Caso de error
            if (err) callback(err,null)

            //Mostra o resultado do parses
            //console.log(result);

            var json = result;

            //Alterando valores do XML
            
            json.requisicao.metodo[0].parametros[0].parametro[0].valor[0] = cpf;

            //Cria um builder object e converte o json para xml
            var builder = new xml2js.Builder();
            
            xml = builder.buildObject(json);
            

            
            console.log(xml)
            xml = xml.replace(/(\r\n|\n|\r)/gm,"");

            //Grava o arquivo
            fs.writeFile(xmlPath, xml, function(err, data)
            {
             //Caso de error
             if (err) console.log(err);

             console.log("successfully update xml");
            
            });
            
            return callback(null,xml)
            console.log("successfully update xml");
           
            

          
            });
            return xml;
        });

        return xml
}

function getSubmeter(xmlPath,xmlHistorico,callback)
{
    var xmlHistoricoSub = "";
    fs.readFile(xmlHistorico, "utf-8", function(err, data)
    {
        //Caso de erro
        if (err) callback(err,null)

        parseString(data, function(err, result)
        {

            //Caso de error
            if (err) callback(err,null)

            //Mostra o resultado do parses
            //console.log(result);

            var json = result;

            //Cria um builder object e converte o json para xml
            var builder = new xml2js.Builder();

            xmlHistoricoSub = builder.buildObject(json);

            //console.log(xmlHistoricoSub)
            xmlHistoricoSub = xmlHistoricoSub.replace(/(\r\n|\n|\r)/gm,"");
        });
    });

    //Trazendo o conteúdo do arquivo
    fs.readFile(xmlPath, "utf-8", function(err, data)
    {
        //Caso de erro
        if (err) callback(err,null)

        //Mostra o conteúdo do arquivo
        //console.log(data);

        //Realiza o parser do xml
        parseString(data, function(err, result)
        {

            //Caso de error
            if (err) callback(err,null)

            //Mostra o resultado do parses
            //console.log(result);

            var json = result;

            //Alterando valores do XML

            json.requisicao.metodo[0].parametros[0].parametro[0].valor[0] = "["+xmlHistoricoSub+"]";

            //Cria um builder object e converte o json para xml
            var builder = new xml2js.Builder();

            xml = builder.buildObject(json);



            console.log(xml)
            xml = xml.replace(/(\r\n|\n|\r)/gm,"");

            //Grava o arquivo
            fs.writeFile(xmlPath, xml, function(err, data)
            {
                //Caso de error
                if (err) console.log(err);

                console.log("successfully update xml");

            });

            return callback(null,xml)
            console.log("successfully update xml");




        });
        return xml;
    });

    return xml
}

// This function create and return a net.Socket object to represent TCP client.
function getConn(connName){

    var option = {
        host:'localhost',
        port: 9999
    }

    // Create TCP client.
    var client = net.createConnection(option, function () {
        console.log('Connection name : ' + connName);
        console.log('Connection local address : ' + client.localAddress + ":" + client.localPort);
        console.log('Connection remote address : ' + client.remoteAddress + ":" + client.remotePort);
    });

    client.setTimeout(5000);
    client.setEncoding('utf8');

    // When receive server send back data.
    client.on('data', function (data) {
        console.log('Server return data : ' + data);
    });

    // When connection disconnected.
    client.on('end',function () {
        console.log('Client socket disconnect. ');
    });

    client.on('timeout', function () {
        console.log('Client connection timeout. ');
    });

    client.on('error', function (err) {
        console.error(JSON.stringify(err));
    });

    return client;
}

/------------------------------- CODE --------------------------------/

// Create a java client socket.
var client = getConn('Node');

//comente o subemeter para consultar e o cunsultar para submeter
/*
var consulta = getConsulta(xmlConsultaPath, "00000000002", function(err,data){
    if(err) console.log(err)
    else
    console.log(data);
    
    client.write(data);

    //return data;
});

consulta = consulta.toString();
consulta = consulta.replace(/(\r\n|\n|\r)/gm,"");
*/


var xmlHistoricoPath = "./XML/historico-ex.xml";

var submeter = getSubmeter(xmlSubmeterPath,xmlHistoricoPath,function(err,data){
    if(err) console.log(err)
    else
        console.log(data);

    client.write(data);

    //return data;
});

submeter = submeter.toString();
submeter = submeter.replace(/(\r\n|\n|\r)/gm,"");


//console.log("a data:" + data);



// Create node client socket.
//var nodeClient = getConn('Connection');



//nodeClient.write('Node is more better than java. ');