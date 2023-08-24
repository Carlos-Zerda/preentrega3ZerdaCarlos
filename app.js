// Clases Cliente, Producto, y Pedido
class Cliente {
    constructor(nombre, email) {
      this.nombre = nombre;
      this.email = email;
    }
  }
  
  class Producto {
    constructor(nombre, precio, imagenUrl) {
      this.nombre = nombre;
      this.precio = precio;
      this.imagenUrl = imagenUrl;
    }
  }
  
  class Pedido {
    constructor(cliente) {
      this.cliente = cliente;
      this.productos = [];
      this.total = 0;
      this.formaDePago = null;
    }
  
    cantidadTotalProductos() {
      return this.productos.reduce((total, producto) => total + producto.cantidad, 0);
    }
  
    agregarProducto(producto) {
      const index = this.productos.findIndex((p) => p.nombre === producto.nombre);
      if (index !== -1) {
        this.productos[index].cantidad += 1;
      } else {
        producto.cantidad = 1;
        this.productos.push(producto);
      }
      this.total += producto.precio;
    }
  
    eliminarProducto(producto) {
      const index = this.productos.findIndex((p) => p.nombre === producto.nombre);
      if (index !== -1) {
        this.total -= this.productos[index].precio * this.productos[index].cantidad;
        this.productos.splice(index, 1);
      }
    }
  
    mostrarResumen() {
      let resumen = `Cliente: ${this.cliente.nombre} (${this.cliente.email})\n\n`;
      resumen += "Productos:\n";
      this.productos.forEach((producto) => {
        resumen += `- ${producto.nombre} (x${producto.cantidad}) - $${producto.precio * producto.cantidad}\n`;
      });
      resumen += `\nTotal: $${this.total.toFixed(2)}\n`;
      resumen += `Forma de pago: ${this.formaDePago}\n`;
      return resumen;
    }
    vaciarCarrito() {
      this.productos = [];
      this.total = 0;
    }
  }
  
  
  // Agrega funciones para eliminar un producto y vaciar el carrito
  function eliminarProductoDelCarrito(producto) {
    const carrito = obtenerCarrito();
    carrito.eliminarProducto(producto);
    guardarCarrito(carrito);
    actualizarCarritoEnDOM();
  }
  
  function vaciarCarrito() {
    const carrito = obtenerCarrito();
    carrito.vaciarCarrito();
    guardarCarrito(carrito);
    actualizarCarritoEnDOM();
  }
  
  //Datos de productos disponibles
  const productosDisponibles = {
    bebidas: [
      new Producto("Café americano", 250, 'https://bittercoffees.com/wp-content/uploads/2022/02/Cafe%CC%81-Americano-.jpeg'),
      new Producto("Cappuccino", 300, 'https://es.rc-cdn.community.thermomix.com/recipeimage/uyjcr0qz-f21a3-938576-cfcd2-j0l5z11f/d9774710-e344-46da-8379-0bc77ed3c3bd/main/cafe-capuccino.jpg'),
      new Producto("Té negro", 200, 'https://t1.uc.ltmcdn.com/es/posts/5/0/3/cuales_son_las_contraindicaciones_del_te_negro_41305_600.webp'),
      new Producto("Chocolate caliente", 290, 'https://www.vitamixespana.com/recetas/wp-content/uploads/2016/10/chocolate-caliente.jpg'),
      new Producto("Frappé de vainilla", 400, 'https://www.deleitas.com/pics_fotosrecetas/19/med_full_menta.jpg'),
    ],
    postres: [
      new Producto("Cheesecake (porción)", 450, 'https://imagesvc.meredithcorp.io/v3/mm/image?url=https://static.onecms.io/wp-content/uploads/sites/21/2015/02/11/cheesecake-facil-con-leche-condensada-2000.jpg'),
      new Producto("Tarta de manzana (porción)", 320, 'https://www.hogarmania.com/archivos/201402/5317-2-tarta-de-manzana-702-xl-668x400x80xX.jpg'),
      new Producto("Brownie (porción)", 380, `https://img-global.cpcdn.com/recipes/be159331e5b2d130/1360x964cq70/brownie-con-nueces-foto-principal.webp`),
      new Producto("Galletas de chocolate", 250, `https://s1.eestatic.com/2023/04/09/cocinillas/recetas/postres/754934523_232288662_1706x960.jpg`),
      new Producto("Torta de zanahoria (porción)", 400, `https://estaticos-cdn.prensaiberica.es/clip/e4b7a5d3-ee9c-4d50-af00-9e2c1455fbee_16-9-aspect-ratio_default_0.jpg`),
    ],
  };
  
  //Funciones para manipular el DOM
  function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('producto');
  
    const nombre = document.createElement('h2');
    nombre.textContent = producto.nombre;
    tarjeta.appendChild(nombre);
  
    const imagen = document.createElement('img');
    imagen.src = producto.imagenUrl;
    tarjeta.appendChild(imagen);
  
    const precio = document.createElement('p');
    precio.textContent = `$${producto.precio}`;
    tarjeta.appendChild(precio);
  
    const boton = document.createElement('button');
    boton.textContent = 'Agregar al carrito';
    boton.addEventListener('click', () => {
      agregarProductoAlCarrito(producto);
    });
    tarjeta.appendChild(boton);
  
    return tarjeta;
  }
  
  function mostrarProductos(productos) {
    const contenedorProductos = document.getElementById('productos');
    productos.forEach((producto) => {
      const tarjeta = crearTarjetaProducto(producto);
      contenedorProductos.appendChild(tarjeta);
    });
  }
  
  function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const productos = carrito.productos;
  
    const modal = document.getElementById("carrito-modal");
    const contenido = document.getElementById("carrito-contenido");
    contenido.innerHTML = "";
  
    productos.forEach((producto) => {
      const productoDiv = document.createElement("div");
      const imagen = document.createElement("img");
      imagen.src = producto.imagenUrl;
      productoDiv.appendChild(imagen);
  
      const nombre = document.createElement("h3");
      nombre.textContent = producto.nombre;
      productoDiv.appendChild(nombre);
  
      const cantidad = document.createElement("p");
      cantidad.textContent = `Cantidad: ${producto.cantidad}`;
      productoDiv.appendChild(cantidad);
  
      const precio = document.createElement("p");
      precio.textContent = `Precio: $${producto.precio * producto.cantidad}`;
      productoDiv.appendChild(precio);
  
      const eliminarProductoBoton = document.createElement("button");
      eliminarProductoBoton.textContent = "Eliminar producto";
      eliminarProductoBoton.addEventListener("click", () => {
        eliminarProductoDelCarrito(producto);
        mostrarCarrito();
      });
      productoDiv.appendChild(eliminarProductoBoton);
  
      contenido.appendChild(productoDiv);
    });
  
    const total = document.createElement("p");
    total.textContent = `Total: $${carrito.total.toFixed(2)}`;
    contenido.appendChild(total);
  
    const vaciarBoton = document.createElement("button");
    vaciarBoton.textContent = "Vaciar carrito";
    contenido.appendChild(vaciarBoton);
    vaciarBoton.addEventListener("click", () => {
      vaciarCarrito();
      mostrarCarrito();
    });
  
    const FinalizarCompra = document.createElement("button");
    vaciarBoton.textContent = "Finalizar compra";
    contenido.appendChild(vaciarBoton);
    vaciarBoton.addEventListener("click", () => {
      alert("Gracias por su compra")
      vaciarCarrito();
  
    });
  
    modal.style.display = "block";
  
    const span = document.getElementsByClassName("close")[0];
    span.onclick = function () {
      modal.style.display = "none";
    };
  
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  }
  
  
  
  
  function actualizarCarritoEnDOM() {
    const carrito = obtenerCarrito();
    const cantidad = carrito.cantidadTotalProductos(); // Utiliza la función cantidadTotalProductos
    const botonCarrito = document.getElementById("boton-carrito");
    botonCarrito.textContent = `Carrito (${cantidad})`;
    botonCarrito.addEventListener("click", mostrarCarrito);
  }
  
  
  
  function agregarProductoAlCarrito(producto) {
    const carrito = obtenerCarrito();
    carrito.agregarProducto(producto);
    guardarCarrito(carrito);
    actualizarCarritoEnDOM();
  }
  
  //Funciones de Local Storage
  const CARRO_KEY = 'carrito';
  
  function obtenerCarrito() {
    const carritoJSON = localStorage.getItem(CARRO_KEY);
    if (carritoJSON) {
      const datosCarrito = JSON.parse(carritoJSON);
      const cliente = new Cliente(datosCarrito.cliente.nombre, datosCarrito.cliente.email);
      const carrito = new Pedido(cliente);
      carrito.productos = datosCarrito.productos.map((producto) => {
        const nuevoProducto = new Producto(producto.nombre, producto.precio, producto.imagenUrl);
        nuevoProducto.cantidad = producto.cantidad;
        return nuevoProducto;
      });
      carrito.total = datosCarrito.total;
      carrito.formaDePago = datosCarrito.formaDePago;
      return carrito;
    } else {
      const cliente = new Cliente('', '');
      return new Pedido(cliente);
    }
  }
  
  
  function guardarCarrito(carrito) {
    const carritoParaGuardar = Object.assign({}, carrito, {
      productos: carrito.productos.map((producto) => ({
        nombre: producto.nombre,
        precio: producto.precio,
        imagenUrl: producto.imagenUrl,
        cantidad: producto.cantidad, // Asegúrate de guardar la cantidad de cada producto
      })),
    });
    const carritoJSON = JSON.stringify(carritoParaGuardar);
    localStorage.setItem(CARRO_KEY, carritoJSON);
  }
  
  const url = `https://jsonplaceholder.typicode.com/users/`
  
  
  
  fetch(url)
    .then(Response => Response.json())
    .then(listaDeExperiencias => {
      listaDeExperiencias.forEach(usuario => {
        experiencias.innerHTML += `
        <div class="card">
          <div class="card-header">
            ${usuario.name}
          </div>
          <div class="card-body">
            <blockquote class="blockquote mb-5 ">
              <p>${usuario.email}</p>
              <footer class="blockquote-footer">Delicioso <cite title="Source Title">,Exelente</cite></footer>
            </blockquote>
          </div>
        </div>`
      })
    })
    .catch(err => console.log(err))
  
  const experiencias = document.getElementById("experiencias")
  
  
  document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos([...productosDisponibles.bebidas, ...productosDisponibles.postres]);
    actualizarCarritoEnDOM();
  });