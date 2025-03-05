# 📩 Send Messaging API

Uma API unificada para envio de mensagens para múltiplos provedores. Atualmente, suporta **WhatsApp**, com planos para expandir para **E-mail, SMS e Telegram**.

> Veja também: [Wprm Notify](https://github.com/WalissonPires/wprm-notify). Um SPA que faz o uso dessa API para enviar notificações para contatos do WhatsApp.

## 🚀 Tecnologias Utilizadas

- **TypeScript** - Tipagem estática e melhor manutenção do código.
- **Fastify** - Framework web rápido e eficiente.
- **Node.js** - Ambiente de execução para JavaScript.
- **PostgreSQL** - Banco de dados relacional para armazenar provedores e mensagens.
- **Docker** - Facilita a execução e implantação do projeto.
- **Use Cases** - Arquitetura baseada em casos de uso para melhor organização do código.
- **CI/CD Pipeline** - Deploy automático configurado para facilitar a entrega contínua. (Deploy em VPS com coolify e em VPS sem painel via ssh)

## 📦 Instalação e Execução

### 🔹 Executando com Node.js

```bash
git clone https://github.com/WalissonPires/MessagingApi.git

cd MessagingApi

npm install

cp .env.example .env

npm run migrate

npm run dev
```

### 🐳 Executando com Docker

```bash
docker build -t messaging:latest .

docker tag messaging:latest registry.dev.wprm.com.br/messaging:latest

sudo docker push registry.dev.wprm.com.br/messaging:latest

docker run -d -p 5000:3000 \
  -e JWT_SECRET="MY-SECRET" \
  -e DATABASE_URL="postgres://postgres:masterkey@127.0.0.1/messaging" \
  messaging:latest
```

## 🛠 Uso da API

Para utilizar a API é necessário seguir o seguinte fluxo:

- Criar uma conta na API;
- Autenticar-se na API;
- Cadastrar um provedor;
- Configurar o acesso ao provedor;
  - No caso do WhatsApp, é necessário chamar o endpoint de inicialização e em seguida o endpoint de status, que irá retornar o QR Code para leitura com o aplicativo do WhatsApp.
- Enviar mensagens.

### 📌 Autenticação

Para utilizar a API, é necessário obter um token de autenticação. Para isso, cadastre-se na API e em seguida faça login.

### 📌 Cadastro de Provedor

É possível enviar mensagens para vários provedores. Portanto o primeiro passo é cadastrar um provedor. Após o cadastro, é necessário configurar o acesso ao provedor. No caso do **WhatsApp**, é preciso ler o QR Code com o aplicativo. Com o provedor cadastrado e configurado, é possível enviar as mensagens.

### 📤 Envio de Mensagem

#### **Exemplo de requisição via cURL**

```sh
curl --location 'http://127.0.0.1:3000/messages' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data '{
    "to": "553398800110011",
    "content": "Hello",
    "medias": [{
        "mimeType": "image/png",
        "fileBase64": "R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=",
        "label": "minha imagem"
    }],
    "providers": [{
        "id": 1
    }]
}'
```

## 🤖 Chatbot

É possível configurar um chatbot para responder a mensagens recebidas. O chatbot é responsável por processar as mensagens recebidas e responder de acordo com as regras configuradas. O fluxo de mensagens é definido por uma árvore de nós.

```json
{
  "chatbotActive": true,
  "chatbotMessages": {
    "id": "inicial",
    "label": "menu",
    "patternType": 5,
    "pattern": ".*",
    "output": [
      {
        "type": "text",
        "content": "Menu:\n1 - Sobre o aplicativo\n2 - Como contratar\n3 - Suporte\nEscolha uma opção acima!"
      }
    ],
    "childs": [
      {
        "id": "sobre",
        "label": "1 - Sobre",
        "patternType": 4,
        "pattern": "1",
        "output": [
          {
            "type": "text",
            "content": "App para envio de notificações e chatbot do whatsapp"
          }
        ],
        "childs": []
      },
      {
        "id": "suporte",
        "label": "2 - Suporte",
        "patternType": 4,
        "pattern": "2",
        "output": [
          {
            "type": "text",
            "content": "1 - Esqueceu a senha?\n2 - Outros"
          }
        ],
        "childs": [
          {
            "id": "senha",
            "label": "1 - Senha",
            "patternType": 4,
            "pattern": "1",
            "output": [
              {
                "type": "text",
                "content": "Acesse o link e redefina a senha https://test.wprmdev.com/senha"
              }
            ],
            "childs": []
          },
          {
            "id": "outros",
            "label": "2 - Outros",
            "patternType": 4,
            "pattern": "2",
            "output": [
              {
                "type": "text",
                "content": "Descreva seu problema e envie Pronto quando terminar"
              }
            ],
            "childs": [
              {
                "id": "pronto",
                "label": "Pronto",
                "patternType": 4,
                "pattern": "pronto",
                "output": [
                  {
                    "type": "text",
                    "content": "Logo entraremos em contato"
                  }
                ],
                "childs": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## 📑 Coleção de Endpoints (Postman)

A coleção completa de endpoints está disponível no arquivo [`postman.json`](./postman.json). Para importar no Postman:

1. Abra o Postman
2. Vá em **File** > **Import**
3. Selecione o arquivo `postman.json`

## ✅ Próximas Implementações

- Implementar endpoint de criação de conta (Atualmente não é permitido criar contas. A conta é registrada direto no banco)
- Permitir múltiplos ChatBots 🤖
- Implementação do suporte a **E-mail** 📧
- Implementação do suporte a **SMS** 📱
- Implementação do suporte a **Telegram** 💬
- Melhorias na documentação 📝