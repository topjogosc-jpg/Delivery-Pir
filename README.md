
# 🚀 Delivery Pira - Configuração de Banco de Dados

Para o aplicativo funcionar em todos os celulares salvando os dados, você deve configurar o Firebase:

### 1. Criar o Projeto no Firebase
1. Acesse [console.firebase.google.com](https://console.firebase.google.com/).
2. Clique em **"Adicionar Projeto"** e dê o nome de `Delivery Pira`.
3. No menu lateral, vá em **Build > Firestore Database** e clique em **"Criar Banco de Dados"**.
4. Escolha **"Iniciar no modo de teste"** (para que todos possam ler/escrever inicialmente) e escolha a região mais próxima (ex: `southamerica-east1`).

### 2. Obter as Chaves
1. Vá na engrenagem ⚙️ (Configurações do Projeto).
2. Na aba **"Geral"**, role até o fim e clique no ícone `< >` (Web App).
3. Registre o app como `Delivery Pira Web`.
4. Copie os valores do objeto `firebaseConfig`.

### 3. Configurar na Vercel
No painel da Vercel, adicione as seguintes variáveis de ambiente:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Pronto! Agora seu app está "vivo" e os pedidos serão salvos nas nuvens.
