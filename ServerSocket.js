// Import net module.
var net = require('net');
var fs = require('fs'),
parseString = require('xml2js').parseString,
xml2js = require('xml2js');
var x = require('libxmljs');

//Constants
var xsdRequisicao = "./XML/requisicao.xsd";
var xsdHistorico = "./XML/historico.xsd";


// Create and return a net.Server object, the function will be invoked when client connect to this server.
var server = net.createServer(function(client) {

    console.log('Client connect. Client local address : ' + client.localAddress + ':' + client.localPort + '. client remote address : ' + client.remoteAddress + ':' + client.remotePort);

    client.setEncoding('utf-8');

    client.setTimeout(5000);

    // When receive client data.
    client.on('data', function (data) {

        // Print received client data and length.
        console.log('Receive client send data : ' + data + ', data size : ' + client.bytesRead);

        //Pega a requisição
        var requisicao = data;

        // Valida a requisição recebida.
        //Trazendo o conteúdo do arquivo
        fs.readFile(xsdRequisicao, "utf-8", function(err, data)
        {
            //Caso de erro
            if (err) callback(err,null)

            //Valida a requisicao
            var xsdDoc = x.parseXmlString(data);
            var xmlDoc = x.parseXmlString(requisicao);
            var result = xmlDoc.validate(xsdDoc);
            if (!result)
            {
                console.log ("Requisição inválida!")
                callback(err,null)
            }

            //Realiza o parser na requisição
            var metodo = "";
            var valor = "";
            parseString(requisicao, function(err, result)
            {
                //Caso de error
                if (err) callback(err,null)

                //Pega o xml em forma de json
                var json = result;

                //Extrai o método a ser executado
                metodo = json.requisicao.metodo[0].nome[0];
                console.log ("Execução do método " + metodo + "()\n");
                valor = json.requisicao.metodo[0].parametros[0].parametro[0].valor[0];

                return valor;
            });

            //Verifica qual método será executado
            if(metodo=="submeter")
            {
                //Abre o xsd do histórico
                fs.readFile(xsdHistorico, "utf-8", function(err, data)
                {
                    //Caso de erro
                    if (err) 
                    {
                        //Erro interno
                        client.end("<resposta>\n   <retorno>3</retorno>\n</resposta>");
                        callback(err,null);
                    }

                    //Realiza a validação d o histórico
                    xsdDoc = x.parseXmlString(data);
                    xmlDoc = x.parseXmlString(valor);
                    result = xmlDoc.validate(xsdDoc);
                    console.log ("XML histórico Válido? " + result + "\n");

                    //Verifica se deve acusar erro (XML inválido)
                    if(!result) client.end("<resposta>\n   <retorno>1</retorno>\n</resposta>");

                    //Realiza o parser no hsitórico para extrair o cpf
                    parseString(valor, function(err, result)
                    {
                        //Caso de error
                        if (err) 
                        {
                            //XML mal formado
                            client.end("<resposta>\n   <retorno>2</retorno>\n</resposta>");
                            callback(err,null);
                        }

                        //Transforma em Json
                        var json = result;

                        //Extrai o cpf
                        var cpf = json.HistoricoEscolar.cpf[0];

                      

                        //Grava o histórico em um arquivo com o nome do CPF
                        var xmlPath = "./XML/"+cpf+".xml"
                        fs.writeFile(xmlPath, valor, function(err, data)
                        {
                            //Caso de error
                            if (err) 
                            {                     
                                //Erro interno
                                client.end("<resposta>\n   <retorno>3</retorno>\n</resposta>");
                                console.log(err);
                            }

                            console.log("Histórico gravado com sucesso!");

                        });

                        client.end("<resposta>\n   <retorno>0</retorno>\n</resposta>");
                       
                    });
                });
            }
            //Método consulta
            else
            {
                console.log ("Consultando por " + valor + ".xml\n");
                

                //Verifica os casos especiais
                var cpfPath = "./XML/"+valor+".xml";
                if (parseInt(valor, 10) < 5)
                {
                    client.end("<resposta>\n   <retorno>" + parseInt(valor,10) + "</retorno>\n</resposta>");
                }
                else
                {
                    //Lê o arquivo
                    fs.readFile(cpfPath, "utf-8", function(err, data)
                    {

                        //Caso de erro
                        if (err)
                        {
                            client.end("<resposta>\n   <retorno>0</retorno>\n</resposta>");
                            return;
                        }

                    //Resposta definida como padrão (aprovado para cada arquivo encontrado)
                    client.end("<resposta>\n   <retorno>2</retorno>\n</resposta>");
                    });
                }
            }

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
            }
            else
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
server.listen(9999, "127.0.0.1", function () {

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