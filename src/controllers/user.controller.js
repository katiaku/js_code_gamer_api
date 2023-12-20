const { pool } = require('../database');

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

module.exports = { userRegister, userStatus };
