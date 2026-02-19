
# 🚀 Guia de Ativação Online - Delivery Pira

Siga estes passos para que os pedidos apareçam em tempo real no painel do vendedor:

### 1. Configurar o Firestore (Onde os dados ficam)
1. No [Console do Firebase](https://console.firebase.google.com/), entre no seu projeto.
2. Clique em **Firestore Database** no menu lateral.
3. Clique em **Regras (Rules)** no topo.
4. Substitua o código que estiver lá por este (permite que qualquer um peça sem login complicado no início):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
5. Clique em **Publicar**.

### 2. Adicionar as Chaves ao App
No seu painel de hospedagem (Vercel/Netlify), adicione estas chaves com os valores que você pegou no Passo 3 das configurações do projeto:

- `VITE_FIREBASE_API_KEY`: (Sua API Key)
- `VITE_FIREBASE_PROJECT_ID`: (Seu Project ID)
- `VITE_FIREBASE_AUTH_DOMAIN`: (Seu Auth Domain)
- `VITE_FIREBASE_APP_ID`: (Seu App ID)

### 3. Reiniciar o Site
Depois de salvar as chaves, faça um novo "Deploy" ou apenas atualize a página. Se a faixa amarela **"Modo Offline"** desaparecer, você está ONLINE!

**Delivery Pira - O Delivery Oficial de Pirapemas.**
