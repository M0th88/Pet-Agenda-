<script setup>
// No se requiere lógica especial, el router-link maneja la navegación
</script>

<template>
  <div class="landing-container">
    <header>
      <nav>
        <ul>
          <a href="https://tienda.safarivet.cl/inicio" target="_blank">
            <img class="ClaseFotos" src="/img/safarivet.png" alt="safarivet" style="width:60px; height:60px;">
          </a>
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#formulario">Agenda Aquí</a></li>
          <li><a href="#personal">Personal</a></li>
          <li><a href="#contacto">Otros</a></li>
          
          <li>
            <router-link to="/login" class="btn-login">
              Iniciar Sesión
            </router-link>
          </li>

          
        </ul>
      </nav>
    </header>

    <br id="inicio">
    <div class="contenedor">
      <img class="FotoPerrito" src="/img/veterinarian-taking-care-pet-dog.jpg" alt="FotoPerrito">
      <div class="Texto_FotoPerrito">
        <h1>NOS PREOCUPAMOS POR TU MASCOTA</h1>
        <p>Nuestro personal profesional entregará una atención enfocada siempre en en el bienestar de nuestro paciente 
          <br>otorgando al dueño de la mascota la infromacion necesaria para realizar el procedimiento según sea el caso
          <br>
        </p>
      </div>
    </div>

    <br id="servicios">
    <div class="contenido_pag" >

      <h1 class="Titulo1"> NUESTROS SERVICIOS</h1>
      <img class="line" src="/img/line.jpg" alt="line">

      <h3 class="subtitulo">Clínica veterinaria Safarivet tiene para ofrecer a nuestros clientes y sus dueños los siguientes servicios.</h3>

      <div class="Servicios">
        
        <div class="card">
         <img class="consulta_veterinaria" src="/img/consulta_veterinaria.jpg" alt="imagen_peluqueria">
          <div class="contenido">
            <h3> CONSULTA VETERINARIA</h3>
            <p>Revision general de la mascota y respuesta a inquitudes que tenga el propietario de la mascota</p>
            <a class="boton" href="https://safarivet.getskedu.com/lospablos" target="_blank">Más información</a> 
          </div>
        </div>
    
        <div class="card">
         <img class="hospitalización_cirugia" src="/img/hospitalización y cirugia.jpg" alt="hospitalización_cirugia">
          <div class="contenido">
            <h3> HOSPITALIZACIÓN Y CIRUGÍA</h3>
            <p>Cuidado y atencion para mascotas que requieran evaluacion permanente</p>
            <p>Esterilización: Sondaje, destrartrajes, abordaje de heridas, operaciones gastrointestinales, ortopédica, obstétircas, genitourinarias, toracicas, palpebrales y oncológicas </p>
            <a class="boton" href="https://safarivet.getskedu.com/lospablos" target="_blank">Más información</a> 
          </div>
        </div>

        <div class="card">
          <img class="farmacia" src="/img/farmacia.jpg" alt="imagen_peluqueria">
            <div class="contenido">
              <h3>FARMACIA</h3>
              <p>Venta de medicamentos de uso veterinario de adminstración oral o tópica</p>
              <a class="boton" href="https://tienda.safarivet.cl/busquedacategoria/FAR" target="_blank">Más información</a> 
            </div>
        </div>

        <div class="card">
            <img class="peluqueria" src="/img/peluqueria.jpg" alt="peluqueria">
             <div class="contenido">
               <h3>PELUQUERIA</h3>
               <p>Cortes de pelo, baños, limpieza de oídos y cortes de uñas para caninos y felinos</p>
               <a class="boton" href="https://safarivet.getskedu.com/lospablos" target="_blank">Más información</a> 
             </div>
        </div> 

        </div>

    </div>
   
    <br id="personal">
    <div class="contenido_pag">

      <h1 class="Titulo3">PERSONAL</h1>
      <img class="line" src="/img/line.jpg" alt="line">
      <h3 class="subtitulo2">El personal de clínica veterinaria Safarivet ha sido seleccionado cuidadosa y responsablemente para
        entregar una atención completa y éticamente correcta a nuestros clientes y sus dueños.</h3>

      <div class="personal">

        <div class="card_personal">
          <img class="imagen_personal" src="/img/paula.jpg" alt="imagen_personal">
          <div class="contenido_personal">
            <h4>Paula Metayer</h4>
            <p>Médico Veterinario</p>
          </div>
        </div>

        <div class="card_personal">
          <img class="imagen_personal" src="/img/hector.jpg" alt="imagen_personal">
          <div class="contenido_personal">
            <h4>Héctor Coronado</h4>
            <p>Médico Veterinario</p>
          </div>
        </div>

        <div class="card_personal">
          <img class="imagen_personal" src="/img/lore.jpg" alt="imagen_personal">
          <div class="contenido_personal">
            <h4>Lorena Labra</h4>
            <p>Médico Veterinario y Peluquería</p>
          </div>
        </div>

        <div class="card_personal">
          <img class="imagen_personal" src="/img/María.jpg" alt="imagen_personal">
          <div class="contenido_personal">
            <h4>María Espinoza</h4>
            <p>Médico Veterinario Imagenología</p>
          </div>
        </div>


        <div class="card_personal">
          <img class="imagen_personal" src="/img/gabi.jpg" alt="imagen_personal">
          <div class="contenido_personal">
            <h4>Gabriela Becar</h4>
            <p>Administración y Médico Veterinario Imagenología</p>
          </div>
        </div>
        
        <div class="card_personal">
          <img class="imagen_personal" src="/img/karina.jpg" alt="imagen_personal">
          <div class="contenido_personal">
            <h4>Karina Jara</h4>
            <p>Peluqueria</p>
          </div>
        </div>

      </div>
      
    </div>

    <div id="FRASE">
      <div class="frase">
        <h1>"Hasta que uno no ha amado a un animal, una parte del alma sigue sin despertar" <br>-Anatole France-<br></h1>
      </div> 
    </div>
    
    <br id="contacto" >
     <div class="pre_footer">
      <table>
        <tr>
          <th>Contacto SAFARI VET LTDA.</th>
          <th>Nuestras redes</th>
        </tr>
        <tr>
          <td>Teléfono: +56 9 3224 9630</td>
          <td>Facebook</td>
        </tr>
        <tr>
          <td>E-mail: contacto@safarivet.cl</td>
          <td>Instagram</td>
        </tr>
      </table>

      <img class="webpay" src="/img/webpay.png" alt="webpay" style="width:20%;height:20%;">

     </div>

    <footer>
      <p>Copyright © 2024 Certificado Por Softland</p>
    </footer>
  </div>
</template>

<style>
/* Estilos adaptados de tu style.css */

/* Reset básico para esta vista */
.landing-container * {
  box-sizing: border-box;
}

.landing-container {
  background-color: #ffffff;
  font-family: sans-serif;
  color: #222222;
}

/* NAVBAR */
header {
  position: fixed;
  background-color: #ef6532;
  width: 100%;
  z-index: 9999;
  top: 0;
  left: 0;
}
  
nav ul {
  display: flex;
  padding: 10px 0px;
  justify-content: center;
  align-items: center; /* Centrado vertical mejorado */
  text-align: center;
  list-style-type: none;
  margin: 0;
}
  
nav ul li {
  font-family: sans-serif;
  padding: 0 20px; /* Ajustado para mejor espaciado */
  font-weight: bold;
}

nav ul img {
  margin-top: 0; /* Ajuste */
}

nav ul li a {
  text-decoration: none;
  color: #ffffff;
  transition: color 0.3s;
}

nav ul li a:hover, nav ul li a:active {
  color: #b63101;
}  

/* ESTILO DEL NUEVO BOTÓN LOGIN */
.btn-login {
  background-color: #b63101; /* Mismo color que tus botones */
  color: white !important; /* Forzar blanco */
  padding: 10px 20px;
  border-radius: 30px; /* Bordes redondeados como el buscador */
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.btn-login:hover {
  background-color: #7c2708; /* Mismo hover oscuro */
  color: white !important;
  transform: scale(1.05);
}
  
.buscador {
  align-items: center;
  display: flex;
  justify-content: right;
  margin-left: 20px;
} 

.buscador input[type="search"] {
  width: 100%;
  padding: 10px;
  border-radius: 30px 0 0 30px;
  border: none;
  outline: none;
}
  
.buscador button {
  border: none;
  padding: 10px 20px;
  border-radius: 0 30px 30px 0;
  background-color: #b63101;
  color: white;
  cursor: pointer;
  }
  
.buscador button:hover {
  background-color: #7c2708;
}

/* FOTO PERRITO HERO */
.contenedor {
  background-color: #ffffff; 
  display: flex;
  height: 650px;
  margin-top: 80px; /* Espacio para el header fijo */
  position: relative;
}

.FotoPerrito {
  width: 100%; 
  height: 100%; 
  object-fit: cover;
  object-position: 0px -20px;
}

.Texto_FotoPerrito {
  font-family: sans-serif ;
  color: white;
  z-index: 1; 
  background-color: rgba(255, 255, 255, 0); 
  padding: 20px; 
  text-align: left; 
  position: absolute; 
  top: 50%; 
  left: 5%; 
  transform: translateY(-50%);
}

.Texto_FotoPerrito h1 {
  font-family: 'Trebuchet MS', sans-serif;
  font-size: 2.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.Texto_FotoPerrito p {
  font-size: 1.2rem;
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}

/* CONTENIDO */
.contenido_pag {
  margin: 5%;
}

.Titulo1, .Titulo3 {
  text-align: center;
  font-family: 'Trebuchet MS', sans-serif;
  color: #222222;
  margin-bottom: 10px;
}

.line{
  width: 25%;
  display: block;
  margin: 0 auto 20px auto;
}

/* TARJETAS SERVICIOS */
.Servicios {
  justify-content: center;
  padding: 2%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: #666666;
}

.subtitulo, .subtitulo2 {
  text-align: center;
  font-family: 'Open Sans', sans-serif;
  color: #666666;
  font-weight: normal;
  margin-bottom: 30px;
  display: block;
}

.card {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f2f2f2; 
  width: 300px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.consulta_veterinaria, .hospitalización_cirugia, .farmacia, .peluqueria {
  width: 100%; 
  height: 180px; 
  object-fit: cover;
}

.contenido {
  padding: 20px;
  text-align: left; 
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contenido h3 {
  margin-bottom: 10px;
  color: #ef6532;
}

.boton {
  background-color: #b63101;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  border-radius: 5px;
  margin-top: 15px;
  align-self: flex-start;
}

.boton:hover {
  background-color: #7c2708;
}

/* PERSONAL */
.personal {
  justify-content: center;
  padding: 2%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card_personal {
  width: 300px;
  text-align: center;
}

.imagen_personal {
  width: 250px; 
  height: 250px; 
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
  display: block;
}

.contenido_personal {
  padding: 15px;
}

.contenido_personal h4 {
  color: #ef6532;
  font-size: 1.2rem;
  margin-bottom: 5px;
}

/* FRASE */
.frase {
  background-image: url('/img/portrait-beautiful-cat.jpg');
  background-attachment: fixed;
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.frase h1 {
  color: white;
  background-color: rgba(0, 0, 0, 0.5); 
  width: 100%;
  padding: 40px;
  text-align: center; 
  font-weight: normal;
  font-size: 1.8rem;
}

/* PRE FOOTER */
.pre_footer  {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 50px 5%;
  flex-wrap: wrap;
}

table {
  text-align: left;
  color: #ef6532;
  border-spacing: 10px;
}

th {
  font-weight: bold;
  font-size: 1.2rem;
  padding-bottom: 10px;
}

td {
  color: #666;
}

/* FOOTER */
footer {
  text-align: center;
  background-color: #e7e7e7;
  color: #ef6532;
  padding: 20px;
  font-weight: bold;
}
</style>