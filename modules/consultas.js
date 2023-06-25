const pg = require ('pg')
const { Pool } = pg;
const bcrypt = require('bcryptjs')





//const pool = new Pool(config)
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  })

const registrarUsuarioDB = async (nombre,email,ciudad,password) => {
    
    try {
        const values = [nombre,email,ciudad,password]
        const query = "INSERT INTO usuario values (DEFAULT, $1, $2, $3, $4)"
        await pool.query(query, values)
        
    } catch (error) {
       console.log(error);
       return false
    }
    return true
}

const loginUsuarioDB = async (email, password) => {
    const values = [email]
    const query = "SELECT * FROM usuario where email = $1"
    const {rows:[usuario],rowCount} = await pool.query(query, values)
    const {password: hashedPassword} = usuario
    
    const passwordEsIgual = bcrypt.compareSync(password, hashedPassword)
    if(passwordEsIgual){
		const {data} = await getUsuarioDB(email)
		delete data.password
		return data}
	else{
		return false;}
}

const getUsuarioDB = async (email) => {
    try {
        const values = [email]
        const query = "SELECT * FROM usuario where email = $1"
        const { rows } = await pool.query(query, values);
        return {data: rows[0]};
    } catch (error) {
       console.log(error);
       return false 
    }
    
    
    }

	
const ingresarPublicacion = async (userid,albumid,precio,estado) => {
    try {
        const values = [userid,albumid,precio,estado]
        const query = "INSERT INTO PUBLICACION VALUES ($1,$2,$3,$4)"
        await pool.query(query, values);
        
    } catch (error) {
       console.log(error);
       return false 
    }
    
    
    }
	
const publicarAlbumDB = async (album_nombre,album_artista,album_mbid,album_imagen,album_precio,album_estado,usuario_publica) => {
    
	try {
		
        const values = [album_nombre,album_artista,album_mbid,album_imagen]
        const query = "INSERT INTO ALBUM VALUES( DEFAULT,$1,$2,$3,$4) RETURNING id"
        const { rows } = await pool.query(query, values);
        const new_id = rows[0].id;
		console.log('el nuevo id : '+new_id)
		ingresarPublicacion(usuario_publica,new_id,album_precio,album_estado)
		
		
    } catch (error) {
       console.log(error);
       return false 
    }
    
    
    }

    const getPublicacionesDB = async (userid) => {
        try {
            const values = [userid]
            const query = "select * from publicacion join album on publicacion.album_id = album.id and publicacion.usuario_id = $1"
            const { rows } = await pool.query(query, values);
            return {data: rows};
        } catch (error) {
           console.log(error);
           return false 
        }
        
        
        }

        const publicacionesDB = async () => {
            try {
                const query = "select * from publicacion join album on publicacion.album_id = album.id "
                const { rows } = await pool.query(query);
                return {data: rows};
            } catch (error) {
               console.log(error);
               return false 
            }
            
            
            }
            const todoPublicacionesDB = async () => {
                try {
                    const query = `SELECT publicacion.*,album.*,usuario.nombre,usuario.email,usuario.ciudad,COALESCE(favoritos.cuentafav, 0) AS conteofav
                                    FROM publicacion
                                    INNER JOIN album ON publicacion.album_id = album.id 
                                    INNER JOIN usuario ON usuario.id = publicacion.usuario_id
                                    LEFT JOIN (SELECT album_id, COUNT(album_id) cuentafav
                                    FROM favorito
                                    GROUP BY album_id) AS favoritos ON publicacion.album_id = favoritos.album_id`
                    const { rows } = await pool.query(query);
                    return {data: rows};
                } catch (error) {
                   console.log(error);
                   return false 
                }
                
                
                }

                const eliminarAlbumDB = async (albumid) => {
    
                    try {
                        
                        const values = [albumid]
                        const query = "DELETE FROM ALBUM WHERE ID = $1"
                        const { rows } = await pool.query(query, values);
                                            
                    } catch (error) {
                       console.log(error);
                       return false 
                    }
                    
                    
                    }


                    const editarAlbumDB = async (albumid,precio,estado) => {
    
                        try {
                            
                            const values = [albumid,precio,estado]
                            const query = "UPDATE publicacion SET precio = $2 , estado = $3 where album_id = $1 "
                            const { rows } = await pool.query(query, values);
                                                
                        } catch (error) {
                           console.log(error);
                           return false 
                        }
                        
                        
                        }
                
        
        
    


 module.exports = { getUsuarioDB, registrarUsuarioDB, loginUsuarioDB,publicarAlbumDB,getPublicacionesDB, publicacionesDB,todoPublicacionesDB,eliminarAlbumDB,editarAlbumDB };