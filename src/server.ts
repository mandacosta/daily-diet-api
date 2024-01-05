import { app } from './app'

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log(`Rodando na porta 3000!`)
  })
