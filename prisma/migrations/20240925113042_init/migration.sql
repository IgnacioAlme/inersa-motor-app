-- CreateTable
CREATE TABLE "Cliente" (
    "dni" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "matricula" TEXT NOT NULL PRIMARY KEY,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER,
    "clienteDni" INTEGER NOT NULL,
    CONSTRAINT "Vehiculo_clienteDni_fkey" FOREIGN KEY ("clienteDni") REFERENCES "Cliente" ("dni") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Repuesto" (
    "codigo" TEXT NOT NULL PRIMARY KEY,
    "distribuidor" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "marca_auto" TEXT DEFAULT 'UNIVERSAL',
    "precio" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Revision" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "detalles" TEXT,
    "presupuesto" REAL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehiculoId" TEXT NOT NULL,
    CONSTRAINT "Revision_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo" ("matricula") ON DELETE RESTRICT ON UPDATE CASCADE
);
