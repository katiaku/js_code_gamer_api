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
        let params = [req.query.iduser, req.query.id_level, req.query.activate];
        let sql = 'SELECT l.title, c.title, c.content, c.code  FROM challenges as c '+
                'INNER JOIN levels as l ON (l.idlevels = c.id_level) '+
                'INNER JOIN `db-js-code-gamer`.user_challenges as uc ON (uc.idchallenge = c.idchallenges) '+ 
                'WHERE uc.iduser = ? AND '+ 
                'c.id_level = ? AND '+
                'uc.activate = ?;';
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

const avancePorcentaje = async (req, res) => {
    try{
        const iduserTheme = req.params.iduserTheme;
        const id_levelTheme = req.params.id_levelTheme;
        const iduserChallenges = req.params.iduserChallenges;
        const id_levelChallenges = req.params.id_levelChallenges;
        const idlevelsLevels = req.params.idlevelsLevels;
        const iduserUserLevel = req.params.iduserUserLevel;
        const idlevelUserLevel = req.params.idlevelUserLevel;
        
        console.log(iduserTheme)
        console.log(id_levelTheme)
        console.log(iduserChallenges)
        console.log(id_levelChallenges)
        console.log(idlevelsLevels)
        console.log(iduserUserLevel)
        console.log(idlevelUserLevel)
        const sql = `
        UPDATE user_level
        SET percentage = (
            ((
                SELECT COUNT(*)
                FROM user_theme JOIN themes ON (themes.idthemes = user_theme.idtheme)
                WHERE user_theme.iduser = ? AND user_theme.completed = 1 AND themes.id_level = ?
                )+(
                 SELECT COUNT(*)
                FROM user_challenges JOIN challenges ON (challenges.idchallenges = user_challenges.idchallenge)
                WHERE user_challenges.iduser = ? AND user_challenges.completed = 1 AND challenges.id_level = ?
                ))
            /
            (
                SELECT levels.number_challenge + levels.number_theme FROM levels WHERE levels.idlevels = ?
            )
        ) * 100
        WHERE user_level.iduser = ? AND  user_level.idlevel = ?;
        `;

       let [result] = await pool.query(sql, [iduserTheme, id_levelTheme, iduserChallenges, id_levelChallenges, idlevelsLevels, iduserUserLevel, idlevelUserLevel]);
       
        console.log(iduserTheme)
        console.log(id_levelTheme)
        console.log(iduserChallenges)
        console.log(id_levelChallenges)
        console.log(idlevelsLevels)
        console.log(iduserUserLevel)
        console.log(idlevelUserLevel)

        console.log(result)
        res.status(200).json({ success: true, message: 'Porcentaje actualizado con éxito', result });
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ success: false, error: 'Error interno del servidor' });
    }
};



module.exports = {
    userRegister,
    userLogin,
    userRetos,
    avancePorcentaje,
};
