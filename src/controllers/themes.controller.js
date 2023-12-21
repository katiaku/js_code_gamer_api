const { pool } = require('../database');
const {express} = require('express');

const getThemes = async (req, res) => {
    try {
        let params = [req.query.iduser];
        console.log(params);
        let sql;
        sql = `SELECT l.title AS 'level', t.title AS 'theme', t.content, t.code FROM themes AS t
            INNER JOIN levels AS l ON (l.idlevels = t.id_level)
            INNER JOIN user_theme AS ut ON (ut.idtheme = t.idthemes) 
            WHERE ut.iduser = ?`;
        let [result] = await pool.query(sql, params);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};

module.exports = {
    getThemes
};
