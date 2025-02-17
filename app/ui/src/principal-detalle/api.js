import { baseUrl } from '../utils/config'
export async function obtenerProducto (idprod) {
    try {
        const response = await fetch(`${baseUrl}/producto/${idprod}`, { method: 'GET' });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function obtenerArtesano (idartesano) {
    try {
        const response = await fetch(`${baseUrl}/artesano/${idartesano}`, { method: 'GET' });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}


export async function listarArtesanos (filtro) {

    try {
        const params = new URLSearchParams(filtro);
        const response = await fetch(baseUrl + `/artesanos?${params}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error al buscar las artesano:", error);
    }
}


export async function listarArtesanosCombo (filtro) {

    try {
        //  const params = new URLSearchParams(filtro);
        const response = await fetch(baseUrl + `artesanos-combo`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error al buscar las artesano:", error);
    }
}




export async function listarProductos (filtro) {
    try {
        const params = new URLSearchParams(filtro);
        const response = await fetch(`${baseUrl}/prductosFiltrados?${params}`, { method: 'GET' });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function listarProductosPorCategoria (categoriaID) {
    try {
        const response = await fetch(`${baseUrl}/v1/productos/categoria/${categoriaID}`, { method: 'GET' });
        const result = await response.json();
        console.log("productos: ", result);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}