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

const getActiveRetos = async (req, res) => {
    try {
        let params = [req.query.iduser];
        console.log(params);
        let sql;
        sql = `SELECT c.id_level from user_challenges as uc
        INNER JOIN challenges as c ON(c.idchallenges = uc.idchallenge)
        WHERE iduser = ? and activate = 1
        group by id_level;`;
        let [result] = await pool.query(sql, params);
        let respuesta = {
            error: false,
            code: 200,
            message: "Temas activos",
            data: result  
        }

        console.log(respuesta.data);
        res.send(respuesta);
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};


const getCompletedRetos = async (req, res) => {
    try {
        let params = [req.query.iduser];
        console.log(params);
        let sql;
        sql = `SELECT c.id_level from challenges as c
        INNER JOIN user_challenges as uc ON(c.idchallenges = uc.idchallenge)
        WHERE iduser = ? and completed = 0
        group by id_level;`;
        let [result] = await pool.query(sql, params);
        let respuesta = {
            error: false,
            code: 200,
            message: "Temas activos",
            data: result  
        }

        console.log(respuesta.data);
        res.send(respuesta);
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};

const activateRetos = async (req, res) => {
    try {
        let params = [req.query.iduser, req.query.id_level];
        console.log(params);
        let sql;
        sql = `UPDATE  user_challenges as uc
        INNER JOIN challenges as c ON (c.idchallenges = uc.idchallenge)
        SET uc.activate = 1
        WHERE iduser = ? and completed = 0 and c.id_level = ?;`;
        let [result] = await pool.query(sql, params);
        let respuesta = {
            error: false,
            code: 200,
            message: "Temas activos",
            data: result  
        }

        console.log(respuesta.data);
        res.send(respuesta);
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

const markRetosCompleted = async (req, res) => {
    try {
        let params = [req.query.iduser, req.query.idchallenge];
        console.log(params);
        let sql;
        sql = `UPDATE user_challenges AS uc
        INNER JOIN challenges AS c ON uc.idchallenge = c.idchallenges
        SET uc.completed = 1, uc.activate = 0
        WHERE uc.iduser = ? AND uc.idchallenge = ?`;
        let [result] = await pool.query(sql, params);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};

const markRetosTemaCompletos = async (req, res) => {
    try {
        let params = [req.query.iduser, req.query.idchallenge];
        console.log(params);
        let sql;
        sql = `UPDATE user_challenges AS uc
        INNER JOIN challenges AS c ON uc.idchallenge = c.idchallenges
        SET uc.activate = 1
        WHERE uc.iduser = ? AND uc.idchallenge = (? + 1)`;
        let [result] = await pool.query(sql, params);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};

const markTemaCompleted = async (req, res) => {
    try {
        let params = [req.query.iduser, req.query.id_level];
        console.log(params);
        let sql;
        sql = `UPDATE user_challenges AS uc
        INNER JOIN challenges AS c ON uc.idchallenge = c.idchallenges
        SET uc.activate = 1
        WHERE uc.iduser = ? AND c.id_level = ?;`;
        let [result] = await pool.query(sql, params);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send('Error en el servidor');
    }
};

module.exports = {
    getThemes,
    getActiveRetos,
    markThemesCompleted,
    markRetosCompleted,
    markRetosTemaCompletos,
    getCompletedRetos,
    markTemaCompleted,
    activateRetos
};
