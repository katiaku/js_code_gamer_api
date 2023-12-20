const { pool } = require('../database');
const {express} = require('express')

// const userRegister = async (req, res) => {
//     try {
//         console.log(req.body);
//         let params = [req.body.name_surname, req.body.email, req.body.username, req.body.photo, req.body.password];
//         let sql = `INSERT INTO user (name_surname, email, username, photo, password) 
//                     VALUES (?, ?, ?, ?, ?)`;
//         console.log(sql);

//         let [result] = await pool.query(sql, params);
//         console.log(result);

//         if (result.insertId)
//             res.send(String(result.insertId));
//         else
//             res.send('Fallo en el registro de usuario');
//     } catch (err) {
//         console.log(err);
//     }
// };

const userRegister = async (req, res) => {
    try {
        const { name_surname, email, username, photo, password } = req.body;
        const [result] = await pool.query('CALL registerUser(?, ?, ?, ?, ?)', [name_surname, email, username, photo, password]);
        const insertId = result[0][0].insertId;

        if (insertId > 0) {
            res.send(String(insertId));
        } else {
            res.send('Error en el registro de usuario. El email ya está registrado.');
        }
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};

const userLogin = async (req, res) => {
    try {
        let sql = "SELECT * FROM user WHERE email = ? AND password = ?";
        let [result] = await pool.query(sql, [req.body.email, req.body.password]);

        if (result.length > 0) {
            const userWithoutPassword = { ...result[0], password: undefined };
            res.status(200).json(userWithoutPassword);
        } else {
            res.status(401).send('Credenciales incorrectas');
        }
    } catch (error) {
        console.error("Error al realizar la consulta de inicio de sesión:", error);
        res.status(500).send('Error interno del servidor');
    }
};

module.exports = {
    userRegister,
    userLogin
};
