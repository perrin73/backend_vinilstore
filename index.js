// express y nest.js
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const cors = require('cors')

const { getUsuario,loginUsuario,registrarUsuario,
        verificarToken,publicarAlbum,getPublicaciones,publicaciones, todoPublicaciones } = require('./modules/middleware')




//const { loginUsuarios } = require('./consultas');
app.listen(process.env.POSTGRES_PORT, console.log('servidor en marcha en el puerto 5000'))
app.use(cors())
app.use(express.json())

app.post('/login',async(req,res)=>{
    try {
        const {email, password} = req.body
        const datos = await loginUsuario(email,password)
        if(datos){
            const token = jwt.sign({ email },'clave secreta')
            res.send({token,datos})
        }else{
            res.status(401).send('Lo siento hay un error revise sus credenciales!');
        }
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error.message ||'Ocurrió un error')
    }
})



app.post('/usuarios', async (req,res) => {

    try {
        const {nombre,email,ciudad,password} = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10)
        const respuesta = await registrarUsuario(nombre,email,ciudad,hashedPassword)
    if (respuesta) {
        res.status(200).send('Usuario se agregó exitosamente')
    } else {
        res.status(500).send('Usuario no se agregó hubo un error ¿llenó todos los campos?')
    }
        
    } catch (error) {
        res.status(500).send('Usuario no se agregó hubo un error ¿llenó todos los campos?')
    }
    
            
})

app.get('/usuarios', verificarToken, async(req,res)=> {
    try {
        const token = req.header("Authorization").split("Bearer ")[1]
        const {email} = jwt.decode(token)
        const datosUsuario = await getUsuario(email)
        res.send(datosUsuario)
    } catch (error) {
        console.log(error)
    }
})

app.post('/publicar',verificarToken, async (req,res) => {

    try {
		
        const {nombre,artista,mbid,imagen,precio,estado,userid} = req.body;
        console.log('desde index : '+nombre)
        const respuesta = await publicarAlbum(nombre,artista,mbid,imagen,precio,estado,userid)
    if (respuesta) {
        res.status(200).send('Album se publicó exitosamente')
    } else {
        res.status(500).send('No se logró publicar el album')
    }
        
    } catch (error) {
        res.status(500).send('Hubo un problema no se publicó el album')
    }
    
            
})

app.get('/publicaciones',verificarToken, async(req,res)=> {
    try {
        const {userid} = req.query;
        const dataPublicaciones = await getPublicaciones(userid)
        res.send(dataPublicaciones)
    } catch (error) {
        console.log(error)
    }
})

app.get('/laspublicaciones', async(req,res)=> {
    try {
        const dataPublicaciones = await publicaciones()
        res.send(dataPublicaciones)
    } catch (error) {
        console.log(error)
    }
})

app.get('/todopublicaciones',verificarToken, async(req,res)=> {
    try {
        const dataPublicaciones = await todoPublicaciones()
        res.send(dataPublicaciones)
    } catch (error) {
        console.log(error)
    }
})