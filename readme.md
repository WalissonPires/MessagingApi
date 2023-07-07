# Debug no VS Code

- Execute o projeto com `npm run dev`;
- Na parte de debug do vscode selecione **Attach by Process ID** e clique em iniciar;
- No popup que aparecer selecione o processo do **ts-node-dev**;
- Agora basta marca os ponto de interrupição.

# Database

Para adicionar uma migração execute:

```sh
npx prisma migrate dev --name migration-name
```

Para gerar o client execute:
```
npx prisma generate
```

