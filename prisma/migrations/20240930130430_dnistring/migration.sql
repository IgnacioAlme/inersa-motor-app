/*
  Warnings:

  - The primary key for the `Cliente` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "dni" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL
);
INSERT INTO "new_Cliente" ("apellido", "direccion", "dni", "email", "nombre", "telefono") SELECT "apellido", "direccion", "dni", "email", "nombre", "telefono" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE TABLE "new_Vehiculo" (
    "matricula" TEXT NOT NULL PRIMARY KEY,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER,
    "clienteDni" TEXT NOT NULL,
    CONSTRAINT "Vehiculo_clienteDni_fkey" FOREIGN KEY ("clienteDni") REFERENCES "Cliente" ("dni") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Vehiculo" ("anio", "clienteDni", "marca", "matricula", "modelo") SELECT "anio", "clienteDni", "marca", "matricula", "modelo" FROM "Vehiculo";
DROP TABLE "Vehiculo";
ALTER TABLE "new_Vehiculo" RENAME TO "Vehiculo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
