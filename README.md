
# 🚀 Guia de Ativação Online - Delivery Pira

Para que seu app saia do "Modo Offline" e funcione em qualquer celular, siga estes 4 passos simples:

### 1. Criar o Projeto no Firebase (O "Coração" do App)
1. Acesse o [Console do Firebase](https://console.firebase.google.com/).
2. Clique em **"Adicionar projeto"**.
3. Nomeie como `Delivery Pira`.
4. Pode desativar o Google Analytics se quiser rapidez, ou deixar ativado (tanto faz).
5. Clique em **"Criar projeto"**.

### 2. Ativar o Banco de Dados (Onde ficam os pedidos)
1. No menu à esquerda, clique em **Build** > **Firestore Database**.
2. Clique em **"Criar banco de dados"**.
3. Escolha **"Iniciar no modo de teste"** (Isso é importante para o app conseguir ler/escrever sem travas iniciais).
4. Clique em **Próximo** e escolha a região `southamerica-east1` (São Paulo/Brasil).
5. Clique em **Ativar**.

### 3. Obter suas Chaves de Acesso
1. Na engrenagem ⚙️ (ao lado de "Visão geral do projeto"), clique em **Configurações do projeto**.
2. Na aba **Geral**, role até o final (seção "Seus aplicativos").
3. Clique no ícone de código `</>` (Web).
4. Apelide como `App Pira` e clique em **Registrar app**.
5. O Firebase vai te mostrar um código com `apiKey`, `projectId`, etc. **Copie esses valores**.

### 4. Conectar ao App (Hospedagem)
Se você estiver usando a **Vercel** ou **Netlify** para hospedar seu site:
1. Vá nas configurações do seu projeto na Vercel (**Settings** > **Environment Variables**).
2. Adicione cada uma destas chaves com os valores que você copiou:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

---

### 📱 Como testar se funcionou?
Abra o link do seu app no celular. Se a faixa amarela **"Modo Offline"** desaparecer, parabéns! Seu app agora é uma plataforma real de delivery.

**Dúvidas?** Fale com o suporte no WhatsApp configurado na Landing Page!
