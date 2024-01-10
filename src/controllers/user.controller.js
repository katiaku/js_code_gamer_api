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
        let params = [req.query.iduser, req.query.id_level];
        let sql = `SELECT l.title as unit, c.title, c.content, c.code, c.resultado  FROM challenges as c 
                INNER JOIN levels as l ON (l.idlevels = c.id_level) 
                INNER JOIN user_challenges as uc ON (uc.idchallenge = c.idchallenges) 
                WHERE uc.iduser = ? AND 
                c.id_level = ?;`;
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
        WHERE ul.iduser = ? AND  ul.idlevel = (SELECT idlevels FROM levels WHERE idlevels = ul.idlevel);

        `;

        const selectSql = `
            SELECT percentage
            FROM user_level
            WHERE user_level.iduser = ? AND user_level.idlevel = user_level.idlevel;
        `;

       await pool.query(updateSql, [iduserTheme, iduserChallenges, iduserUserLevel]);
       const [result] = await pool.query(selectSql, [iduserUserLevel]);
       if (result.length > 0) {
        const nuevoPorcentaje = result[0].percentage;
        console.log(nuevoPorcentaje);
       
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

const obtenerDatosNiveles = async (req, res) => {
    try {
      const iduser = req.params.iduser;
      const sql = `SELECT *, title
      FROM user_level 
      JOIN levels ON user_level.idlevel = levels.idlevels
      WHERE iduser = ?`;
      const [result] = await pool.query(sql, [iduser]);
  
      res.status(200).json(result);
    } catch (error) {
      console.error('Error al obtener datos de niveles:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };


//   const updateUser = async (request, response) => {
//     try {
//       const { iduser, name_surname, email, username, photo, password} = request.body;
  
//            if (!name_surname || !email || !username || !photo || !password) {
//         return response.status(400).send({ error: true, codigo: 400, message: "Datos incompletos para actualizar el usuario" });
//       }
  
//       // Realiza la actualización en la base de datos
//       const sql = 'UPDATE user SET name_surname = ?, email = ?, username = ?, photo = ?, password = ? WHERE iduser = ?;';
//       const [result] = await pool.query(sql, [name_surname, email, username, photo, password, iduser]);
//       console.log(result)
  
//       // Verifica si la actualización fue exitosa
//       if (result.affectedRows === 1) {
//         response.send({ error: false, codigo: 200, message: "Usuario actualizado correctamente" });
//       } else {
//         response.status(500).send({ error: true, codigo: 500, message: "No se pudo actualizar el Usuario" });
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       response.status(500).send({ error: true, codigo: 500, message: "Error interno del servidor" });
//     }
//   };


const updateUser = async (request, response) => {
    try {
      const { iduser, name_surname, email, username, photo, password } = request.body;
  
      if (!iduser) {
        return response.status(400).send({ error: true, codigo: 400, message: "ID de usuario no proporcionado" });
      }
  
      let updateFields = [];
      let updateValues = [];
  
      if (name_surname) {
        updateFields.push('name_surname = ?');
        updateValues.push(name_surname);
      }
  
      if (email) {
        updateFields.push('email = ?');
        updateValues.push(email);
      }
  
      if (username) {
        updateFields.push('username = ?');
        updateValues.push(username);
      }
  
      if (photo) {
        updateFields.push('photo = ?');
        updateValues.push(photo);
      }
  
      if (password) {
        updateFields.push('password = ?');
        updateValues.push(password);
      }
  
      if (updateFields.length === 0) {
        return response.status(400).send({ error: true, codigo: 400, message: "No hay datos para actualizar" });
      }
  
      // Construye la consulta SQL dinámicamente
      const sql = `UPDATE user SET ${updateFields.join(', ')} WHERE iduser = ?;`;
      const queryValues = [...updateValues, iduser];
  
      console.log("SQL:", sql);
      console.log("Query Values:", queryValues);

      // Realiza la actualización en la base de datos
      const [result] = await pool.query(sql, queryValues);
      console.log("Query Result:", result);
  
      // Verifica si la actualización fue exitosa
      if (result.affectedRows === 1) {
        response.send({ error: false, codigo: 200, message: "Usuario actualizado correctamente" });
      } else {
        response.status(500).send({ error: true, codigo: 500, message: "No se pudo actualizar el Usuario" });
      }
    } catch (error) {
      console.error("Error:", error);
      response.status(500).send({ error: true, codigo: 500, message: "Error interno del servidor" });
    }
  };

module.exports = {
    userRegister,
    userLogin,
    userRetos,
    updateUser,
    avancePorcentaje,
    obtenerDatosNiveles,
};