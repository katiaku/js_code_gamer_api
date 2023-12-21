const { pool } = require('../database');
const {express} = require('express');

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

const userRetos = async (req, res) => {
    try {
        console.log(req.query);
        let params = [ req.id_level];
        let sql = 'SELECT l.title, c.title, c.content, c.code  FROM challenges as c '+
                'INNER JOIN levels as l ON (l.idlevels = c.id_level) '+
                'INNER JOIN `db-js-code-gamer`.user_challenges as uc ON (uc.idchallenge = c.idchallenges) '+ 
                'WHERE uc.iduser = ? AND '+ 
                'c.id_level = ? AND '+
                'uc.activated = ?;';
        console.log(sql);

        let [result] = await pool.query(sql, params);
        console.log(result);
        let respuesta = {
            error: false,
            code: 200,
            message: "Tema " + req.body.idtheme,
            data: result  
        }

        console.log(respuesta);
        
        res.send(respuesta);
    } catch (err) {
        console.log(err);
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
    userLogin,
    userRetos
};
