// ==========================================================
// Archivo: Techmarket.js
// Proyecto: MongoDB - TechMarket (Análisis de Productos Tecnológicos)
// Autor: Diego Fernando Hernandez Barrero
// ==========================================================


// ==========================================================
// 1. INSERCIÓN MASIVA DE 100 DOCUMENTOS
// ==========================================================
let nombresProductos = [
  "Monitor Curvo 27'' Pro", "Teclado Mecánico RGB V2", "Mouse Gamer Óptico X",
  "Portátil Ultra Slim i7", "Disco Sólido M.2 NVMe 1TB", "Memoria RAM DDR5 32GB",
  "Audífonos High Fidelity", "Cámara Web Full HD", "Router Mesh Pro AC1200",
  "Tarjeta Gráfica GTX 4080", "Cable USB-C Reforzado", "Power Bank Carga Rápida",
  "Base Refrigerante Laptop", "Adaptador USB-C a HDMI", "Proyector Smart 4K"
];
let nombresMarcas = ["TechGear", "InnovateX", "GigaByte", "CoreSync", "AuraTech"];
let nombresColores = ["Negro Cósmico", "Gris Espacial", "Blanco Glaciar", "Rojo Fuego", "Azul Eléctrico", "Verde Neón", "Titanio"];


for (let i = 1; i <= 100; i++) {
  let nombreBase = nombresProductos[Math.floor(Math.random() * nombresProductos.length)];
  let marcaAleatoria = nombresMarcas[Math.floor(Math.random() * nombresMarcas.length)];
  let colorAleatorio = nombresColores[Math.floor(Math.random() * nombresColores.length)];

  db.productos.insertOne({
    nombre: nombreBase + " (" + marcaAleatoria + ") - " + i,
    categoria: (i % 2 === 0 ? "Gamer" : "Accesorios"),
    precio: Math.floor(Math.random()*200000)+50000,
    stock: Math.floor(Math.random()*80)+10,
    marca: marcaAleatoria,
    especificaciones: {
      garantia_meses: (i % 3) + 6,
      color: colorAleatorio 
    },
    fecha_ingreso: new Date()
  });
}


// ==========================================================
// 2.CONSULTAS BÁSICAS 
// ==========================================================

// Inserción de un documento
db.productos.insertOne({
  nombre: "Mouse inalámbrico RGB",
  categoria: "Gamer",
  precio: 90000,
  stock: 25
})

// Selección de todos los documentos
db.productos.find();

// Selección mostrando campos específicos (Proyección)
db.productos.find({}, { nombre: 1, precio: 1, _id: 0 });

// Actualización de un documento
db.productos.updateOne(
  { nombre: "Mouse inalámbrico RGB" },
  { $set: { stock: 40 } }
)

// Eliminación de un documento
db.productos.deleteOne({ nombre: "Mouse inalámbrico RGB" });


// ==========================================================
// 3. CONSULTAS CON FILTROS Y OPERADORES 
// ==========================================================

// Precios mayores a 100.000 
db.productos.find({ precio: { $gt: 100000 } });

// Categorías específicas
db.productos.find({ categoria: { $in: ["Gamer", "Accesorios"] } });

// Búsqueda por nombre 
db.productos.find({ nombre: /Mouse|Monitor|SSD/i });


// ==========================================================
// 4.CONSULTAS DE AGREGACIÓN 
// ==========================================================

// Contar productos por categoría 
db.productos.aggregate([
  { $group: { _id: "$categoria", total: { $sum: 1 } } }
]);

// Promedio de precios por categoría 
db.productos.aggregate([
  { $group: { _id: "$categoria", precioPromedio: { $avg: "$precio" } } }
]);

// Valor total del inventario (Precio * Stock)
db.productos.aggregate([
  { $group: { _id: "$categoria",
    valorInventario: { $sum: { $multiply: ["$precio", "$stock"] } }
  } }
]);

// Top 5 productos más caros 
db.productos.aggregate([
  { $sort: { precio: -1 } },
  { $limit: 5 },
  { $project: { nombre: 1, precio: 1, _id: 0 } }
]);