const jwt = require("jsonwebtoken")
const {getUsuarioDB, registrarUsuarioDB,loginUsuarioDB,
      publicarAlbumDB,getPublicacionesDB,publicacionesDB,
      todoPublicacionesDB,eliminarAlbumDB,editarAlbumDB} = require('./consultas')

const verificarToken = (req, res, next) => {
    const token = req.header("Authorization").split("Bearer ")[1]
    if(!token) throw { 
        code: 401,
        message: "Debes incluir token en el header"
    }
    const tokenValido = jwt.verify(token, 'clave secreta')
    if(!tokenValido) throw { 
        code: 401,
        message: "El token no es válido"
    }
    next()
}

const loginUsuario = async(email,password)=>{
    if(!email || !password){
        return false;
    }else{
        try {
            const result = await loginUsuarioDB(email,password)
            return result
                
          } catch (error) {
            return false  
          }
        
    }
    
    
}

const getUsuario = async(email)=>{
    if(!email){
        return false
    }else{
        try {
            
          const datosUsuario = await getUsuarioDB(email)
          return datosUsuario.data;
        } catch (error) {
          return false  
        }

        
    }
    
}

const registrarUsuario = async(nombre,email,ciudad,password)=>{
    if(!email || !password || !nombre || !ciudad){
        return false
    }else{
        try {
            await registrarUsuarioDB(nombre,email,ciudad,password)
        } catch (error) {
          return false  
        }
    }
    return true;
}

const publicarAlbum = async(album_nombre,album_artista,album_mbid,album_imagen,album_precio,album_estado,usuario_publica)=>{
    if(!album_nombre || !album_artista || !album_mbid || !album_imagen || !album_precio || !album_estado || !usuario_publica){
        
		return false
    }else{
        try {
            await publicarAlbumDB(album_nombre,album_artista,album_mbid,album_imagen,album_precio,album_estado,usuario_publica)
        } catch (error) {
          return false  
        }
    }
    return true;
}

const getPublicaciones = async(userid)=>{
    if(!userid){
        return false 
    }else{
        try {
            
          const dataPublicaciones = await getPublicacionesDB(userid)
          return dataPublicaciones;
        } catch (error) {
          return false  
        }

        
    }
    
}

const publicaciones = async()=>{
   
        try {            
          const dataPublicaciones = await publicacionesDB()
          return dataPublicaciones;
        } catch (error) {
          return false  
        }

}

const todoPublicaciones = async()=>{
   
    try {            
      const dataPublicaciones = await todoPublicacionesDB()
      return dataPublicaciones;
    } catch (error) {
      return false  
    }

}

const eliminarAlbum = async(albumid)=>{
  if(!albumid){
      
  return false
  }else{
      try {
          await eliminarAlbumDB(albumid)
      } catch (error) {
        return false  
      }
  }
  return true;
}

const editarAlbum = async(albumid,precio,estado)=>{
  if(!albumid || !precio || !estado){
      
  return false
  }else{
      try {
          await editarAlbumDB(albumid,precio,estado)
      } catch (error) {
        return false  
      }
  }
  return true;
}


module.exports = {getUsuario,
                  loginUsuario,
                  registrarUsuario,
                  verificarToken,
                  publicarAlbum,
                  getPublicaciones,
                  publicaciones,
                  todoPublicaciones,
                  eliminarAlbum,
                  editarAlbum
                }