const {response} = require('express');
const Usuario = require('../models/Usuario')
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/JWT');


const crearUsuario = async(req, res = response) => {
    const {name, email, password} = req.body;

    try{
      const usuario = await Usuario.findOne({email});

      if(usuario)
      return res.status(400).json({
        ok: false,
        msg: 'El usuario ya existe con ese email.'
      })

      //Crea usuario con el modelo (carpeta models)
      const dbUser = new Usuario(req.body);

      //hash contraseña
      const salt = bcrypt.genSaltSync();
      dbUser.password = bcrypt.hashSync(password, salt);

      //Generar JWT
      const token = await generarJWT(dbUser.id, name)

      //Crea usuario en la Database
      await dbUser.save();

      //Genera respuesta exitosa...
      return res.status(201).json({
        ok: true,
        uid: dbUser.id,
        name,
        email,
        token
      });
    }
    catch (error){
      return res.status(500).json({
        ok: false,
        msg:'Por favor, coloquese en contacto con el administrador.'
      });
    }  
}

const loginUsuario = async(req, res = response)  => {
  const {email, password} = req.body;

  try {
    const dbUser = await Usuario.findOne({email})

    if (!dbUser)
      return res.status(400).json({
        ok: false,
        msg:'El correo no existe.'
      })

    //confirmar si password hace match login
    const validPassword = bcrypt.compareSync(password, dbUser.password)

    if(!validPassword)
    return res.status(400).json({
      ok: false,
      msg:'Contraseña incorrecta'
    })

    //generar JWT para login
    const token = await generarJWT(dbUser.id, dbUser.name)

    //Respuesta del servicio

    return res.json({
      ok:true,
      uid: dbUser.id,
      name: dbUser.name,
      email,
      token
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg:'Por favor, coloquese en contacto con el administrador.'
    });
  }
}



const revalidarToken = async(req, res = response)  => {

   const  {uid, name} = req

   const dbUser = await Usuario.findById(uid);

   const token = await generarJWT(uid, name, dbUser)

    return res.json({
    ok: true,
    uid,
    name,
    email: dbUser.email,
    token
  });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}