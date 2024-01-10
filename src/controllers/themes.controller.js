const { pool } = require('../database');
const {express} = require('express');

const getThemes = async (req, res) => {
    try {
        let params = [req.query.iduser, req.query.id_level];
        console.log(params);
        let sql;
        sql = `SELECT l.title AS 'title_level', l.intro, t.id_level, t.title AS 'theme_title', t.content, t.code FROM themes AS t
            INNER JOIN levels AS l ON (l.idlevels = t.id_level)
            INNER JOIN user_theme AS ut ON (ut.idtheme = t.idthemes) 
            WHERE ut.iduser = ? AND t.id_level = ?`;
        let [result] = await pool.query(sql, params);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};

const markThemesCompleted = async (req, res) => {
    try {
        let params = [req.query.iduser, req.query.id_level];
        console.log(params);
        let sql;
        sql = `UPDATE user_theme AS ut
            INNER JOIN themes AS t ON ut.idtheme = t.idthemes
            SET ut.completed = 1
            WHERE ut.iduser = ? AND t.id_level = ?`;
        let [result] = await pool.query(sql, params);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};

module.exports = {
    getThemes,
    markThemesCompleted
};
