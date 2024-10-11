const model = require('../models/pedido');
const { Op } = require('sequelize');
const modelPedido = require('../models/pedido');
const modelCliente = require('../models/cliente');
const modelArtesano = require('../models/artesano');
const { emailPedidoArtesania } = require("../services/mails/mails");

modelPedido.belongsTo(modelCliente, { foreignKey: 'cliente_id' });
modelPedido.belongsTo(modelArtesano, { foreignKey: 'artesano_id' });


module.exports = {
    guardar,
    actualizar,
    eliminar,
    listar,
    save,
    filtrar,
    uploadFileAtencion,
    reporte1,
    reporte2,
    enviarPedido,
    registrarCompra,
    obtener: async (req, res) => {
        const idPedido = req.params.id;

        try {
            const pedido = await obtenerPedido(idPedido);
            res.json(pedido);
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({ error: error.message || 'Error al obtener el pedido' });
        }
    }
};


function reporte1 (req, res) {


    let sql = ``;
    sql =
        `
        SELECT
            SUM(CASE WHEN estado = 'pagado' THEN 1 ELSE 0 END) AS pagado,
            SUM(CASE WHEN estado = 'envio' THEN 1 ELSE 0 END) AS envio,
            SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) AS pendiente,
            SUM(CASE WHEN estado = 'proceso' THEN 1 ELSE 0 END) AS proceso
        FROM pedido
        WHERE 1=1 AND artesano_id = '${req.params.id}'
    `;



    model.sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
        .then(resultset => {
            res.status(200).json(resultset)
        })
        .catch(error => {
            res.status(400).send(error)
        })
}


function reporte2 (req, res) {


    let sql = ``;
    sql =
        `
        SELECT
            num_pedido,
            fecha_pedido,
            estado 
        FROM pedido
        WHERE 1=1 AND artesano_id = '${req.params.id}'
    `;



    model.sequelize.query(sql, { type: sequelize.QueryTypes.SELECT })
        .then(resultset => {
            res.status(200).json(resultset)
        })
        .catch(error => {
            res.status(400).send(error)
        })
}

function guardar (req, res) {
    model.create(req.body)
        .then(object => {
            res.status(200).json(object);
        })
        .catch(error => {
            res.status(400).send(error);
        });
}

function actualizar (req, res) {
    model.findOne({
        where: { num_pedido: req.params.id }
    })
        .then(object => {
            object.update(req.body)
                .then(object => res.status(200).json(object))
                .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
}

function eliminar (req, res) {
    model.findOne({
        where: { num_pedido: req.body.id }
    })
        .then(object => {
            object.destroy();
            res.status(200).json(object);
        })
        .catch(error => res.status(400).send(error));
}

// function obtener(req, res) {
//     model.findOne({
//         where: { num_pedido: req.params.id }
//     })
//         .then(resultset => {
//             res.status(200).json(resultset);
//         })
//         .catch(error => {
//             res.status(400).send(error);
//         });
// }
async function obtenerPedido (idPedido) {
    try {
        const pedidoResult = await modelPedido.findOne({
            where: { num_pedido: idPedido },
            attributes: {
                exclude: ['cliente_id', 'artesano_id'] // Excluir los campos cliente_id y artesano_id
            },
            include: [
                {
                    model: modelCliente,
                    attributes: [
                        'nombres',
                        'apellidos',
                        'numero_documento',
                        'correo',
                        'telefono',
                        'tipo_documento',
                        'numero_documento',
                        'direccion',
                        'pais',
                        'region',
                        'ciudad'
                    ]
                },
                {
                    model: modelArtesano,
                    attributes: ['nombres', 'apellidos']
                }
            ]
        });

        if (!pedidoResult) {
            throw {
                error: new Error("pedido no encontrado"),
                message: "pedido no encontrado",
                status: 404
            };
        }

        return pedidoResult;
    } catch (error) {
        throw error;
    }
}


// function listar(req, res) {
//     modelPedido.findAll({
//         attributes: {
//             exclude: ['cliente_id', 'artesano_id']
//         },
//         include: [
//             {
//                 model: modelCliente,
//                 attributes: [
//                     'nombres',
//                     'apellidos'
//                 ]
//             },
//             {
//                 model: modelArtesano,
//                 attributes: ['nombres', 'apellidos']
//             }
//         ]
//     })
//         .then(resultset => {
//             res.status(200).json(resultset);
//         })
//         .catch(error => {
//             console.error('Error al listar pedidos:', error);
//             res.status(500).json({ message: 'Error interno del servidor' });
//         });
// }
const DEFAULT_PAGE_LIMIT = 10; // Número predeterminado de resultados por página

function listar (req, res) {
    const page = parseInt(req.query.page) || 1; // Página solicitada, por defecto la primera
    const limit = parseInt(req.query.limit) || DEFAULT_PAGE_LIMIT; // Límite de resultados por página

    const offset = (page - 1) * limit; // Calcular el desplazamiento

    modelPedido.findAndCountAll({
        attributes: {
            exclude: ['cliente_id', 'artesano_id']
        },
        include: [
            {
                model: modelCliente,
                attributes: [
                    'nombres',
                    'apellidos'
                ]
            },
            {
                model: modelArtesano,
                attributes: ['nombres', 'apellidos']
            }
        ],
        limit: limit,
        offset: offset
    })
        .then(result => {
            const { count, rows } = result;
            const totalPages = Math.ceil(count / limit); // Calcular el número total de páginas

            res.status(200).json({
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                pedidos: rows
            });
        })
        .catch(error => {
            console.error('Error al listar pedidos:', error);
            res.status(500).json({ message: 'Error interno del servidor' });
        });
}

async function save (req, res, next) {
    const t = await model.sequelize.transaction();
    try {
        let object = await model.findOne({
            where: {
                num_pedido: req.body.id ? req.body.id : 0
            }
        });

        if (object != null) {
            let obj = { ...object.dataValues, ...req.body };
            for (const prop in obj) {
                object[prop] = obj[prop];
            }
            object.usuaregistra_id = req.userId;
            await object.save({ t });
        } else {
            object = await model.create({ ...req.body }, { t });
        }
        t.commit().then();
        return res.status(200).send(object);
    } catch (e) {
        t.rollback();
        return next(e);
    }
}


async function filtrar (req, res) {
    try {
        let { page, limit, fecha_pedido, num_pedido, nombre_artesano, nombre_cliente, estado } = req.query;

        // Convertir a números enteros y establecer valores predeterminados si no se proporcionan
        page = parseInt(page) || 1;
        limit = parseInt(limit) || DEFAULT_PAGE_LIMIT;

        const whereCondition = {};

        if (fecha_pedido) {
            whereCondition.fecha_pedido = {
                [Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE', Sequelize.col('fecha_pedido')), fecha_pedido)
                ]
            };
        }

        if (num_pedido) {
            whereCondition.num_pedido = num_pedido;
        }

        if (estado) {
            whereCondition.estado = estado;
        }

        const includeCondition = [];

        if (nombre_cliente) {
            includeCondition.push({
                model: modelCliente,
                where: {
                    [Op.or]: [
                        { nombres: { [Op.like]: `%${nombre_cliente}%` } },
                        { apellidos: { [Op.like]: `%${nombre_cliente}%` } }
                    ]
                }
            });
        } else {
            includeCondition.push({
                model: modelCliente,
                attributes: ['nombres', 'apellidos']
            });
        }

        if (nombre_artesano) {
            includeCondition.push({
                model: modelArtesano,
                where: {
                    [Op.or]: [
                        { nombres: { [Op.like]: `%${nombre_artesano}%` } },
                        { apellidos: { [Op.like]: `%${nombre_artesano}%` } }
                    ]
                }
            });
        } else {
            includeCondition.push({
                model: modelArtesano,
                attributes: ['nombres', 'apellidos']
            });
        }

        const offset = (page - 1) * limit; // Calcular el desplazamiento

        const result = await modelPedido.findAndCountAll({
            where: whereCondition,
            include: includeCondition,
            attributes: {
                exclude: ['cliente_id', 'artesano_id']
            },
            limit: limit,
            offset: offset
        });

        const totalPages = Math.ceil(result.count / limit); // Calcular el número total de páginas

        res.json({
            totalItems: result.count,
            totalPages: totalPages,
            currentPage: page,
            pedidos: result.rows
        });
    } catch (error) {
        console.error('Error al buscar pedidos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

async function uploadFileAtencion (req, res, next) {
    try {
        let folder = 'files-app' + req.query.folder;
        let filenamesaved = req.filenamesaved;
        if (!filenamesaved) throw {
            error: "No se logro subir el archivo",
            message: "Ha habido un error",
            status: 400
        }

        let file = folder + req.filenamesaved
        return res.status(200).send({
            nombrearchuvo: req.originalname, ruta: file
        });

    } catch (err) {
        return next(err);
    }
}


async function enviarPedido (req, res, next) {


    const t = await model.sequelize.transaction();
    try {
        //

        const object = await modelPedido.create(req.body);
        //Valida que esta creado y envia correo

        return res.status(200).send(object);
    } catch (e) {
        t.rollback();
        return next(e);
    }
}


async function registrarCompra (req, res) {
    const t = await sequelize.transaction(); // Inicia la transacción
    try {
        const { datosCliente, pedido } = req.body;

        // Buscar el cliente por DNI
        let cliente = await modelCliente.findOne({
            where: { dni: datosCliente.dni },
            transaction: t
        });

        // Si no existe el cliente, crearlo
        if (!cliente) {
            cliente = await modelCliente.create(
                req.body.datosCliente, // Asegúrate de que req.body.cliente tenga los datos correctos del cliente
                { transaction: t }
            );
        }

        // Crear el pedido y asociar el idCliente
        const nuevoPedido = await modelPedido.create(
            {
                ...pedido, // Datos del pedido desde req.body.pedido
                idCliente: cliente.id // Usar el id del cliente recién creado o existente
            },
            { transaction: t }
        );

        if (nuevoPedido) {
            emailPedidoArtesania({ correos, cliente, pedido })
        }

        // Confirma la transacción
        await t.commit();

        // Responder con el objeto creado
        res.status(200).json(nuevoPedido);
    } catch (error) {
        // Si ocurre un error, revertir la transacción
        await t.rollback();
        return next(e);
    }
}