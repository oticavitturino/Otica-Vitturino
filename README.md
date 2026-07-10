# Otica-Vitturino
Projeto focado em CRM para fidelização. 

- Para que seja criado uma aplicação java, de início, deve ser criado uma cópia do arquivo que contém todas as configurações, dependências, extensões e todos os arquivos necessários e que é responsável pela execução de toda a aplicação Java. Posteriormente, direcioná-lo a arquivo de imagem Docker que será responsável por conter todos os padrões de configuração do Java em prol da execução da aplicação em ambiente externo sem nenhum problema, esta imagem Docker nada mais é do que um *“espelho”* da aplicação Java que rodará em um ambiente reservado.

- Para que seja criado a cópia deste arquivo principal da aplicação, é preciso efetuar o seguinte comando na pasta raiz do projeto:

    **`mvn clean package`**
    
    Este comando, irá criar o arquivo principal da aplicação dentro da pasta responsável pela gerência da aplicação e outras configurações de teste da aplicação.