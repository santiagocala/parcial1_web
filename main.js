let datos;
let carrito = [];
let orden = [];
const contenedor_categorias = document.getElementById('contenedor-categorias');
const contenedor_productos = document.getElementById('contenedor-productos');
const categoria_actual = document.getElementById('categoria-actual');
const items = document.getElementById('items');
const elementoCarrito = document.getElementById('carrito');
const ultimafila = document.getElementById('ultimafila');

// Hacemos el fetch de los datos del JSON
let promise1 = fetch('https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json');
// Cuando termina el fetch, se ejecuta el código dentro del then del promise1 para ver si lo que salió está bien
let promise2 = promise1.then(function(resUrl){
    if (!resUrl.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else {
        // Retornamos los valores convertidos en JSON
        return resUrl.json();
    }
});
// Ahora guardamos los datos en una variable global
let promise3 = promise2.then(function(resFinal){
    datos = resFinal;
    return resFinal;
});
// Ahora llenamos la información del HTML con base en los datos
promise3.then(function(info){
    for(let i = 0; i < datos.length; i++){
        let categoria = document.createElement('div');
        categoria.className = 'col-1 categorias';
        let nodo = document.createTextNode(datos[i].name);
        categoria.appendChild(nodo);
        contenedor_categorias.appendChild(categoria);
        categoria.addEventListener('click',function(){
            categoria_actual.innerHTML = datos[i].name;
            contenedor_productos.innerHTML = '';
            for(let j = 0; j < datos[i].products.length; j++){
                contenedor_productos.appendChild(createCard(datos[i].products[j]));
            }
        });
    }
});
//Creamos la función para crear las tarjetas
let createCard = (pProducto) => {

    let columna = document.createElement('div');
    columna.className = 'col-3';

    let card = document.createElement('div');
    card.className = 'card h-100 shadow cursor-pointer';
    
    let image = document.createElement('img');
    image.className = 'card-img-top';
    image.src = pProducto.image;
    image.alt = 'Card image cap';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';
  
    let title = document.createElement('h5');
    title.innerText = pProducto.name;
    title.className = 'card-title';
    
    let description = document.createElement('p');
    description.innerText = pProducto.description;
    description.className = 'card-text';
    
    let boton = document.createElement('a');
    boton.className = 'btn btn-primary'; 
    boton.innerText = 'Add to cart';
    boton.addEventListener('click', function(){
        agregarAlCarrito(pProducto);
    })
    
    let precio = document.createElement('h6');
    precio.classname = 'card-price';
    precio.innerText = '$'+ pProducto.price;

    cardBody.appendChild(title);
    cardBody.appendChild(description);
    cardBody.appendChild(precio);
    cardBody.appendChild(boton);
    card.appendChild(image);
    card.appendChild(cardBody);
    columna.appendChild(card);

    return columna;
  }
// Creamos la función para agregar al carrito
let agregarAlCarrito = (pProducto) => {
    carrito.push(pProducto);
    items.innerHTML = carrito.length + ' items';
}
// Creamos el eventListener del carrito para desplegar la información cuando hagan click. 
elementoCarrito.addEventListener('click', function(){
    contenedor_productos.innerHTML = ''
    categoria_actual.innerHTML = 'Order detail';
    mostrarOrden();
})
// Creamos la tabla de productos que actualmente hay en el carrito
function mostrarOrden(){
    // Creamos la tabla: 
    let tabla = document.createElement('table');
    tabla.className = 'table table-striped';
    let thead = document.createElement('thead');
    let row = document.createElement('tr');
    let th1 = document.createElement('th');
    th1.setAttribute('scope','col');
    th1.innerHTML = 'Item';
    let th2 = document.createElement('th');
    th2.setAttribute('scope','col');
    th2.innerHTML = 'Qty';
    let th3 = document.createElement('th');
    th3.setAttribute('scope','col');
    th3.innerHTML = 'Unit Price';
    let th4 = document.createElement('th');
    th4.setAttribute('scope','col');
    th4.innerHTML = 'Amount';
    let th5 = document.createElement('th');
    th5.setAttribute('scope','col');
    th5.innerHTML = 'Modify';
    let th6 = document.createElement('th');
    th6.setAttribute('scope','col');
    th6.innerHTML = 'Description';
    let tbody = document.createElement('tbody');


    row.appendChild(th1);
    row.appendChild(th2);
    row.appendChild(th6);
    row.appendChild(th3);
    row.appendChild(th4);
    row.appendChild(th5);
    tabla.appendChild(row);
    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    contenedor_productos.appendChild(tabla);

    carrito.sort(function(a,b){
        let fa = a.name.toLowerCase();
        let fb = b.name.toLowerCase();

    if (fa < fb) {
        return -1;
    }
    if (fa > fb) {
        return 1;
    }
    return 0;
    });

    let cantidad = 1;
    let prod = 1;
    for(let i = 0; i < carrito.length; i++){
        if(i == carrito.length -1){
            let prow = document.createElement('tr');
            let numitem = document.createElement('th');
            numitem.innerHTML = prod;
            let pqty = document.createElement('td');
            pqty.innerHTML = cantidad;
            let pdesc = document.createElement('td');
            pdesc.innerHTML = carrito[i].name;
            let punitprice = document.createElement('td');
            punitprice.innerHTML = carrito[i].price;
            let pamount = document.createElement('td');
            pamount.innerHTML = cantidad * carrito[i].price;
            let pmodify = document.createElement('td');
            let sumar = document.createElement('button');
            sumar.className = 'btn btn-dark';
            sumar.innerHTML = '+';
            copia = carrito[i];
            sumar.addEventListener('click', function(){
                contenedor_productos.innerHTML = '';
                carrito.push(copia);
                orden = []
                mostrarOrden();
            })
            pmodify.appendChild(sumar);
            let restar = document.createElement('button');
            restar.className = 'btn btn-dark';
            restar.innerHTML = '-';
            restar.addEventListener('click', function(){
                carrito.splice(carrito[i]);
                mostrarOrden();
            })
            pmodify.appendChild(sumar);
            pmodify.appendChild(restar);
            
            tbody.appendChild(prow);
            prow.appendChild(numitem);
            prow.appendChild(pqty);
            prow.appendChild(pdesc);
            prow.appendChild(punitprice);
            prow.appendChild(pamount);
            prow.appendChild(pmodify);

            elementoOrden = {item: prod, quantity: cantidad, description: carrito[i].name, unitPrice: carrito[i].price }
            orden.push(elementoOrden);

            prod ++;
            cantidad = 1;
        } else if(carrito[i].name != carrito[i+1].name) {
            let prow = document.createElement('tr');
            let numitem = document.createElement('th');
            numitem.innerHTML = prod;
            let pqty = document.createElement('td');
            pqty.innerHTML = cantidad;
            let pdesc = document.createElement('td');
            pdesc.innerHTML = carrito[i].name;
            let punitprice = document.createElement('td');
            punitprice.innerHTML = carrito[i].price;
            let pamount = document.createElement('td');
            pamount.innerHTML = cantidad * carrito[i].price;
            let pmodify = document.createElement('td');
            let sumar = document.createElement('button');
            sumar.className = 'btn btn-dark';
            sumar.innerHTML = '+';
            copia = carrito[i];
            sumar.addEventListener('click', function(){
                contenedor_productos.innerHTML = '';
                carrito.push(copia);
                orden = []
                mostrarOrden();
            })
            pmodify.appendChild(sumar);
            let restar = document.createElement('button');
            restar.className = 'btn btn-dark';
            restar.innerHTML = '-';
            restar.addEventListener('click', function(){
                carrito.splice(carrito[i]);
                mostrarOrden();
            })
            pmodify.appendChild(sumar);
            pmodify.appendChild(restar);

            tbody.appendChild(prow);
            prow.appendChild(numitem);
            prow.appendChild(pqty);
            prow.appendChild(pdesc);
            prow.appendChild(punitprice);
            prow.appendChild(pamount);
            prow.appendChild(pmodify);

            elementoOrden = {item: prod, quantity: cantidad, description: carrito[i].name, unitPrice: carrito[i].price }
            orden.push(elementoOrden);

            prod ++;
            cantidad = 1;
        } else {
            cantidad ++; 
        }
    }

    ultimafila.innerHTML = '';
    let total = document.createElement('div');
    total.className = 'col-8';
    let totalito = document.createElement('h6');
    valortotal = 0;
    for(let i = 0; i < carrito.length; i++){
        valortotal += carrito[i].price;
    }
    totalito.innerHTML = 'Total: $' + valortotal;
    
    let colcancel = document.createElement('div');
    colcancel.className = 'col-2';
    let colconfirm = document.createElement('div');
    colconfirm.className = 'col-2';
    
    let botoncancel = document.createElement('button');
    botoncancel.className = 'btn btn-danger';
    botoncancel.setAttribute('id','botoncancelar');
    botoncancel.setAttribute('data-toggle','modal');
    botoncancel.setAttribute('data-target','#exampleModal');
    botoncancel.innerHTML = 'Cancel';
    colcancel.appendChild(botoncancel);

    let botonconfirm = document.createElement('button');
    botonconfirm.className = 'btn btn-secondary';
    botonconfirm.setAttribute('id','botonconfirmar');
    botonconfirm.innerHTML = 'Confirm order';
    colconfirm.appendChild(botonconfirm);
    botonconfirm.addEventListener('click', function(){
        console.log(orden);
    });

    total.appendChild(totalito);
    ultimafila.appendChild(total);
    ultimafila.appendChild(colcancel);
    ultimafila.appendChild(colconfirm);
}


