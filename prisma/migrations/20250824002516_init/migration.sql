-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "criada_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "receitas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "data" DATETIME NOT NULL,
    "criada_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizada_em" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "despesas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descricao" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "data" DATETIME NOT NULL,
    "criada_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizada_em" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "receita_tags" (
    "receitaId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("receitaId", "tagId"),
    CONSTRAINT "receita_tags_receitaId_fkey" FOREIGN KEY ("receitaId") REFERENCES "receitas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "receita_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "despesa_tags" (
    "despesaId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("despesaId", "tagId"),
    CONSTRAINT "despesa_tags_despesaId_fkey" FOREIGN KEY ("despesaId") REFERENCES "despesas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "despesa_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_nome_key" ON "tags"("nome");
