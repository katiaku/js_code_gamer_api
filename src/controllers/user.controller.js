const { pool } = require('../database');
const {express} = require('express');

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
        let params = [req.query.iduser, req.query.id_level, req.query.activate];
        let sql = `SELECT l.title as unit, c.title, c.content, c.code  FROM challenges as c 
                INNER JOIN levels as l ON (l.idlevels = c.id_level) 
                INNER JOIN user_challenges as uc ON (uc.idchallenge = c.idchallenges) 
                WHERE uc.iduser = ? AND 
                c.id_level = ? AND 
                uc.activate = ?;`;
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
        let sql = `
        SELECT
	user.*,
    user_theme.iduser AS user_theme_iduser,
    themes.id_level AS theme_id_level,
    user_challenges.iduser AS user_challenges_iduser,
    challenges.id_level AS challenge_id_level,
    levels.idlevels,
    user_level.iduser AS user_level_iduser,
    user_level.idlevel AS user_level_idlevel
FROM
    user
JOIN
    user_theme ON user.iduser = user_theme.iduser
JOIN
    themes ON user_theme.idtheme = themes.idthemes
JOIN
    user_challenges ON user.iduser = user_challenges.iduser
JOIN
    challenges ON user_challenges.idchallenge = challenges.idchallenges
JOIN
    levels ON themes.id_level = levels.idlevels
JOIN
    user_level ON user.iduser = user_level.iduser
WHERE
    user.email = ?
    AND user.password = ?`;
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

const userLogout = (req, res) => {
    res.json({ success: true });
};


const avancePorcentaje = async (req, res) => {
    try{
        const iduserTheme = req.body.iduserTheme;
        // const id_levelTheme = req.body.id_levelTheme;
        const iduserChallenges = req.body.iduserChallenges;
        // const id_levelChallenges = req.body.id_levelChallenges;
        // const idlevelsLevels = req.body.idlevelsLevels;
        const iduserUserLevel = req.body.iduserUserLevel;
        // const idlevelUserLevel = req.body.idlevelUserLevel;
        
        console.log(iduserTheme)
        // console.log(id_levelTheme)
        console.log(iduserChallenges)
        // console.log(id_levelChallenges)
        // console.log(idlevelsLevels)
        console.log(iduserUserLevel)
        // console.log(idlevelUserLevel)

        const updateSql = `
        UPDATE user_level AS ul
        SET percentage = (
            ((
                SELECT COUNT(*)
                FROM user_theme AS ut
                JOIN themes AS t ON t.idthemes = ut.idtheme
                WHERE ut.iduser = ? AND ut.completed = 1 AND t.id_level = ul.idlevel
                )+(
                 SELECT COUNT(*)
                FROM user_challenges AS uc
                JOIN challenges AS c ON c.idchallenges = uc.idchallenge
                WHERE uc.iduser = ? AND uc.completed = 1 AND c.id_level = ul.idlevel
                ))
            /
            (
                SELECT l.number_challenge + l.number_theme 
                FROM levels AS l 
                WHERE l.idlevels = ul.idlevel
            )
        ) * 100
        WHERE user_level.iduser = ? AND  user_level.idlevel = ?;
        `;

       let [result] = await pool.query(sql, [iduserTheme, id_levelTheme, iduserChallenges, id_levelChallenges, idlevelsLevels, iduserUserLevel, idlevelUserLevel]);
       
        console.log(iduserTheme)
        // console.log(id_levelTheme)
        console.log(iduserChallenges)
        // console.log(id_levelChallenges)
        // console.log(idlevelsLevels)
        console.log(iduserUserLevel)
        // console.log(idlevelUserLevel)

        console.log(result)
        res.status(200).json({ success: true, message: 'Porcentaje actualizado con éxito', porcentaje: nuevoPorcentaje, result });
    } else {
        // La actualización no fue exitosa
        res.status(500).json({ success: false, error: 'La actualización del porcentaje no fue exitosa', result });
    } 
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};



module.exports = {
    userRegister,
    userLogin,
    userRetos,
    updateUser,
    avancePorcentaje,
};