const { pool } = require('../database');
const {express} = require('express')

const userRegister = async (req, res) => {
    try {
        console.log(req.body);
        let params = [req.body.name_surname, req.body.email, req.body.username, req.body.photo, req.body.password];
        let sql = `INSERT INTO user (name_surname, email, username, photo, password) 
                    VALUES (?, ?, ?, ?, ?)`;
        console.log(sql);

        let [result] = await pool.query(sql, params);
        console.log(result);

        if (result.insertId)
            res.send(String(result.insertId));
        else
            res.send('Fallo en el registro de usuario');
    } catch (err) {
        console.log(err);
    }
};

const userStatus = async (req, res) => {
    try {
        console.log(req.body);
        let params = [req.body.iduser, req.body.idtheme];
        let sql = 'SELECT l.title, t.title, t.content, t.code  FROM themes as t '+
                'INNER JOIN levels as l ON (l.idlevels = t.id_level) '+
                'INNER JOIN `db-js-code-gamer`.user_theme as ut ON (ut.idtheme = t.idthemes) '+
                'WHERE ut.iduser = ? AND '+
                    'ut.idtheme = ?;';
        console.log(sql);

        let [result] = await pool.query(sql, params);
        console.log(result);
        let respuesta = {
            error: false,
            code: 200,
            message: "Tema " + req.body.idtheme,
            data: result  
        }

        
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
    userStatus
};