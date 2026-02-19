
# 🚀 Configuração Final: Supabase no Delivery Pira

Para que o app funcione online com Supabase, siga estes passos:

### 1. Criar as Tabelas (Obrigatório)
No painel do Supabase, vá em **SQL Editor** e execute o código SQL que forneci acima para criar as tabelas `restaurants`, `customers` e `orders`.

### 2. Ativar o Realtime
Vá em **Database > Replication**. Clique em **'supabase_realtime'** e marque as tabelas `restaurants` e `orders` para que elas possam enviar atualizações instantâneas.

### 3. Configurar Variáveis de Ambiente
Na sua hospedagem (Vercel, Netlify, etc), adicione estas chaves:

- `VITE_SUPABASE_URL`: (Seu Project URL)
- `VITE_SUPABASE_ANON_KEY`: (Sua Anon Key)

---

**✓ Pronto!** O app agora está usando PostgreSQL com Supabase, permitindo sincronização em tempo real de pedidos e cardápios.
