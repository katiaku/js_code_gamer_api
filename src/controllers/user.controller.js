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

module.exports = { userRegister };
