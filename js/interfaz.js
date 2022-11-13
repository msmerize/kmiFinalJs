// CREAR TABLA MODAL.
const crearModal=(lista,nodo,total)=>{
    nodo.innerHTML="";
    let acumulador=`<table class="table table-striped table-hover">
                        <tr>
                            <th>Producto</th> 
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>SubTotal</th>
                            <td></td>
                        </tr>`

    lista.forEach((element)=>{
        acumulador+=
        ` <tr>
                <td><img class="modal-img" src="./img/${element.img}">${element.marca} ${element.modelo}</td>
                <td>$${element.precio}</td>
                <td>
                    <p id="cant${element.id}">${element.cantidad}</p>
                    <div>
                        <a id="btn_restar${element.id}" class="masmenos" type="button"><i class="fa-solid fa-circle-minus"></i></a>
                        <a id="btn_sumar${element.id}" class="masmenos" type="button"><i class="fa-solid fa-circle-plus"></i></a>
                    </div>
                </td>
                <td id="sbTotal${element.id}">$${element.precio*element.cantidad}</td>
                <td><a id="trash${element.id}" type="button"><i class="fa-solid fa-trash-can trash"></i></a></td>

            </tr> `;


    })

    acumulador+=`<tr>
                    <td>TOTAL</td>
                    <td>---</td>
                    <td>---</td>
                    <td id="mdTotal">$${total}</td>
                    <td></td>
                </tr>
        </table>
        `

    nodo.innerHTML=acumulador;
    agregarBtnModal();
    botonBasura();
    botonSumaResta();
    

}

// CARGA CARRITO DEL LOCAL STORAGE SI HAY PRODUCTO.
const cargarModal=(lista,nodo,monto)=>{
    if (lista.length!=0) {
        crearModal(lista,nodo,monto)
        // calcularPago();
    }
};
const limpiarModal=()=>{
    bodyCarrito.innerHTML= `<p class="p-size">Carrito Vacio</p>`;
    quitarBtnModal();
    resetItem();
}
// LLAMA FUNCION LIMPIAR CARRITO.
const btnBorrar=(id)=>document.getElementById(id).addEventListener("click",()=>{
    Swal.fire({
    title: 'Desea vaciar el carrito?',
    text: "Perdera los productos añadidos",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    cancelButtonText: 'Continuar compra',
    confirmButtonText: 'Vaciar'
}).then((result) => {
    if (result.isConfirmed) {
    Swal.fire(
        'El carrito vacio!',
        'Continuar',
        'success',
        listaCompra.LimpiarCarrito()
    )
    }
})
});

// FUNCION CONCRETAR PAGO.
const botonPagar=()=>document.getElementById("pagar").addEventListener("click",()=>{

    const loader=document.getElementById("loader");
    loader.classList.remove("loader2");
    setTimeout(() => {
        location.href="./checkout.html";
    }, 2000);
})

// FUNCION BOTON CARRITO.
const agregarBtnCarrito=()=>{

    let botonCarrito= document.getElementById("botonCarrito");

    botonCarrito.addEventListener("click",()=>{

        cargarModal(listaCompra.GetCarrito(),bodyCarrito,listaCompra.Subtotal());
    })
}

// AGREGA BOTONES PAGAR Y LIMPIAR, CUANDO HAY ALGO EN EL CARRITO. 
const agregarBtnModal=()=>{
    
    btnModal.innerHTML=`<button id="pagar" type="button" class="btn" data-bs-dismiss="modal">Pagar</button>
                        <button id="limpiar" type="button" class="btn">Vaciar carrito</button>
    `;

    botonPagar();
    btnBorrar("limpiar");

}
// TRASH. NUKE TODOS LOS PRODUCTOS.
const botonBasura=()=>{

    listaCompra.GetCarrito().forEach((element) => {

        document.getElementById(`trash${element.id}`).addEventListener("click",()=>{

            let posicion=listaCompra.GetCarrito().indexOf(element);
        borrarProductoModal(posicion);
        })

    });


}

// SUMA Y RESTA PRODUCTOS YA AÑADIDOS.
const botonSumaResta=()=>{

    listaCompra.GetCarrito().forEach((element)=>{

        document.getElementById(`btn_sumar${element.id}`)?.addEventListener("click",()=>{
    
            let index=listaCompra.GetCarrito().indexOf(element);
        
            if (element.cantidad<element.stock) {
                listaCompra.GetCarrito()[index].cantidad++;
            }else{
                Swal.fire({
                    position: 'center',
                    title: 'Sin stock',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
            
            modalDom(element.id,element.precio,element.cantidad);
        
        });

        document.getElementById(`btn_restar${element.id}`)?.addEventListener("click",()=>{
    
            let index=listaCompra.GetCarrito().indexOf(element);
        
            if (element.cantidad>1) {
                listaCompra.GetCarrito()[index].cantidad--;
            }else if (element.cantidad===1){
                borrarProductoModal(index);
            }
            
            modalDom(element.id,element.precio,element.cantidad);
    
        });    
    })
}

// FUNCIONES QUE BORRAN PRODUCTO DEL MODAL. REFRESCA STORAGE Y MODAL.
const borrarProductoModal=(index)=>{

    listaCompra.RemoverItem(index);
            
    limpiarModal();

    cargarStorage("carrito",JSON.stringify(listaCompra.GetCarrito()));

    cargarModal(listaCompra.GetCarrito(),bodyCarrito,listaCompra.Subtotal());

    contItem();

}

// MODIFICA VALORES DE MODAL ANTE INTERACCIONES DEL USER.
const modalDom=(id,precio,cantidad)=>{

    let cantidadProductos=document.getElementById(`cant${id}`);
    cantidadProductos.innerText=cantidad;

    let sbtotal=document.getElementById(`sbTotal${id}`);
    sbtotal.innerText="$"+cantidad*precio;

    let mdTotal=document.getElementById("mdTotal");
    mdTotal.innerText="$"+listaCompra.Subtotal();

    contItem();
    cargarStorage("carrito",JSON.stringify(listaCompra.GetCarrito()));
}

// SI EL CARRITO NO CONTIENE PRODUCTOS OCULTA BOTONES.
const quitarBtnModal=()=>{
    btnModal.innerHTML="";
}

// CONTADOR.
const contItem=()=>{
    let cant=listaCompra.GetCarrito().reduce((acumulador,x)=>acumulador+x.cantidad,0)
    itemTotal.innerHTML=cant;
}
const resetItem=()=>{
    itemTotal.innerHTML=0;
}

// VARIABLES GLOBALES.
const listaCompra=new Carrito;
const bodyCarrito=document.getElementById("bodyCarrito");
const btnModal=document.getElementById("btnModal");
const itemTotal= document.getElementById("item_total");

// FUNCIONES NECESARIAS PARA INICIAR.
cargarProductos();

obtenerStorage();

agregarBtnCarrito();