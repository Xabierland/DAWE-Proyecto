// Validaciones de ficheros
export function validarImagen(file) {
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
    return tiposPermitidos.includes(file.type);
 }
 
 // Formateo de números
 export function formatearPrecio(precio) {
    return precio.toFixed(2) + '€';
 }
 
 // Validaciones de formulario
 export function validarFormulario(formData) {
    const errores = [];
    
    if (!formData.tipo) errores.push('Debe seleccionar un tipo de producto');
    if (!formData.nombre) errores.push('El nombre es obligatorio');
    if (!formData.precio || formData.precio <= 0) errores.push('El precio debe ser mayor que 0');
 
    return errores;
 }
 
 // Manipulación del DOM
 export function mostrarMensaje(mensaje, tipo, duracion = 2000) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${tipo} position-fixed top-0 end-0 m-3`;
    alert.textContent = mensaje;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), duracion);
 }
 
 // Funciones de drag and drop
 export function setupDragAndDrop(dropZone, inputFile) {
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
 
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });
 
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 1) {
            mostrarMensaje('Solo se permite un archivo', 'danger');
            return;
        }
        
        if (!validarImagen(files[0])) {
            mostrarMensaje('Solo se permiten imágenes JPG/PNG', 'danger');
            return;
        }
 
        inputFile.files = files;
    });
 }