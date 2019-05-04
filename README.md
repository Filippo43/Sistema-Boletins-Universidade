# Sistema de Boletins de uma Universidade

Atividade da Disciplina Tópicos Especiais em Banco de Dados sobre Submissão e Consulta de Boletins de uma Universidade simulando inscrições para uma Pós-Graduação.

Consiste em uma comunicação entre 2 programas de linguagens diferentes sendo um deles a representação de uma universidade que recebe boletins para submissão e permite suas consultas através de requisições XML.

O sistema deve: 

      *Receber um boletim como parâmetro e retorna um número inteiro (0 - sucesso, 1 - XML inválido, 2 - XML mal-formado, 3 - Erro Interno).
      
      *Permitir a consulta do status da inscrição do candidato com o CPF informado como parâmetro, retornando: 0 - Candidato não encontrado, 1 - Em processamento, 2 - Candidato Aprovado e Selecionado, 3 - Candidato Aprovado e em Espera, 4 - Candidato Não Aprovado.
