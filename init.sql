-- Arquivo de inicialização do banco de dados
-- Este arquivo é executado automaticamente quando o container do PostgreSQL é criado

-- Criar extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Configurar timezone
SET timezone = 'America/Sao_Paulo';

-- Comentários sobre o banco
COMMENT ON DATABASE financas IS 'Sistema de controle financeiro pessoal';

-- Criar schema se necessário (o Prisma criará as tabelas)
-- As tabelas serão criadas pelo Prisma Migrate