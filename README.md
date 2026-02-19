
# 🚀 Delivery Pira - Configuração do Banco de Dados

Seu projeto no Supabase já está conectado! Agora você precisa criar as tabelas para que o app possa salvar os dados.

### 1. Criar Tabelas
Vá no seu painel do Supabase, clique em **SQL Editor** (no menu esquerdo) e cole este código:

```sql
-- 1. Tabela de Restaurantes
CREATE TABLE IF NOT EXISTS restaurants (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  rating FLOAT DEFAULT 5.0,
  distance TEXT,
  "deliveryTime" TEXT,
  "deliveryFee" FLOAT,
  image TEXT,
  "isOpen" BOOLEAN DEFAULT true,
  address TEXT,
  "ownerEmail" TEXT,
  "adminPin" TEXT,
  "ownerName" TEXT,
  "paymentConfig" JSONB,
  menu JSONB DEFAULT '[]'
);

-- 2. Tabela de Clientes
CREATE TABLE IF NOT EXISTS customers (
  email TEXT PRIMARY KEY,
  name TEXT,
  phone TEXT,
  address TEXT,
  pin TEXT
);

-- 3. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  "restaurantId" TEXT REFERENCES restaurants(id),
  "restaurantName" TEXT,
  total FLOAT,
  items JSONB,
  status TEXT,
  "paymentMethod" TEXT,
  "paymentDetails" TEXT,
  "customerInfo" JSONB,
  timestamp BIGINT,
  date TEXT
);
```
Clique em **"Run"**.

### 2. Ativar Realtime (Muito importante para os pedidos!)
1. No menu lateral do Supabase, vá em **Database**.
2. Clique em **Replication**.
3. Clique em **'supabase_realtime'** (ou crie uma se não existir).
4. Clique em **"Edit tables"** ou no botão de engrenagem.
5. Marque as tabelas `restaurants` e `orders`.
6. Salve.

---

**✓ Agora o seu aplicativo está 100% operacional!** Teste fazendo um cadastro de cliente e depois tentando cadastrar uma loja.
