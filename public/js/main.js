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
    
        // Calcular precios mínimo y máximo del catálogo
        const precios = this.productos.map(p => p.precio);
        const precioMinimo = Math.min(...precios);
        const precioMaximo = Math.max(...precios);
    
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
    //    
    //  N   N   OOO      TTTTTTT  OOO    CCC    AAA    RRR
    //  NN  N  O   O        T    O   O  C      A   A  R   R
    //  N N N  O   O        T    O   O  C      AAAAA  RRRR
    //  N  NN  O   O        T    O   O  C      A   A  R   R
    //  N   N   OOO         T     OOO    CCC   A   A  R    R
    //
    // O Gabiña muere
    mostrarFormulario() 
    {
        const typeInput = document.getElementById('productType');
        typeInput.selectedIndex = 0; //resetea valor a "Selecciona una opción"
        typeInput.addEventListener("change", (e) => 
        {

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
                                    <input type="number" min="1" step="0" class="form-control" id="optionalInputPaginas" min="1" placeholder=0 required>
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
                                    <input type="number" min="1" step="0" class="form-control" id="optionalInputPaginas" min="1" placeholder=0 required>
                                </div>
    
    
                                <div class="mb-3">
                                    <label for="optionalInputTamano" class="form-label">Tamaño (kb):</label>
                                    <input type="number" min="0" step="0.01" class="form-control" id="optionalInputPaginas" min="0" placeholder="0" required>
                                </div>
        

    
                    `;
                    break;

                case 'ereader':
                    inputs.innerHTML += 
                    `
                                <div class="mb-3">
                                    <label for="optionalInputResolucion" class="form-label">Resolución:</label>
                                    <input type="number" min="1" step="0" class="form-control" id="optionalInputResolucion" placeholder="Ingrese la resolucion en ppp" required>
                                </div>
    
                    `;
                    break;

                case 'funda':
                    inputs.innerHTML += 
                    `
                                <div class="mb-3">
                                    <label for="optionalInputMaterial" class="form-label">Material:</label>
                                    <input type="text" class="form-control" id="optionalInputMaterial" placeholder="Ingrese el material" required>
                                </div>     
                    `;
                    break;

                case 'marcapaginas':
                    inputs.innerHTML += 
                    `
                                <div class="mb-3">
                                    <label for="optionalInputColor" class="form-label">Color:</label>
                                    <input type="text" class="form-control" id="optionalInputColor" placeholder="Ingrese el color" required>
                                </div>
                    `;
                    break;
                }
        });
        
        var dropbox = document.getElementById("dragDropArea")
        var dropText = document.getElementById("dropText"); // Referencia al texto
        var originalText = dropText.textContent; // Guarda el texto original
        var productImageInput = document.getElementById("productImage");

        dropbox.addEventListener("dragenter", dragOver); // entras en esa capa arrastrando algo
        dropbox.addEventListener("dragleave", dragOut); // sales de esa capa
        dropbox.addEventListener("dragover", dragOver); // te mueves arrastrando algo en la capa
        dropbox.addEventListener("drop", gestorFicheros); // sueltas los ficheros

        function dragOver(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        
            evt.target.classList.add("hover");

        }

        function dragOut(evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (dragDropArea.contains(evt.relatedTarget)) 
            {
                // Cuando haces hover sobre el texto se quita el glow verde y esto lo solciona, pero tiene otros problemas
                // Entonces no quita lo de hover, pero no funciona bien del todo
                // return;
            }

            evt.target.classList.remove("hover");
        }

        function gestorFicheros(evt) {
            evt.stopPropagation();
            evt.preventDefault();
        
            // Elimina la clase "hover" al soltar el archivo
            evt.target.classList.remove("hover");
        
            // Obtiene el archivo soltado
            const files = evt.dataTransfer.files;

            if (files.length > 1 )
            {
                errorFormulario('Solo se puede añadir un fichero');
                //alert("Por favor, suelta solo una imagen.");
                return;
            }

            if (!files[0].type.startsWith("image/"))
            {
                errorFormulario('Solo se pueden añadir imagenes');
                
                //alert("Por favor, suelta solo archivos de imagen.");
                return;
            }

            
            if (files.length < 0)
            {
                errorFormulario('Esto no debería pasar');
                //alert("Por favor, suelta solo archivos de imagen.");
                return;
            }
                
                
            // Cambia el texto a "¡Elemento añadido!"
            dropText.textContent = "¡Elemento añadido!";

            // Restaura el texto original después de 2 segundos
            setTimeout(() => 
            {
                dropText.textContent = originalText;
            }, 2000);
                
            // Asigna el archivo al input file
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(files[0]);
            productImageInput.files = dataTransfer.files;

            // Muestra el nombre del archivo en la consola
            console.log("Archivo asignado al input:", files[0].name);
        }

        function errorFormulario(error)
        {
            const form = document.getElementById("productForm");
            if (!form) return;
    
            const errorMessage = document.createElement('div');
            errorMessage.className = 'alert alert-danger mt-2 mb-0';
            errorMessage.textContent = error;
    
            form.appendChild(errorMessage);
    
            setTimeout(() => {
                errorMessage.remove();
            }, 1500);
        }

        
        
        //checkear egela-drive
    

        // Zona de recoger los datos del formulario para crear el objeto
        const searchInput = document.getElementById('productForm');
        searchInput.addEventListener('submit', async (e) => {
            e.preventDefault(); 



        
        // Se guarda el tipo de archivo para saber que datos recoger
        var val = document.getElementById('productType').value;

        const datos = 
        {
            nombre: document.getElementById('productName').value,
            precio: document.getElementById('productPrice').value,
            descripcion: document.getElementById('productDescription').value,
            // document.getElementById('productImage').value
        };

        var inputFile = document.getElementById('productImage')
        console.log(inputFile.files.length)
        if(inputFile.files.length > 0)
            {
                datos.imagen = URL.createObjectURL(document.getElementById('productImage').files[0])
                console.log("Hay imagen")
            } else {
                datos.imagen = 'img/default.png'
                console.log("No hay imagen")
                
            }

        // Comprobaciones iniciales
        if(datos.precio<0)
            { 
                document.getElementById('productPrice').value = "";
                alert("Introduzca un precio válido.");
                return;
            }

            
        switch(val) 
        {
            case 'libro_Fisico':
            
                datos.autor = document.getElementById('optionalInputAutor').value;
                datos.isbn = document.getElementById('optionalInputIsbn').value;
                datos.paginas = document.getElementById('optionalInputPaginas').value;
                
                break;

            case 'libro_Digital':
                datos.autor = document.getElementById('optionalInputAutor').value;
                datos.isbn = document.getElementById('optionalInputIsbn').value;
                datos.paginas = document.getElementById('optionalInputPaginas').value;
                datos.tamano = document.getElementById('optionalInputTamano').value;
                alert(datos.tamano);
                break;

            case 'ereader':
                datos.resolucion = document.getElementById('optionalInputResolucion').value; 
                break;

            case 'funda':
                datos.resolucion = document.getElementById('optionalInputMaterial').value; 
                break;

            case 'marcapaginas':
                datos.resolucion = document.getElementById('optionalInputColor').value;
                break;

            default:
                alert("Default");
                break;
        }

     agregarNuevoProducto(val, datos); 

     this.productos = obtenerProductos();
     this.filtrarProductos();
     this.mostrarProductos();
        
     return;

    });
    }

    // ============================== Logica Productos ==============================
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
            const currentQuantity = this.carrito.get(productId).cantidad;
            if (currentQuantity < this.maxCopias) {
                this.carrito.get(productId).cantidad++;
                this.mostrarMensajeExito(productId);
            } else {
                this.mostrarMensajeError(productId);
            }
        } else {
            this.carrito.set(productId, {
                producto: producto,
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
            const subtotal = item.producto.precio * item.cantidad;
            total += subtotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item mb-3 border-bottom pb-3';
            itemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.producto.imagen}" 
                         alt="${item.producto.nombre}" 
                         class="cart-item-image me-3" 
                         style="width: 100px; height: 100px; object-fit: cover;">
                    <div class="cart-item-details flex-grow-1">
                        <h6 class="mb-1">${item.producto.nombre}</h6>
                        <p class="mb-1">Precio: ${item.producto.precio}€</p>
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
            // Evento que llama a actualizarCantidad poniendo la cantidad a 0 para eliminar el producto
            const removeButton = itemElement.querySelector('.remove-item');
            removeButton.addEventListener('click', () => {
                this.actualizarCantidad(productId, 0);
            });

            // Añadir al DOM
            cartItems.appendChild(itemElement);
        });
        // Actualizar el total
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
    mostrarToast(productId) {
        const toast = document.querySelector(`[data-product-id="${productId}"] .toast`);
        const bsToast = new bootstrap.Toast(toast, { delay: 2000 });
        bsToast.show();
    }

    getExtraField(producto) {
        if (producto.isbn) return `ISBN: ${producto.isbn}`;
        if (producto.tamano) return `Tamaño: ${producto.tamano}`;
        if (producto.resolucion) return `Resolución: ${producto.resolucion}`;
        if (producto.material) return `Material: ${producto.material}`;
        if (producto.color) return `Color: ${producto.color}`;
        return '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Tienda();
});

// Como odio JavaScript 🤢 - Xabier Gabiña
// Como odio a Xabier Gabiña 🤢 - JavaScript
// Como odio a Xabier Gabiña 🤢 - CloudFare
// Como odio a Xabier Gabiña 🤢 - Discord
// Como odio a Xabier Gabiña 🤢 - El putisimo codigo del formulario