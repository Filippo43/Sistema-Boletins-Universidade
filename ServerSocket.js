// Import net module.
var net = require('net');
var fs = require('fs'),
parseString = require('xml2js').parseString,
xml2js = require('xml2js');
var x = require('libxmljs');

var xsdRequisicao = "./XML/requisicao.xsd";


// Create and return a net.Server object, the function will be invoked when client connect to this server.
var server = net.createServer(function(client) {

    console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);

    client.setEncoding('utf-8');

    client.setTimeout(5000);

    // When receive client data.
    client.on('data', function (data) {

        // Print received client data and length.
        console.log('Receive client send data : ' + data + ', data size : ' + client.bytesRead);

        // Server send data back to client use client net.Socket object.
        client.end('Server received data : ' + data + ', send back to client data size : ' + client.bytesWritten);

        var requisicao = data;

        // Valida a requisição recebida.
        //Trazendo o conteúdo do arquivo
        fs.readFile(xsdRequisicao, "utf-8", function(err, data)
        {
          //Caso de erro
          if (err) callback(err,null)

          var xsdDoc = x.parseXmlString(data);
          var xmlDoc = x.parseXmlString(requisicao);

          var result = xmlDoc.validate(xsdDoc);

          console.log ("XML Validado!");

          var metodo = "";

            parseString(requisicao, function(err, result)
            {
                //Caso de error
                if (err) callback(err,null)

                //Mostra o resultado do parses
                //console.log(result);

                var json = result;

                metodo = json.requisicao.metodo[0].nome[0];
                console.log ("executar o metodo "+metodo+"()");

                if(metodo=="submeter")
                {

                }
                else
                {

                }
            });

        });

    });

    // When client send data complete.
    client.on('end', function () {
        console.log('Client disconnect.');

        // Get current connections count.
        server.getConnections(function (err, count) {
            if(!err)
            {
                // Print current connection count in server console.
                console.log("There are %d connections now. ", count);
            }else
            {
                console.error(JSON.stringify(err));
            }

        });
    });

    // When client timeout.
    client.on('timeout', function () {
        console.log('Client request time out. ');
    })
});

// Make the server a TCP server listening on port 9999.
server.listen(9999, function () {

    // Get server address info.
    var serverInfo = server.address();

    var serverInfoJson = JSON.stringify(serverInfo);

    console.log('TCP server listen on address : ' + serverInfoJson);

    server.on('close', function () {
        console.log('TCP server socket is closed.');
    });

    server.on('error', function (error) {
        console.error(JSON.stringify(error));
    });

});