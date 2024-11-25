import { baseUrl, getDataFromLocalStorage } from '../utils/config';

export async function getprogramasbyIESTP (iestpid) {
  try {

    const myHeaders = new Headers();
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(baseUrl + "/api/listarProgramasIESTP?iestpid=" + iestpid, requestOptions);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log('error', error);
  }

}


/*export async function buscarProducto (search) {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  try {
    const response = await fetch(baseUrl+"/api/producto/buscar" + `search?search=${encodeURIComponent(search)}`, requestOptions);

    // Si esperas un JSON en la respuesta, usa response.json() en vez de response.text()
    const result = await response.json();

    //console.log(result);

    // Si necesitas retornar los resultados para ser usados posteriormente
    return result;
  } catch (error) {
    console.error("Error al buscar los certificados:", error);

    // Si necesitas que la función arroje el error hacia el código que la llame
    throw error;
  }
}*/



export async function buscarProducto (filtro) {

  try {
    alert("token")
    console.log(getDataFromLocalStorage('accessToken'))
    const settings = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + getDataFromLocalStorage('accessToken')
      }
    }
    const params = new URLSearchParams(filtro);
    const response = await fetch(baseUrl + `/productos?${params}`, settings);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al buscar las producto:", error);
  }
}


export async function guardarProducto (producto) {
  if (producto.productId != 0) {
    producto.id = producto.productId;
  }

  const settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Cambiado a JSON
    },
    body: JSON.stringify(producto), // Convertir objeto a JSON
  };

  try {
    const response = await fetch(baseUrl + "/producto/save", settings);
    const data = await response.json();
    return data; // Ahora data contiene el ID del objeto creado y otros datos
  } catch (error) {
    console.error("Error:", error);
  }
}
export async function geteditarproducto (id) {
  try {

    const myHeaders = new Headers();
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(baseUrl + "/producto/" + id, requestOptions);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log('error', error);
  }

}

export async function lstcategoria () {
  try {

    const myHeaders = new Headers();
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(baseUrl + "/categoria", requestOptions);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log('error', error);
  }

}





export async function buscarartesanoDNI (dni) {
  try {

    const myHeaders = new Headers();
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(baseUrl + "/artesano-dni/" + dni, requestOptions);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log('error', error);
  }

}
export async function buscarartesanoid (id) {
  try {

    const myHeaders = new Headers();
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(baseUrl + "/artesano/" + id, requestOptions);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log('error', error);
  }

}





export async function getusuariocapacitacion (dni) {
  try {

    const myHeaders = new Headers();
    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    const response = await fetch(baseUrl + "/api/nota/" + dni, requestOptions);
    const result = await response.json();

    return result;
  } catch (error) {
    console.log('error', error);
  }

}

export async function deleteUserCapacitacion (usuario) {
  const settings = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(usuario),
  };

  try {
    const response = await fetch(baseUrl + "/api/nota", settings);
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error:", error);
  }
}





export async function nuevoUserCapacitacion (usuario) {
  if (usuario.programaid == 0) {
    usuario.programaid = null;
  }

  const settings = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(usuario),
  };

  try {
    const response = await fetch(baseUrl + "/api/nota", settings);
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error:", error);
  }
}



export async function buscarArtesano (filtro) {

  try {
    const params = new URLSearchParams(filtro);
    const response = await fetch(baseUrl + `/artesanos?${params}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error al buscar las artesano:", error);
  }
}


async function cargar () {

  let datos = await listarArtesanosCombo()

  $('#drp-artesano-dni').select2({
    placeholder: 'Seleccione una opción',
    allowClear: true,
    data: datos.map(function (item) {
      return {
        id: item.id,
        text: item.nombre
      };
    })
  });

  // Mostrar el valor seleccionado en el input
  $('#drp-artesano-dni').on('select2:select', function (e) {
    var data = e.params.data;
    $('#dni').val(data.text);  // Asigna el texto seleccionado al input
  });
}

