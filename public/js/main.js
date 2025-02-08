import { obtenerProductos, agregarNuevoProducto } from './tienda.js';
import { agregarAlCarrito, actualizarCantidadCarrito } from './carrito.js';

class PaginacionProductos {
   constructor(productosPerPage = 9) {
       this.productos = obtenerProductos();
       this.productosFiltrados = [...this.productos];
       this.productosPerPage = productosPerPage;
       this.currentPage = 1;
       this.setupBuscador();
       this.setupCarrito();
       this.setupAside();
       this.renderizarProductos();
       this.setupEventListeners();
   }

   setupBuscador() {
       const searchInput = document.getElementById('searchInput');
       searchInput.addEventListener('input', (e) => {
           const searchTerm = e.target.value.toLowerCase();
           this.filtrarProductos(searchTerm);
           this.updateTitle(searchTerm);
           this.currentPage = 1;
           this.renderizarProductos();
       });
   }

   

   setupAside() {
    console.log("vbbbbbbbbbbbbbbbbbbbbb");
    const typeInput = document.getElementById('productType');
    typeInput.addEventListener("change", (e) => 
        {
            console.log("aaaaaaaaaaaaaaaaaaaaaaa");
            
            var val = document.getElementById('productType').value

            const inputs = document.getElementById('optionalInput');           
            inputs.innerHTML = '';

            switch(val) {
                case 'libro_Fisico':
                    inputs.innerHTML += 
                    `
                    
                                <div class="mb-3">
                                    <label for="optionalInputAutor" class="form-label">Autor:</label>
                                    <input type="text" class="form-control" id="optionalInputAutor" placeholder="Nombre Apellido" required>
                                </div>
                                
    
                                <div class="mb-3">
                                    <label for="optionalInputIsbn" class="form-label">ISBN:</label>
                                    <input type="text" class="form-control" id="optionalInputIsbn" placeholder="ISBN" required>
                                </div>
    
    
                                <div class="mb-3">
                                    <label for="optionalInputPaginas" class="form-label">Número de páginas:</label>
                                    <input type="number" class="form-control" id="optionalInputPaginas" min="1" placeholder=0 required>
                                </div>
    
                    `;
                    break;

                case 'libro_Digital':
                    inputs.innerHTML += 
                    `
                    
                                <div class="mb-3">
                                    <label for="optionalInputAutor" class="form-label">Autor:</label>
                                    <input type="text" class="form-control" id="optionalInputAutor" placeholder="Nombre Apellido" required>
                                </div>
                                
    
                                <div class="mb-3">
                                    <label for="optionalInputIsbn" class="form-label">ISBN:</label>
                                    <input type="text" class="form-control" id="optionalInputIsbn" placeholder="ISBN" required>
                                </div>
    
    
                                <div class="mb-3">
                                    <label for="optionalInputPaginas" class="form-label">Número de páginas:</label>
                                    <input type="number" class="form-control" id="optionalInputPaginas" min="1" placeholder=0 required>
                                </div>
    
    
                                <div class="mb-3">
                                    <label for="optionalInputTamano" class="form-label">Tamaño (kb):</label>
                                    <input type="number" class="form-control" id="optionalInputPaginas" min="0" placeholder="0" required>
                                </div>
        

    
                    `;
                    break;

                case 'ereader':
                    inputs.innerHTML += 
                    `
                                <div class="mb-3">
                                    <label for="optionalInputResolucion" class="form-label">Resolución:</label>
                                    <input type="number" class="form-control" id="productName" placeholder="Ingrese la resolucion en ppp" required>
                                </div>
    
                    `;
                    break;

                case 'funda':
                    inputs.innerHTML += 
                    `
                                <div class="mb-3">
                                    <label for="optionalInputMaterial" class="form-label">Material:</label>
                                    <input type="text" class="form-control" id="productName" placeholder="Ingrese el material" required>
                                </div>     
                    `;
                    break;

                case 'marcapaginas':
                    inputs.innerHTML += 
                    `
                                <div class="mb-3">
                                    <label for="optionalInputColor" class="form-label">Color:</label>
                                    <input type="text" class="form-control" id="productName" placeholder="Ingrese el color" required>
                                </div>
                    `;
                    break;
                }
        }
    ); 
    
    const searchInput = document.getElementById('productForm');
    searchInput.addEventListener('input', (e) => {
        agregarNuevoProducto(e.target.productType, e.target)


        /*
        productType                
        libro_Digital
        ereader
        funda
        marcapaginas
        */
    });
}

   filtrarProductos(searchTerm) {
       if (!searchTerm) {
           this.productosFiltrados = [...this.productos];
       } else {
           this.productosFiltrados = this.productos.filter(producto => 
               producto.nombre.toLowerCase().includes(searchTerm)
           );
       }
   }

   updateTitle(searchTerm) {
       const mainTitle = document.getElementById('mainTitle');
       mainTitle.textContent = searchTerm ? `Buscando por: ${searchTerm}` : 'Todos los productos';
   }

   setupCarrito() {
       document.addEventListener('click', e => {
           const cartButton = e.target.closest('.btn-cart');
           if (cartButton) {
               const productId = cartButton.dataset.productId;
               if (agregarAlCarrito(productId)) {
                   this.mostrarToast(productId);
                   this.actualizarContadorCarrito();
               }
           }
       });
   }

   mostrarToast(productId) {
       const toast = document.querySelector(`[data-product-id="${productId}"] .toast`);
       const bsToast = new bootstrap.Toast(toast, { delay: 2000 });
       bsToast.show();
   }

   actualizarContadorCarrito() {
       const carrito = obtenerCarrito();
       const total = Array.from(carrito.values())
           .reduce((sum, item) => sum + item.cantidad, 0);
       document.querySelector('.cart-count').textContent = total;
   }

   renderizarProductos() {
       const gridContainer = document.getElementById('productsGrid');
       const paginatedProducts = this.getPaginatedProducts();
       
       gridContainer.innerHTML = '';
       
       paginatedProducts.forEach(producto => {
           const card = `
               <div class="col">
                   <div class="card h-100 position-relative">
                       <button class="btn btn-primary rounded-circle position-absolute end-0 top-0 m-2 btn-cart"
                               style="width: 40px; height: 40px;"
                               data-product-id="${producto.id}">
                           <i class="bi bi-cart-plus"></i>
                       </button>
                       
                       <div class="toast position-absolute end-0 top-0 m-2" role="alert">
                           <div class="toast-body bg-success text-white">
                               Añadido al carrito
                           </div>
                       </div>

                       <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                       <div class="card-body">
                           <h5 class="card-title text-truncate">${producto.nombre}</h5>
                           <p class="card-text description-truncate">${producto.descripcion}</p>
                           <p class="card-text"><strong>Precio: </strong>${producto.precio}€</p>
                           <p class="card-text"><small class="text-muted">${this.getExtraField(producto)}</small></p>
                       </div>
                   </div>
               </div>
           `;
           gridContainer.innerHTML += card;
       });

       this.renderPagination();
       this.updateProductCount();
   }

   getPaginatedProducts() {
       const startIndex = (this.currentPage - 1) * this.productosPerPage;
       const endIndex = startIndex + this.productosPerPage;
       return this.productosFiltrados.slice(startIndex, endIndex);
   }

   getExtraField(producto) {
       if (producto.isbn) return `ISBN: ${producto.isbn}`;
       if (producto.tamano) return `Tamaño: ${producto.tamano}`;
       if (producto.resolucion) return `Resolución: ${producto.resolucion}`;
       if (producto.material) return `Material: ${producto.material}`;
       if (producto.color) return `Color: ${producto.color}`;
       return '';
   }

   renderPagination() {
       const totalPages = Math.ceil(this.productosFiltrados.length / this.productosPerPage);
       const paginationContainer = document.createElement('nav');
       paginationContainer.innerHTML = `
           <div class="d-flex justify-content-between align-items-center">
               <p class="mb-2">Mostrando ${this.getPaginatedProducts().length} de ${this.productosFiltrados.length} productos</p>
           </div>
           <ul class="pagination justify-content-center">
               ${this.currentPage > 1 ? '<li class="page-item"><a class="page-link" href="#" data-page="prev">Anterior</a></li>' : ''}
               ${Array.from({length: totalPages}, (_, i) => i + 1).map(page => `
                   <li class="page-item ${page === this.currentPage ? 'active' : ''}">
                       <a class="page-link" href="#" data-page="${page}">${page}</a>
                   </li>
               `).join('')}
               ${this.currentPage < totalPages ? '<li class="page-item"><a class="page-link" href="#" data-page="next">Siguiente</a></li>' : ''}
           </ul>
       `;

       const mainElement = document.querySelector('main');
       const existingPagination = mainElement.querySelector('nav');
       if (existingPagination) {
           existingPagination.remove();
       }
       mainElement.appendChild(paginationContainer);
   }

   updateProductCount() {
       const start = (this.currentPage - 1) * this.productosPerPage + 1;
       const end = Math.min(this.currentPage * this.productosPerPage, this.productosFiltrados.length);
   }

   setupEventListeners() {
       document.addEventListener('click', (e) => {
           if (e.target.closest('.page-link')) {
               e.preventDefault();
               const pageData = e.target.dataset.page;
               
               if (pageData === 'prev') {
                   this.currentPage--;
               } else if (pageData === 'next') {
                   this.currentPage++;
               } else {
                   this.currentPage = parseInt(pageData);
               }
               
               this.renderizarProductos();
           }
       });
   }
}

document.addEventListener('DOMContentLoaded', () => {
   new PaginacionProductos();
});