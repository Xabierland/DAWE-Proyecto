
// Carrito de compra
const carrito = new Map();

export function obtenerCarrito() {
   return carrito;
}

export function agregarAlCarrito(productoId) {
   const producto = listaProductos.find(p => p.id === productoId);
   if (!producto) return false;
   
   if (carrito.has(productoId)) {
       const cantidad = carrito.get(productoId).cantidad;
       if (cantidad >= 20) return false;
       carrito.get(productoId).cantidad++;
   } else {
       carrito.set(productoId, {
           nombre: producto.nombre,
           precio: producto.precio,
           imagen: producto.imagen,
           cantidad: 1
       });
   }
   return true;
}

export function actualizarCantidadCarrito(productoId, cantidad) {
    if (!carrito.has(productoId)) return false;
    if (cantidad <= 0) {
        carrito.delete(productoId);
    } else if (cantidad <= 20) {
        carrito.get(productoId).cantidad = cantidad;
    }
    return true;
 }