import { obtenerProductos, agregarNuevoProducto, obtenerCarrito } from './tienda.js';

class Tienda 
{
    constructor() {
        // Lista de los productos
        this.productos = obtenerProductos();
        // Copia de los productos para poder filtrar
        this.productosFiltrados = [...this.productos];
        // Número de productos por página
        this.productosPerPage = 6;
        // Página por defecto
        this.currentPage = 1;
        // Variable que guarde el carrito
        //! En el enunciado pone que los productos se añade en el carrito creado en tienda.js
        //! Como tal, obtenerCarrito() manda un puntero a la variable carrito en tienda.js
        //! Por lo que añadir o modificar this.carrito afecta a la variable carrito en tienda.js
        //! Por lo que entiendo que cumplo con el enunciado
        this.carrito = obtenerCarrito();
        // Número máximo de copias de un producto en el carrito
        this.maxCopias = 20;
        // Valor minimo de precio
        this.minPrice = 0;
        // Valor maximo de precio
        this.maxPrice = 100000000000000;
    
        // Inicializamos el buscador
        this.mostrarBuscador();
        // Inicializamos el filtro
        this.mostrarFiltro();
        // Inicializamos el formulario
        this.mostrarFormulario();
        // Inicializamos el carrito
        this.mostrarCarrito();
        // Inicializamos la lista de productos
        this.mostrarProductos();
    }

    // ============================== Logica Filtro ==============================
    // Implementamos los tres tipos de filtros
    // 1. El filtro de tipo de producto
    // 2. El filtro de rango precio de precio
    // 3. El filtro de ordenar precios de mayor a menor o vicebersa
    // ============================== Logica Filtro ==============================
    mostrarFiltro() {
        // Obtener elementos del DOM
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        // 1. Filtro por tipo de producto
        dropdownMenu.querySelectorAll('[data-filter]').forEach(filterItem => {
            filterItem.addEventListener('click', (e) => {
                e.preventDefault();
                const filterValue = e.target.dataset.filter;
                
                // Reiniciar los productos filtrados
                if (filterValue === 'all') {
                    this.productosFiltrados = [...this.productos];
                } else {
                    // Filtrar usando el getter tipo
                    this.productosFiltrados = this.productos.filter(producto => {
                        return producto.tipo === filterValue;
                    });
                }
                
                // Actualizar la visualización
                this.currentPage = 1;
                this.mostrarProductos();
                
                // Actualizar el título
                const mainTitle = document.getElementById('mainTitle');
                if (filterValue === 'all') {
                    mainTitle.textContent = 'Todos los productos';
                } else {
                    const filterName = {
                        'libro_Fisico': 'Libros Físicos',
                        'libro_Digital': 'Libros Digitales',
                        'ereader': 'E-readers',
                        'funda': 'Fundas',
                        'marcapaginas': 'Marcapáginas'
                    }[filterValue] || filterValue;
                    
                    mainTitle.textContent = filterName;
                }
            });
        });
    
        // 2. Filtro de rango de precios
        const priceContainer = document.createElement('div');
        priceContainer.className = 'px-3';
        priceContainer.innerHTML = `
            <div class="price-inputs d-flex gap-2 mt-2">
                <div class="input-group input-group-sm">
                    <span class="input-group-text">€</span>
                    <input type="number" class="form-control" id="minPrice" placeholder="Min" min="0">
                </div>
                <div class="input-group input-group-sm">
                    <span class="input-group-text">€</span>
                    <input type="number" class="form-control" id="maxPrice" placeholder="Max" min="0">
                </div>
            </div>
        `;
        
        // Insertar después del divisor de precio
        const priceRangeLabel = dropdownMenu.querySelector('label[for="priceRangeMin"]');
        priceRangeLabel.parentNode.appendChild(priceContainer);
    
        // 3. Ordenar por precio
        const sortContainer = document.createElement('li');
        sortContainer.className = 'px-3';
        sortContainer.innerHTML = `
            <div class="btn-group btn-group-sm w-100">
                <button class="btn btn-outline-secondary" data-sort="asc">
                    <i class="bi bi-sort-numeric-down"></i> Menor precio
                </button>
                <button class="btn btn-outline-secondary" data-sort="desc">
                    <i class="bi bi-sort-numeric-up"></i> Mayor precio
                </button>
            </div>
        `;
        dropdownMenu.appendChild(sortContainer);
    
        // Obtener referencias a los inputs de precio
        const minInput = document.getElementById('minPrice');
        const maxInput = document.getElementById('maxPrice');
    
        // Función para aplicar filtros de precio
        const aplicarFiltroPrecio = () => {
            const min = Number(minInput.value) || 0;
            const max = Number(maxInput.value) || Number.MAX_SAFE_INTEGER;
            
            this.productosFiltrados = this.productos.filter(producto => 
                producto.precio >= min && producto.precio <= max
            );
            
            this.currentPage = 1;
            this.mostrarProductos();
        };
    
        // Eventos para los inputs de precio
        [minInput, maxInput].forEach(input => {
            input.addEventListener('change', () => {
                aplicarFiltroPrecio();
            });
        });
    
        // Eventos para ordenar por precio
        sortContainer.querySelectorAll('[data-sort]').forEach(button => {
            button.addEventListener('click', (e) => {
                const sortDirection = e.target.closest('[data-sort]').dataset.sort;
                
                this.productosFiltrados.sort((a, b) => {
                    return sortDirection === 'asc' 
                        ? a.precio - b.precio 
                        : b.precio - a.precio;
                });
                
                this.currentPage = 1;
                this.mostrarProductos();
            });
        });
    
        // Aplicar filtro inicial para mostrar todos los productos
        this.productosFiltrados = [...this.productos];
        this.mostrarProductos();
    }
    
    // ============================== Logica Buscador ==============================
    // Crea el elemento buscador y añade un evento input para filtrar los productos
    mostrarBuscador() {
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            this.filtrarProductos(searchTerm);
            this.actualizarTituloBuscador(searchTerm);
            this.currentPage = 1;
            this.mostrarProductos();
        });
    }

    // Busca los productos que coincidan con el término de búsqueda
    filtrarProductos(searchTerm) {
        if (!searchTerm) {
            this.productosFiltrados = [...this.productos];
        } else {
            this.productosFiltrados = this.productos.filter(producto => 
                producto.nombre.toLowerCase().includes(searchTerm)
            );
        }
    }

    // Actualiza el título principal de la página al buscar
    actualizarTituloBuscador(searchTerm) {
        const mainTitle = document.getElementById('mainTitle');
        mainTitle.textContent = searchTerm ? `Buscando por: ${searchTerm}` : 'Todos los productos';
    }

    // ============================== Logica Formulario DE ASIDE  ==============================
    // Logica del formulario
    mostrarFormulario() {
        // Inicializar el select de tipo
        const typeInput = document.getElementById('productType');
        typeInput.selectedIndex = 0;
        
        // Agregar evento para detectar cambios en el tipo
        typeInput.addEventListener('change', renderizarFormulario);

        // Obtener referencias a elementos
        const productImageInput = document.getElementById("productImage");
        const dropbox = document.getElementById("dragDropArea");
        const dropText = document.getElementById("dropText");
        const originalText = dropText.textContent;

        // Configurar validaciones del input
        if (productImageInput) {
            productImageInput.accept = 'image/jpeg,image/jpg,image/png';
            
            productImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (!validarArchivo(file)) {
                        e.target.value = '';  // Limpiar el input si no es válido
                        return;
                    }
                    
                    dropText.textContent = "¡Elemento añadido!";
                    setTimeout(() => {
                        dropText.textContent = originalText;
                        dropbox.classList.remove("hover");
                    }, 2000);
                }
            });
        }

        // Configuración del drag & drop
        dropbox.addEventListener("dragenter", handleDragOver);
        dropbox.addEventListener("dragleave", handleDragOut);
        dropbox.addEventListener("dragover", handleDragOver);
        dropbox.addEventListener("drop", handleFileDrop);

        function validarArchivo(file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            
            if (!validTypes.includes(file.type)) {
                mostrarMensaje('error', 'Solo se aceptan archivos JPG/JPEG o PNG');
                return false;
            }
            
            return true;
        }

        function handleDragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            dropbox.classList.add("hover");
        }

        function handleDragOut(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            dropbox.classList.remove("hover");
        }

        function handleFileDrop(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            dropbox.classList.remove("hover");

            const files = evt.dataTransfer.files;

            // Validar cantidad de archivos
            if (files.length > 1) {
                mostrarMensaje('error', 'Solo se puede añadir un fichero');
                return;
            }

            const file = files[0];
            if (!validarArchivo(file)) {
                return;
            }

            // Asignar el archivo al input y disparar el evento change
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            productImageInput.files = dataTransfer.files;
            
            // Disparar el evento change manualmente para que se ejecuten las validaciones del input
            const changeEvent = new Event('change', { bubbles: true });
            productImageInput.dispatchEvent(changeEvent);
        }
    
        function mostrarMensaje(tipo, mensaje) {
            const form = document.getElementById("productForm");
            if (!form) return;
    
            const mensajeElement = document.createElement('div');
            mensajeElement.className = `alert alert-${tipo === 'error' ? 'danger' : 'success'} mt-2 mb-0`;
            mensajeElement.textContent = mensaje;
    
            form.appendChild(mensajeElement);
    
            setTimeout(() => {
                mensajeElement.remove();
            }, 1500);
        }
    
        function limpiarFormulario() {
            const form = document.getElementById("productForm");
            if (productImageInput) {
                productImageInput.value = '';
            }
            form.reset();
            renderizarFormulario();
        }
    
        function renderizarFormulario() {
            const tipo = document.getElementById('productType').value;
            const contenedorInputs = document.getElementById('optionalInput');
            contenedorInputs.innerHTML = '';
    
            if (!tipo) return;
    
            // Cambiar los placeholders de los campos principales segun el tipo de producto
            if (tipo === 'libro_Fisico') {
                document.getElementById('productName').placeholder = "Ej: El Señor de los Anillos";
                document.getElementById('productPrice').placeholder = "Ej: 19.99";
                document.getElementById('productDescription').placeholder = "Describe el producto detalladamente...";
            }
            else if (tipo === 'libro_Digital') {
                document.getElementById('productName').placeholder = "Ej: Juego de Tronos";
                document.getElementById('productPrice').placeholder = "Ej: 9.99";
                document.getElementById('productDescription').placeholder = "Describe el producto detalladamente...";
            }
            else if (tipo === 'ereader') {
                document.getElementById('productName').placeholder = "Ej: Kindle Paperwhite";
                document.getElementById('productPrice').placeholder = "Ej: 129.99";
                document.getElementById('productDescription').placeholder = "Describe el producto detalladamente...";
            }
            else if (tipo === 'funda') {
                document.getElementById('productName').placeholder = "Ej: Funda de cuero para Kindle";
                document.getElementById('productPrice').placeholder = "Ej: 24.99";
                document.getElementById('productDescription').placeholder = "Describe el producto detalladamente...";
            }
            else if (tipo === 'marcapaginas') {
                document.getElementById('productName').placeholder = "Ej: Marcapáginas magnético";
                document.getElementById('productPrice').placeholder = "Ej: 3.99";
                document.getElementById('productDescription').placeholder = "Describe el producto detalladamente...";
            }

            const camposExtra = {
                'libro_Fisico': `
                    <div class="mb-3">
                        <label for="optionalInputAutor" class="form-label">Autor:</label>
                        <input type="text" class="form-control" id="optionalInputAutor" placeholder="Ej: J.R.R. Tolkien" required>
                    </div>
                    <div class="mb-3">
                        <label for="optionalInputIsbn" class="form-label">ISBN:</label>
                        <input type="number" class="form-control" id="optionalInputIsbn" placeholder="Ej: 9788445077566" required>
                    </div>
                    <div class="mb-3">
                        <label for="optionalInputPaginas" class="form-label">Número de páginas:</label>
                        <input type="number" min="1" class="form-control" id="optionalInputPaginas" placeholder="Ej: 392" required>
                    </div>
                `,
                'libro_Digital': `
                    <div class="mb-3">
                        <label for="optionalInputAutor" class="form-label">Autor:</label>
                        <input type="text" class="form-control" id="optionalInputAutor" placeholder="Ej: George R.R. Martin" required>
                    </div>
                    <div class="mb-3">
                        <label for="optionalInputIsbn" class="form-label">ISBN:</label>
                        <input type="number" class="form-control" id="optionalInputIsbn" placeholder="Ej: 9788401032141" required>
                    </div>
                    <div class="mb-3">
                        <label for="optionalInputPaginas" class="form-label">Número de páginas:</label>
                        <input type="number" min="1" class="form-control" id="optionalInputPaginas" placeholder="Ej: 842" required>
                    </div>
                    <div class="mb-3">
                        <label for="optionalInputTamano" class="form-label">Tamaño (KiB):</label>
                        <input type="number" min="0" class="form-control" id="optionalInputTamano" placeholder="Ej: 2048" required>
                    </div>
                `,
                'ereader': `
                    <div class="mb-3">
                        <label for="optionalInputResolucion" class="form-label">Resolución:</label>
                        <input type="number" min="1" class="form-control" id="optionalInputResolucion" placeholder="Ej: 300 PPP" required>
                    </div>
                `,
                'funda': `
                    <div class="mb-3">
                        <label for="optionalInputMaterial" class="form-label">Material:</label>
                        <input type="text" class="form-control" id="optionalInputMaterial" placeholder="Ej: Cuero, Silicona, Tela" required>
                    </div>
                `,
                'marcapaginas': `
                    <div class="mb-3">
                        <label for="optionalInputColor" class="form-label">Color:</label>
                        <input type="text" class="form-control" id="optionalInputColor" placeholder="Ej: Rojo, Azul marino, Verde esmeralda" required>
                    </div>
                `
            };

            // Mostrar campos extra según el tipo
            if (camposExtra[tipo]) {
                contenedorInputs.innerHTML = camposExtra[tipo];
            }
        }
    
        // Manejar envío del formulario
        const formulario = document.getElementById('productForm');
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
    
            const tipo = document.getElementById('productType').value;
            if (!tipo) {
                mostrarMensaje('error', 'Debe seleccionar un tipo de producto');
                return false;
            }
    
            const datos = {
                nombre: document.getElementById('productName').value,
                precio: parseFloat(document.getElementById('productPrice').value),
                descripcion: document.getElementById('productDescription').value || ''
            };
    
            // Validar precio
            if (datos.precio < 0) {
                mostrarMensaje('error', 'El precio no puede ser negativo');
                return setTimeout(() => {
                    document.getElementById('productPrice').value = '';
                }, 1500);
            }
    
            // Obtener imagen
            const inputFile = document.getElementById('productImage');
            datos.imagen = inputFile.files.length > 0 
                ? URL.createObjectURL(inputFile.files[0])
                : 'img/default.png';
    
            // Obtener campos específicos según el tipo
            //! NOTA DE XABIER: Lo de que te deje poner dos case seguidos sin el break para que se junten y luego hacer un if para diferenciarlos es una cosa que solo podria pasar con javascript JAJAJA
            switch (tipo) {
                case 'libro_Fisico':
                case 'libro_Digital':
                    datos.autor = document.getElementById('optionalInputAutor').value;
                    datos.isbn = document.getElementById('optionalInputIsbn').value;
                    datos.paginas = parseInt(document.getElementById('optionalInputPaginas').value);
                    if (tipo === 'libro_Digital') {
                        datos.tamano = parseInt(document.getElementById('optionalInputTamano').value);
                    }
                    break;
                case 'ereader':
                    datos.resolucion = parseInt(document.getElementById('optionalInputResolucion').value);
                    break;
                case 'funda':
                    datos.material = document.getElementById('optionalInputMaterial').value;
                    break;
                case 'marcapaginas':
                    datos.color = document.getElementById('optionalInputColor').value;
                    break;
            }
    
            // Crear nuevo producto
            const exito = agregarNuevoProducto(tipo, datos);
            
            if (exito) {
                mostrarMensaje('success', '¡Producto añadido correctamente!');
                this.productos = obtenerProductos();
                this.productosFiltrados = [...this.productos];
                this.mostrarProductos();
                // Retrasamos la limpieza del formulario para que se vea el mensaje
                return setTimeout(() => {
                    limpiarFormulario();
                }, 1500);
            } 
            
            mostrarMensaje('error', 'Error al añadir el producto');
            return;
        });
    
        // Limpiar el formulario al inicio
        limpiarFormulario();
    }

    // ============================== Logica Productos ==============================
    // Obtener los productos de la página actual
    mostrarProductos() {
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
                            <i class="bi bi-cart-plus-fill"></i>
                        </button>
    
                        <img src="${producto.imagen}" 
                             class="card-img-top producto-imagen" 
                             alt="${producto.nombre}"
                             data-product-id="${producto.id}"
                             style="cursor: pointer;">
                        <div class="card-body">
                            <h5 class="card-title text-truncate">${producto.nombre}</h5>
                            <p class="card-text"><strong>Precio: </strong>${producto.precio}€</p>
                            <p class="card-text"><small class="text-muted">${this.getExtraField(producto)}</small></p>
                            <p class="card-text description-truncate">${producto.descripcion.length > 100 ? producto.descripcion.substring(0, 100) + '...' : producto.descripcion}</p>
                        </div>
                    </div>
                </div>
            `;
            gridContainer.innerHTML += card;
        });
    
        // Añadir evento click a las imágenes
        document.querySelectorAll('.producto-imagen').forEach(img => {
            img.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const producto = this.productos.find(p => p.id === productId);
                this.mostrarDetallesProducto(producto);
            });
        });
    
        this.renderPagination();
        this.updateProductCount();
    }
    
    // ============================== Logica Carrito ==============================
    // Mostrar el carrito y añadir eventos
    mostrarCarrito() {
        // Evento para botones de añadir al carrito
        document.addEventListener('click', (e) => {
            const cartButton = e.target.closest('.btn-cart');
            if (cartButton) {
                const productId = cartButton.dataset.productId;
                this.agregarAlCarrito(productId);
            }
        });

        // Evento para cambios en la cantidad de productos
        document.getElementById('cartItems').addEventListener('change', (e) => {
            if (e.target.classList.contains('product-quantity')) {
                const productId = e.target.dataset.productId;
                const newQuantity = parseInt(e.target.value);
                this.actualizarCantidad(productId, newQuantity);
            }
        });
    }

    // Agregar un producto al carrito mediante los botones de añadir
    agregarAlCarrito(productId) {
        const producto = this.productos.find(p => p.id === productId);
        if (!producto) return;
    
        if (this.carrito.has(productId)) {
            const item = this.carrito.get(productId);
            if (item.cantidad < this.maxCopias) {
                item.cantidad++;
                this.mostrarMensajeExito(productId);
            } else {
                this.mostrarMensajeError(productId);
            }
        } else {
            // Dice incluir unicamente estos valores y por eso he cambiado el producto: producto por producto.nombre, producto.precio, producto.imagen
            this.carrito.set(productId, {
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: producto.imagen,
                cantidad: 1
            });
            this.mostrarMensajeExito(productId);
        }
    
        this.actualizarCarritoUI();
        this.actualizarContadorCarrito();
    }

    // Actualizar la cantidad de un producto en el carrito
    actualizarCantidad(productId, newQuantity) {
        if (!this.carrito.has(productId)) return;

        if (newQuantity <= 0) {
            this.carrito.delete(productId);
        } else if (newQuantity > this.maxCopias) {
            this.mostrarMensajeMaximoCopias(productId);
            const input = document.querySelector(`input[data-product-id="${productId}"]`);
            // Restaurar la cantidad anterior
            if (input) input.value = this.carrito.get(productId).cantidad;
            return;
        } else {
            this.carrito.get(productId).cantidad = newQuantity;
        }

        this.actualizarCarritoUI();
        this.actualizarContadorCarrito();
    }

    // Actualizar la interfaz del carrito
    actualizarCarritoUI() {
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        let total = 0;
    
        cartItems.innerHTML = '';
    
        this.carrito.forEach((item, productId) => {
            const subtotal = item.precio * item.cantidad; // Cambiado a item.precio
            total += subtotal;
    
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item mb-3 border-bottom pb-3';
            itemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.imagen}" // Cambiado a item.imagen
                         alt="${item.nombre}" // Cambiado a item.nombre
                         class="cart-item-image me-3" 
                         style="width: 100px; height: 100px; object-fit: cover;">
                    <div class="cart-item-details flex-grow-1">
                        <h6 class="mb-1">${item.nombre}</h6> <!-- Cambiado a item.nombre -->
                        <p class="mb-1">Precio: ${item.precio}€</p> <!-- Cambiado a item.precio -->
                        <div class="d-flex align-items-center mb-1">
                            <label class="me-2">Cantidad:</label>
                            <input type="number" 
                                   class="form-control form-control-sm product-quantity" 
                                   value="${item.cantidad}"
                                   min="0"
                                   max="${this.maxCopias}+1"
                                   style="width: 70px"
                                   data-product-id="${productId}">
                        </div>
                        <p class="mb-1">Subtotal: ${subtotal.toFixed(2)}€</p>
                    </div>
                    <button class="btn btn-danger btn-sm remove-item" data-product-id="${productId}" title="Eliminar producto">x</button>
                </div>
            `;
            
            // Resto del código permanece igual...
            const removeButton = itemElement.querySelector('.remove-item');
            removeButton.addEventListener('click', () => {
                this.actualizarCantidad(productId, 0);
            });
    
            cartItems.appendChild(itemElement);
        });
        
        cartTotal.textContent = total.toFixed(2);
    }

    // Actualizar el contador del carrito en el navbar
    actualizarContadorCarrito() {
        const cartCount = document.querySelector('.cart-count');
        let totalItems = 0;
        this.carrito.forEach(item => totalItems += item.cantidad);
        cartCount.textContent = totalItems;
    }

    // Mostrar mensaje de éxito al añadir al carrito
    mostrarMensajeExito(productId) 
    {
        const button = document.querySelector(`.card button[data-product-id="${productId}"]`);
        if (!button) return;  

        const successMessage = document.createElement('div');
        successMessage.className = 'position-absolute top-0 end-0 m-2 alert alert-success';
        successMessage.style.zIndex = '1000';
        successMessage.textContent = '¡Añadido al carrito!';
      
        button.parentElement.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
        }, 1500);

        
    } 

    // Mostrar mensaje de error al añadir al carrito
    mostrarMensajeError(productId) {
        const button = document.querySelector(`.card button[data-product-id="${productId}"]`);
        if (!button) return;

        const errorMessage = document.createElement('div');
        errorMessage.className = 'position-absolute top-0 end-0 m-2 alert alert-danger';
        errorMessage.style.zIndex = '1000';
        errorMessage.textContent = '¡Máximo de copias alcanzado!';

        button.parentElement.appendChild(errorMessage);

        setTimeout(() => {
            errorMessage.remove();
        }, 1500);
    }

    // Mostrar mensaje de máximo de copias alcanzado
    mostrarMensajeMaximoCopias(productId) {
        const cartItem = document.querySelector(`[data-product-id="${productId}"]`).closest('.cart-item');
        if (!cartItem) return;

        const errorMessage = document.createElement('div');
        errorMessage.className = 'alert alert-danger mt-2 mb-0';
        errorMessage.textContent = '¡Máximo de copias alcanzado!';

        cartItem.appendChild(errorMessage);

        setTimeout(() => {
            errorMessage.remove();
        }, 1500);
    }
    // ============================== Logica Descripción extendida ==============================
    mostrarDetallesProducto(producto) {
        // Eliminar modal anterior si existe
        const modalAnterior = document.querySelector('.modal-producto');
        if (modalAnterior) {
            modalAnterior.remove();
        }
    
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1050;
        `;
    
        // Crear modal
        const modal = document.createElement('div');
        modal.className = 'modal-producto card bg-dark text-light';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 2rem;
            border-radius: 8px;
            z-index: 1051;
            width: 90%;
            max-width: 1200px;
            max-height: 90vh;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.125);
        `;
    
        // Contenido del modal
        modal.innerHTML = `
            <div class="row h-100">
                <div class="col-md-6 d-flex align-items-center justify-content-center p-4">
                    <img src="${producto.imagen}" 
                         alt="${producto.nombre}" 
                         class="img-fluid rounded"
                         style="max-width: 100%; max-height: 70vh; object-fit: contain;">
                </div>
                <div class="col-md-6 producto-detalles" style="max-height: 70vh; overflow-y: auto;">
                    <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3"></button>
                    <!-- Nombre en H3 -->
                    <h3 class="display-6 mb-4 text-light">${producto.nombre}</h3>
                    <!-- Precios -->
                    <p class="h4 text-warning">Precio: ${producto.precio}€</p>
                    <!-- Campos extra -->
                    <p class="text-muted">${this.getExtraField(producto)}</p>
                    <!-- Descripción -->
                    <p class="lead">${producto.descripcion}</p>
                </div>
            </div>
        `;
    
        // Añadir evento para cerrar
        const cerrarModal = () => {
            document.body.classList.remove("overflow-hidden"); //desbloquea el scroll
            overlay.remove();
            modal.remove();
        };
    
        overlay.addEventListener('click', cerrarModal);
        modal.querySelector('.btn-close').addEventListener('click', cerrarModal);
    
        // Prevenir que el click en el modal cierre la ventana
        modal.addEventListener('click', (e) => e.stopPropagation());
    
        // Añadir elementos al DOM
        document.body.appendChild(overlay);
        document.body.classList.add("overflow-hidden"); //bloquea el scroll
        document.body.appendChild(modal);
    }

    // ============================== Logica Paginación ==============================
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

        // Añadir eventos de paginación
        paginationContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageData = e.target.dataset.page;
                
                if (pageData === 'prev' && this.currentPage > 1) {
                    this.currentPage--;
                } else if (pageData === 'next' && this.currentPage < totalPages) {
                    this.currentPage++;
                } else if (pageData !== 'prev' && pageData !== 'next') {
                    this.currentPage = parseInt(pageData);
                }
                
                this.mostrarProductos();
            });
        });

        const mainElement = document.querySelector('main');
        const existingPagination = mainElement.querySelector('nav');
        if (existingPagination) {
            existingPagination.remove();
        }
        mainElement.appendChild(paginationContainer);
    }
    
    getPaginatedProducts() {
        const startIndex = (this.currentPage - 1) * this.productosPerPage;
        const endIndex = startIndex + this.productosPerPage;
        return this.productosFiltrados.slice(startIndex, endIndex);
    }

    updateProductCount() {
        const start = (this.currentPage - 1) * this.productosPerPage + 1;
        const end = Math.min(this.currentPage * this.productosPerPage, this.productosFiltrados.length);
        return { start, end };
    }

   // ============================== Utilidades ==============================
    getExtraField(producto) {
        if (producto.isbn) return `ISBN: ${producto.isbn}`;
        if (producto.tamano) return `Tamaño: ${producto.tamano}KiB`;
        if (producto.resolucion) return `Resolución: ${producto.resolucion}ppp`;
        if (producto.material) return `Material: ${producto.material}`;
        if (producto.color) return `Color: ${producto.color}`;
        return '';
    }
}

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new Tienda();
});
