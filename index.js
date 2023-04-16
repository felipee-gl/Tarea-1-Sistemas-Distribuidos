const axios = require('axios');
const fs = require('fs');
const redis = require('redis');

//Función para consulta a la API y almacenar en caché
async function Data() {
  const url = 'https://rickandmortyapi.com/api/character/';

  //CLIENTES
  const client1 = redis.createClient({
    url: 'redis://127.0.0.1:6379'
  });
  const client2 = redis.createClient({
    url: 'redis://127.0.0.1:6380'
  });
  const client3 = redis.createClient({
    url: 'redis://127.0.0.1:6381'
  });


  //RANGOS IDS
  const min = 1;
  const max = 20;
  let ids = Math.floor(Math.random() * (max - min + 1)) + min; //ALEATORIDAD
  ids = ids.toString();
  const tiempoExpiracion = 15; //TTL

  try {
    
    //CLIENTE 1 Y REDIS 1
    if(ids >= 1 && ids <= 7){

      await client1.connect(); //Cliente se conecta a redis
      const reply = await client1.get(ids); //Consulta si existe algo en el valor de ids

      if (reply) { //Si existe, entonces esta en redis(cache)
        //console.log("USANDO CACHE");
        return;

      } else { //De lo contrario realiza la peticion a la api 
        const response = await axios.get(url + ids); //Peticion a la API
        await client1.set(ids, JSON.stringify(response.data)); //Inserta a redis(cache)
        await client1.expire(ids, tiempoExpiracion); //Establecer TTL utilizando el método expire
        //console.log("USANDO API");
        return response.data;
      }
    }
    
    //CLIENTE 2 y REDIS 2
    else if(ids > 7 && ids <= 14){

      await client2.connect();
      const reply = await client2.get(ids);

      if (reply) {
        //console.log("USANDO CACHE");
        return;

      } else {
        const response = await axios.get(url + ids);
        await client2.set(ids, JSON.stringify(response.data));
        await client2.expire(ids, tiempoExpiracion); // Establecer TTL utilizando el método expire
        //console.log("USANDO API");
        return response.data;
      }
    }

    //CLIENTE 3 y REDIS 3
    else if(ids > 14 && ids <= 20){

      await client3.connect();
      const reply = await client3.get(ids);

      if (reply) {
        //console.log("USANDO CACHE");
        return;

      } else {
        const response = await axios.get(url + ids);
        await client3.set(ids, JSON.stringify(response.data));
        await client3.expire(ids, tiempoExpiracion); // Establecer TTL utilizando el método expire
        //console.log("USANDO API");
        return response.data;
      }
    }
  } catch (error) {
    console.log(error);
  }
}

// Función para tomar tiempos
async function measureResponseTimes() {
  const responseTimes = []; //Arreglos de los tiempos de respuesta
  for (let i = 0; i < 1000; i++) {
    const start = new Date().getTime(); //Inicia el tiempo
    await Data();
    const end = new Date().getTime(); //Finaliza el tiempo
    const responseTime = end - start; //Tiempo de respuesta
    responseTimes.push(responseTime);
  }
  console.log('finalizado')
  return responseTimes;
}

// Llamar a la función para medir los tiempos y escribirlos en un archivo
measureResponseTimes().then(responseTimes => {
  const contenido = responseTimes.join('\n');
  fs.writeFileSync('times.txt', contenido, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
});


// Método para enviar datos a la caché
async function enviarDatosALaCache(key, value) {
  // Lógica para enviar los datos a la caché, dependiendo de la implementación específica de la caché utilizada
  // Puede ser una función personalizada o una llamada a una API o servicio externo, según cómo esté configurada la caché en tu sistema
}
