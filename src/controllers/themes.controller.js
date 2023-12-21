const { pool } = require('../database');
const {express} = require('express');

// const getThemes = async (req, res) => {
//     try {
//         let params = [req.query.iduser];
//         console.log(params);
//         let sql;
//         sql = `SELECT l.title AS 'level', t.id_level AS 'level_id', t.title AS 'theme', t.content, t.code FROM themes AS t
//             INNER JOIN levels AS l ON (l.idlevels = t.id_level)
//             INNER JOIN user_theme AS ut ON (ut.idtheme = t.idthemes) 
//             WHERE ut.iduser = ? AND t.id_level = 1`;
//         let [result] = await pool.query(sql, params);
//         res.send(result);
//     } catch (err) {
//         console.log(err);
//         res.send('Error en el servidor');
//     }
// };

const getThemes = async (req, res) => {
    try {
        let sql;
        sql = `SELECT l.title AS 'title_level', t.id_level, t.title AS 'theme_title', t.content, t.code FROM themes AS t
            INNER JOIN levels AS l ON (l.idlevels = t.id_level)
            INNER JOIN user_theme AS ut ON (ut.idtheme = t.idthemes) 
            WHERE ut.iduser = 1 AND t.id_level = 1`;
        let [result] = await pool.query(sql);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};

module.exports = {
    getThemes
};
