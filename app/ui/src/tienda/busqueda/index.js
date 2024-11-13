

import { loadPartials } from "../../utils/viewpartials.js";
import { getPortadaBusqueda, busquedaProductos } from './api';
import { custom, menuselec } from '../utils/common.js';


(async function () {
    let partials = [
        { path: '../partials/tienda/header.html', container: 'header' },
        { path: '../partials/tienda/footer.html', container: 'footer' },
    ];
    try {

        await loadPartials(partials);
        custom()
        menuselec()
        // import('../utils/common');
        console.log('Las vistas parciales se han cargado correctamente!');

        startApp();
    } catch (e) {
        console.error(e);
    }
})();


function startApp () {
    cargarDataPortada();
    rellenarFormulario();
    realizarBusqueda();
    changeRelevancia()
}

function changeRelevancia () {
    $('#drpordenamientosbusqueda').on('change', function (e) {
        ordenamientosBusqueda()
    })
}

function generarURL () {

    const formulario = $('#miFormulario');
    const formData = new FormData(formulario[0]);
    const params = new URLSearchParams();

    formData.forEach((value, key) => {
        if (value) {  // Solo agregar a la URL si el valor no está vacío
            params.append(key, value);
        }
    });

    // Redirige a la misma página con los nuevos parámetros en la URL
    window.location.href = '?' + params.toString();

    // Previene el submit tradicional
    return false;
}

// Asigna la función generarURL al evento submit del formulario
$('#miFormulario').submit(generarURL);

// Rellena el formulario con los valores de la URL
function rellenarFormulario () {

    setTimeout(function () {
        const params = new URLSearchParams(window.location.search);

        params.forEach((value, key) => {
            const campo = $(`[name=${key}]`);

            if (campo.is('input') || campo.is('select')) {
                campo.val(value);
            }
        });
    }, 1000)


}

// Rellena el formulario con los valores de la URL
async function realizarBusqueda () {


    const params = new URLSearchParams(window.location.search);

    let busqueda = await busquedaProductos(params)

    loadProductos(busqueda)


}

function formatearNumero (numero) {
    return numero.toLocaleString('es-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


function loadProductos (data) {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get('page')) || 1;
    const itemsPerPage = 9;
    const totalRows = data.total_filas;
    const displayedItems = Math.min(page * itemsPerPage, totalRows);

    $('#lblTotales').text(`Resultados: ${displayedItems} de ${totalRows}`);


    let htmlPagination = generatePaginationHTML(data.paginas_totales)
    $('#paginationContainer').append(htmlPagination);
    let html = ` `
    console.log * (data.datos)
    for (let item of data.datos) {


        let artenia_anviar_carrito = {
            artesano_id: item.artesano_id,
            id: item.id,
            categoria_id: item.categoria_id,
            artesano: item.artesano,
            datos: {
                imagen_principal: item.imagen_principal,
                precio: item.imagen_principal,
                descripcion_es: item.nombres_es,
                cualidades_es: item.descripcion_es,
                precio: parseFloat(item.precio)
            },
        }

        let artenia_deseados = {

            id: item.id + '-' + item.artesano_id,
            artesania: {
                id: item.id,
                nombre_es: item.nombres_es,
                precio: parseFloat(item.precio),
                imagen_principal: item.imagen_principal,
                url_carrito: encodeURIComponent(JSON.stringify(artenia_anviar_carrito))
            },
            artesano: {
                id: item.artesano_id,
                nombres: item.artesano,
                foto1: item.foto1,
            }
        }
        //alert(item.imagen)
        html = html + `
         <div class="col-6 col-md-4 mb-4">
            <div class="car-item wow fadeIn" data-wow-duration="0.75s">
                <div class="thumb-content">
                    <div class="car-banner nuevo-producto"></div>
                    <div class="thumb-inner photo-prod">
                        <a href="producto.html?producto=${encodeURIComponent(JSON.stringify(artenia_deseados))}">
                            <img style="height:250px; width:100%; object-fit: cover;" 
                                 src="${item?.imagen_principal || 'https://via.placeholder.com/400x200'}" 
                                 alt="Producto">
                        </a>
                    </div>
                </div>
     <div class="down-content text-center" style="max-width: 300px;">
    <a href="producto.html?producto=${encodeURIComponent(JSON.stringify(artenia_deseados))}" style="color:#000; word-wrap: break-word; overflow-wrap: break-word;">
        <h5 title="${item?.nombres_es || ''}" class="card-title font-weight-bold product-description" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; max-width: 100%; margin-top: 20px;">
            <span class="d-block d-md-none" style="font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${item?.nombres_es || ''}</span>
            <span class="d-none d-md-block" style="font-size: 16px; color:#000; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;">${item?.nombres_es || ''}</span>
        </h5>
    </a>
                    <p class="text-danger font-weight-bold">
                        <span class="d-block d-md-none h5"  style="color:#ea0397">S/.${formatearNumero(item?.precio) || ''}</span>
                        <span class="d-none d-md-block h4"  style="color:#ea0397">S/.${formatearNumero(item?.precio) || ''}</span>
                    </p>
                    <p class="card-text text-muted">
                        <span class="d-block d-md-none" style="font-size: 12px; color:black"> ${item?.categoria || ''}</span>
                        <span class="d-none d-md-block" style="font-size: 12px; color:black"> ${item?.categoria || ''}</span>
                    </p>
                    <div class="d-flex align-items-center mt-3" title="Artesano">
                        <img class="rounded-circle mr-2"
                             src="${item?.foto1 || 'https://via.placeholder.com/40'}"
                             alt="Foto del artesano" 
                             style="width: 40px; height: 40px;">
                        <span class="text-dark" style="margin: 0; padding: 0; display: inline-block;">
                            <a style="color: black; font-size: 10px; margin: 0; padding: 0; line-height: 1;" 
                               href="artesano.html?id=${item?.artesano_id || ''}">
                               ${item?.artesano || ''}
                            </a>
                        </span>
                        <div class="line-dec2"></div>
                    </div>
                    <div class="d-flex mt-4 justify-content-center ">
                        <div class="hidden sm-block btn-group" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-light" style="background:#ea0397 !important">
                                <a style="color:#fff !important" href="producto.html?producto=${encodeURIComponent(JSON.stringify(artenia_deseados))}">Ver más</a>
                            </button>
                            <button title="Agregar carrito de compras" type="button" class="btn btn-light btn-comprar" producto_id="${item.id}">
                            <a title="Agregar carrito de compras" href="carrito-de-compra.html?producto=${encodeURIComponent(JSON.stringify(artenia_anviar_carrito))}">
                       
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                     <path d="M0 0.5C0 0.367392 0.0526784 0.240215 0.146447 0.146447C0.240215 0.0526784 0.367392 0 0.5 0H2C2.11153 3.08115e-05 2.21985 0.0373507 2.30773 0.106025C2.39561 0.174699 2.45801 0.270784 2.485 0.379L2.89 2H14.5C14.5734 2.00007 14.6459 2.0163 14.7124 2.04755C14.7788 2.0788 14.8375 2.12429 14.8844 2.1808C14.9313 2.23731 14.9651 2.30345 14.9835 2.37452C15.002 2.44558 15.0045 2.51984 14.991 2.592L13.491 10.592C13.4696 10.7066 13.4087 10.8101 13.3191 10.8846C13.2294 10.9591 13.1166 10.9999 13 11H4C3.88343 10.9999 3.77057 10.9591 3.68091 10.8846C3.59126 10.8101 3.53045 10.7066 3.509 10.592L2.01 2.607L1.61 1H0.5C0.367392 1 0.240215 0.947322 0.146447 0.853553C0.0526784 0.759785 0 0.632608 0 0.5ZM5 11C4.46957 11 3.96086 11.2107 3.58579 11.5858C3.21071 11.9609 3 12.4696 3 13C3 13.5304 3.21071 14.0391 3.58579 14.4142C3.96086 14.7893 4.46957 15 5 15C5.53043 15 6.03914 14.7893 6.41421 14.4142C6.78929 14.0391 7 13.5304 7 13C7 12.4696 6.78929 11.9609 6.41421 11.5858C6.03914 11.2107 5.53043 11 5 11ZM12 11C11.4696 11 10.9609 11.2107 10.5858 11.5858C10.2107 11.9609 10 12.4696 10 13C10 13.5304 10.2107 14.0391 10.5858 14.4142C10.9609 14.7893 11.4696 15 12 15C12.5304 15 13.0391 14.7893 13.4142 14.4142C13.7893 14.0391 14 13.5304 14 13C14 12.4696 13.7893 11.9609 13.4142 11.5858C13.0391 11.2107 12.5304 11 12 11ZM5 12C5.26522 12 5.51957 12.1054 5.70711 12.2929C5.89464 12.4804 6 12.7348 6 13C6 13.2652 5.89464 13.5196 5.70711 13.7071C5.51957 13.8946 5.26522 14 5 14C4.73478 14 4.48043 13.8946 4.29289 13.7071C4.10536 13.5196 4 13.2652 4 13C4 12.7348 4.10536 12.4804 4.29289 12.2929C4.48043 12.1054 4.73478 12 5 12ZM12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12Z" fill="black"/>
                                </svg> 
                                    
                            </a>
                            </button>

                            
                            <button title="Agregar mis favoritos" type="button" class="btn btn-light btn-favoritos" producto_id="${item.id}">
 <a href="productos-deseados.html?producto=${encodeURIComponent(JSON.stringify(artenia_deseados))}">

  <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.5 13.7625L6.4125 12.7725C2.55 9.27 0 6.9525 0 4.125C0 1.8075 1.815 0 4.125 0C5.43 0 6.6825 0.6075 7.5 1.56C8.3175 0.6075 9.57 0 10.875 0C13.185 0 15 1.8075 15 4.125C15 6.9525 12.45 9.27 8.5875 12.7725L7.5 13.7625Z" fill="red"/>
                                </svg> 
                                
   </a>
                               
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
        /*html = html + `
              <div class="col-12 col-sm-6 col-md-4 mb-4">
                            <div class="product-card car-item wow fadeIn" data-wow-duration="0.75s">
                                <div class="thumb-content">
                                    <div class="car-banner nuevo-producto">
                                    	
                                    </div>
                                    <div class="thumb-inner photo-prod">
                                        <a href="producto.html?id=${item.id}"><img style="height:250px" src="${item?.imagen_principal || "https://via.placeholder.com/400x200"}" alt=""></a>
                                    </div>
                                </div>
                                <div class="down-content">
  <a href="producto.html?id=${item.id}" style="color:#000">
                                	
                                    <h5 title="${item?.nombres_es || ""}" class="card-title font-weight-bold product-description">${item?.nombres_es || ""}</h5>
</a>
                                    <p class="h4 text-danger font-weight-bold">S/.${formatearNumero(item?.precio) || ""} </p>
                                    <p class="card-text text-muted">Categoría: ${item?.categoria}</p>
                                    <div class="d-flex align-items-center mt-3" title="Artesano">
                                        <img class="rounded-circle mr-2"
                                            src="${item?.foto1 || "https://via.placeholder.com/40"}"
                                            alt="Jose Mendoza" style="width: 40px; height: 40px;">
                                        <span class="text-dark">
                                        <a style: "color:#dedede!important" href="artesano.html?id=${item?.artesano_id}"> ${item?.artesano || ""}</a>
                                       
                                         
                                         </span>
                                            <div class="line-dec2"></div>
                            	
                                    </div>
                                        <div class="d-flex mt-4">

                                    <div class="btn-group" role="group" aria-label="Basic example">
  <button type="button" class="btn btn-light"><a class="" href="producto.html?id=${item.id}">Ver más</a></button>
  <button type="button" class="btn btn-light btn-comprar" producto_id="${item.id}"><svg
                                                width="15" height="15" viewBox="0 0 15 15" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M0 0.5C0 0.367392 0.0526784 0.240215 0.146447 0.146447C0.240215 0.0526784 0.367392 0 0.5 0H2C2.11153 3.08115e-05 2.21985 0.0373507 2.30773 0.106025C2.39561 0.174699 2.45801 0.270784 2.485 0.379L2.89 2H14.5C14.5734 2.00007 14.6459 2.0163 14.7124 2.04755C14.7788 2.0788 14.8375 2.12429 14.8844 2.1808C14.9313 2.23731 14.9651 2.30345 14.9835 2.37452C15.002 2.44558 15.0045 2.51984 14.991 2.592L13.491 10.592C13.4696 10.7066 13.4087 10.8101 13.3191 10.8846C13.2294 10.9591 13.1166 10.9999 13 11H4C3.88343 10.9999 3.77057 10.9591 3.68091 10.8846C3.59126 10.8101 3.53045 10.7066 3.509 10.592L2.01 2.607L1.61 1H0.5C0.367392 1 0.240215 0.947322 0.146447 0.853553C0.0526784 0.759785 0 0.632608 0 0.5ZM5 11C4.46957 11 3.96086 11.2107 3.58579 11.5858C3.21071 11.9609 3 12.4696 3 13C3 13.5304 3.21071 14.0391 3.58579 14.4142C3.96086 14.7893 4.46957 15 5 15C5.53043 15 6.03914 14.7893 6.41421 14.4142C6.78929 14.0391 7 13.5304 7 13C7 12.4696 6.78929 11.9609 6.41421 11.5858C6.03914 11.2107 5.53043 11 5 11ZM12 11C11.4696 11 10.9609 11.2107 10.5858 11.5858C10.2107 11.9609 10 12.4696 10 13C10 13.5304 10.2107 14.0391 10.5858 14.4142C10.9609 14.7893 11.4696 15 12 15C12.5304 15 13.0391 14.7893 13.4142 14.4142C13.7893 14.0391 14 13.5304 14 13C14 12.4696 13.7893 11.9609 13.4142 11.5858C13.0391 11.2107 12.5304 11 12 11ZM5 12C5.26522 12 5.51957 12.1054 5.70711 12.2929C5.89464 12.4804 6 12.7348 6 13C6 13.2652 5.89464 13.5196 5.70711 13.7071C5.51957 13.8946 5.26522 14 5 14C4.73478 14 4.48043 13.8946 4.29289 13.7071C4.10536 13.5196 4 13.2652 4 13C4 12.7348 4.10536 12.4804 4.29289 12.2929C4.48043 12.1054 4.73478 12 5 12ZM12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12Z"
                                                    fill="black" />
                                            </svg> Comprar</button>
  <button type="button" class="btn btn-light btn-favoritos" producto_id="${item.id}">	<svg width="15" height="14" viewBox="0 0 15 14" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M7.5 13.7625L6.4125 12.7725C2.55 9.27 0 6.9525 0 4.125C0 1.8075 1.815 0 4.125 0C5.43 0 6.6825 0.6075 7.5 1.56C8.3175 0.6075 9.57 0 10.875 0C13.185 0 15 1.8075 15 4.125C15 6.9525 12.45 9.27 8.5875 12.7725L7.5 13.7625Z"
                                                    fill="red" />
                                            </svg> Favorito</button>
</div>
                                    	
                                       

                                	
                                	
                                    </div>

                                </div>
                            </div>
                        </div>


        `*/
    }
    $('#listaProductosNovedades').append(html)


}

function generatePaginationHTML (totalPages) {


    const maxVisiblePages = 5; // Máximo número de páginas visibles en la paginación

    // Obtener el parámetro `page` de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentPage = parseInt(urlParams.get('page')) || 1;

    let paginationHTML = '<div class="page-numbers"><div class="pagination-content"><ul>';

    // Botón "Primero"
    if (currentPage > 1) {
        paginationHTML += `<li><a href="#" onclick="goToPage(1)">Primero</a></li>`;
    }

    // Botón "Anterior"
    if (currentPage > 1) {
        paginationHTML += `<li><a href="#" onclick="goToPage(${currentPage - 1})">Anterior</a></li>`;
    }

    if (totalPages <= maxVisiblePages) {
        // Mostrar todas las páginas si el total de páginas es menor o igual al máximo visible
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += generatePageItem(i, currentPage);
        }
    } else {
        // Mostrar la primera página
        paginationHTML += generatePageItem(1, currentPage);

        if (currentPage > Math.ceil(maxVisiblePages / 2) + 1) {
            paginationHTML += '<li><span>...</span></li>';
        }

        // Calcular el rango de páginas a mostrar
        const startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxVisiblePages / 2));

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += generatePageItem(i, currentPage);
        }

        if (currentPage < totalPages - Math.floor(maxVisiblePages / 2)) {
            paginationHTML += '<li><span>...</span></li>';
        }

        // Mostrar la última página
        paginationHTML += generatePageItem(totalPages, currentPage);
    }

    // Botón "Siguiente"
    if (currentPage < totalPages) {
        paginationHTML += `<li><a href="#" onclick="goToPage(${currentPage + 1})">Siguiente</a></li>`;
    }

    // Botón "Último"
    if (currentPage < totalPages) {
        paginationHTML += `<li><a href="#" onclick="goToPage(${totalPages})">Último</a></li>`;
    }

    paginationHTML += '</ul></div></div>';
    return paginationHTML;

}

function generatePageItem (pageNumber, currentPage) {
    if (pageNumber === currentPage) {
        return `<li class="active"><a href="#" onclick="goToPage(${pageNumber})">${pageNumber}</a></li>`;
    } else {
        return `<li><a href="#" onclick="goToPage(${pageNumber})">${pageNumber}</a></li>`;
    }
}

function goToPage (pageNumber) {
    let url = new URL(window.location.href);
    url.searchParams.set('page', pageNumber);
    window.location.href = url.href;
}
window.goToPage = goToPage
// Llamar a la función para rellenar el formulario al cargar la página


async function cargarDataPortada () {

    let resultado = await getPortadaBusqueda()
    cargarComboCategorias(resultado.listCategorias)
    cargarComboAertesanos(resultado.listArtesanos)
}

function cargarComboCategorias (list) {

    let html = `
<option value="">- TODOS -</option>
    `;

    for (let item of list) {
        // Escapar los valores para evitar problemas de seguridad
        const idEscaped = $('<div>').text(item.id).html();
        const categoriaEscaped = $('<div>').text(item.categoria).html();

        html += `<option value="${idEscaped}">${categoriaEscaped}</option>\n`;
    }

    // Reemplazar el contenido de #categorias con el nuevo HTML
    $('#id_categoria').html(html);

}

function cargarComboAertesanos (list) {
    let html = `
<option value="">- TODOS -</option>
    `;

    for (let item of list) {
        // Escapar los valores para evitar problemas de seguridad
        const idEscaped = $('<div>').text(item.id).html();
        const categoriaEscaped = $('<div>').text(item.artesano).html();

        html += `<option value="${idEscaped}">${categoriaEscaped}</option>\n`;
    }

    // Reemplazar el contenido de #categorias con el nuevo HTML
    $('#id_artesano').html(html);
}

function ordenamientosBusqueda () {
    let valorordenamiento = $('#drpordenamientosbusqueda option:selected').val()
    // alert(valorordenamiento)

    // Obtener los parámetros actuales de la URL
    const currentParams = new URLSearchParams(window.location.search);

    // Agregar o actualizar el parámetro 'order' con el valor seleccionado
    currentParams.set('order', valorordenamiento);

    // Redirige a la misma página con los parámetros actualizados en la URL
    window.location.href = '?' + currentParams.toString();

    // Previene el submit tradicional
    return false;
    /* const formulario = $('#miFormulario');
     const formData = new FormData(formulario[0]);
     const params = new URLSearchParams();
 
     formData.forEach((value, key) => {
         if (value) {  // Solo agregar a la URL si el valor no está vacío
             params.append(key, value);
         }
     });
     params.append('order', valorordenamiento);
     // Redirige a la misma página con los nuevos parámetros en la URL
     window.location.href = '?' + params.toString();
 
     // Previene el submit tradicional
     return false;*/


}

