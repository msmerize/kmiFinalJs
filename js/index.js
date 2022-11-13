class camisa{
    constructor(id,marca,modelo,precio,img,stock){

        this.id=id;
        this.marca=marca;
        this.modelo=modelo;
        this.precio=precio;
        this.img=img;
        this.stock=stock;
    }

}

class Carrito{
    constructor(){

        this.carrito=[];
    }

    // AGREGAR PRODUCTO.
    GetCarrito(){
        return this.carrito;
    }

    AddProducto(camisa){

        this.carrito.push({...camisa,cantidad:1});
    }

    RemoveProducto(prenda){

        let index;
        switch (prenda) {
            case 1:
                index=this.carrito.indexOf(pantalon);
                break;
            case 2:
                index=this.carrito.indexOf(remera);
                break;
            case 3:
                index=this.carrito.indexOf(camisa);
                break;
        }
        
        if (index!=-1 && index!=null) {
            listaCompra.splice(index,1);
        }
    }

    RemoverItem(posicion){
        this.carrito.splice(posicion,1);
    }
    // NUKE CARRITO.
    // ASK SI FUNCIONES DENTRO DEL METODO VAN DENTRO DE LA CLASE.
    LimpiarCarrito(){

        this.carrito.splice(0, this.carrito.length);
        
        limpiarModal();
        localStorage.removeItem("carrito");
    }

    // SUM DE SUBTOTALES.
    Subtotal(){
        let aux=this.carrito.reduce((acumulador, x)=>acumulador+(x.precio*x.cantidad),0);
        return aux;
    }

}
// CONSULTA JSON Y CARGA PRODUCTOS.
const cargarProductos= async ()=>{

    const response = await fetch("./productos.json");
    let data= await response.json();
    
    data.forEach((element)=>{
        let allcards=document.getElementById("allcards");
        
        allcards.innerHTML+=    `<div class="card col-lg-4 col-12">
                                <h2>${element.marca} ${element.modelo}</h2>         
                                <img class="card-img" src="img/${element.img}" alt="camisa">
                                <p class="p-size">$${element.precio}</p>
                                <button id="btn-camisa${element.id}" class="btn">Agregar</button>
                            </div>`;
    
    })

    data.forEach((element)=>{
        document.getElementById(`btn-camisa${element.id}`)?.addEventListener("click",()=>{

            if (listaCompra.GetCarrito().find(camisa=>camisa.id===element.id)) {
        
                let index=listaCompra.GetCarrito().findIndex(camisa=>camisa.id===element.id);

                if (listaCompra.GetCarrito()[index].cantidad<element.stock) {
                    listaCompra.GetCarrito()[index].cantidad++;
                }else{
                    Swal.fire({
                        position: 'top',
                        title: 'Sin stock',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            }else{
                let producto = new camisa(element.id,element.marca,element.modelo,element.precio,element.img,element.stock)
                listaCompra.AddProducto(producto);
            }
            // CARGA EL STORAGE.
            cargarStorage("carrito",JSON.stringify(listaCompra.GetCarrito()));
            contItem();
        })
    })   
}

// CARGA AL LOCAL STORAGE.
const cargarStorage=(clave,valor)=>{
    localStorage.setItem(clave,valor);
}

// OBTIENE DATOS DEL STORAGE Y LOS RECARGA.
const obtenerStorage=()=>{

    if (localStorage.getItem("carrito")!==null) {
    
        let listAux=JSON.parse(localStorage.getItem("carrito"));
        listAux.forEach((ele)=>{
            listaCompra.GetCarrito().push(ele);
        })
    }
    contItem();

}

// UBICACION.
cargarStorage("location",window.location.href);


