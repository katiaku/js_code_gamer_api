const { pool } = require('../database');
const {express} = require('express');

const getThemes = async (req, res) => {
    try {
        let params = [req.query.iduser];
        console.log(params);
        let sql;
        sql = `SELECT l.title, t.title, t.content, t.code FROM themes as t
            INNER JOIN levels as l ON (l.idlevels = t.id_level)
            INNER JOIN user_theme as ut ON (ut.idtheme = t.idthemes) 
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
