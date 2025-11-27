import { UdalmapData } from "../data/UdalmapData.js";

export const RegionesService = {


    claveDatos: "regionesDatos",
    claveTiempo: "regionesTiempo",
    duracionCache: 60 * 60 * 1000, 

    //obtener los datos guardados si existen y si no, leer desde la API y guardarlos
    async obtenerRegiones() {

        const datosGuardados = this.leerCache();

        if (datosGuardados) {

            return datosGuardados;
        }      
        const regiones = await this.cargarDesdeAPI();

        this.guardarCache(regiones);

        return regiones;
    },

   //Descargar información de la API con los indicadores que nos interesan
    async cargarDesdeAPI() {
        const lista = [];
        const regionesTodas = await UdalmapData.getRegions();

        for (const region of regionesTodas) {

     
            const indicadorEnv = await UdalmapData.getIndicator(43, region.id);
            const indicadorSobre = await UdalmapData.getIndicator(45, region.id);
            const indicadorJov = await UdalmapData.getIndicator(42, region.id);

            
            lista.push({
                id: region.id,
                nombre: region.name,
                poblacion: UdalmapData.obtenerValor(region),
                envejecimiento: UdalmapData.obtenerValor(indicadorEnv),
                sobreEnvejecimiento: UdalmapData.obtenerValor(indicadorSobre),
                poblacionJoven: UdalmapData.obtenerValor(indicadorJov),
                historicoEnv: UdalmapData.obtenerHistorico(indicadorEnv),
                historicoJuv: UdalmapData.obtenerHistorico(indicadorJov),
                historicoSobre: UdalmapData.obtenerHistorico(indicadorSobre)
            });

            //espera para que no se produzca error 429 por demasiadas peticiones
            await new Promise(res => setTimeout(res, 150));
        }

        return lista;
    },

    // Tener las 3 regiones con porcentaje de envejecimiento más alto
    obtenerTop3(regiones) {
        const copia = [...regiones];
        copia.sort((a, b) => b.envejecimiento - a.envejecimiento);
        return copia.slice(0, 3);
    },


    buscarPorId(regiones, id) {
        return regiones.find(r => r.id == id);
    },


procesarDatosGrafico(region, opciones) {
    const { rango, mostrarEnv, mostrarJuv, mostrarSobre } = opciones;

    const todasEtiquetas = Object.keys(region.historicoEnv || {});

//cortar datos según el rango de tiempo seleccionado
 function cortar(arr) {
   if (rango === "all") return arr;
  let cantidad = parseInt(rango, 10);
  if (isNaN(cantidad) || cantidad <= 0) return arr;
  return arr.slice(-cantidad);
}
    const etiquetas = cortar(todasEtiquetas);

    const datasets = [];

    if (mostrarEnv && region.historicoEnv) {
        const valores = cortar(Object.values(region.historicoEnv));
        datasets.push({
            label: "65 años o más (%)",
            data: valores,
            borderColor: "cadetblue",
            borderWidth: 2,
            tension: 0.2
        });
    }

    if (mostrarJuv && region.historicoJuv) {
        const valores = cortar(Object.values(region.historicoJuv));
        datasets.push({
            label: "0 a 14 años (%)",
            data: valores,
            borderColor: "chocolate",
            borderWidth: 2,
            tension: 0.2
        });
    }

    if (mostrarSobre && region.historicoSobre) {
        const valores = cortar(Object.values(region.historicoSobre));
        datasets.push({
            label: "Sobreenvejecimiento (%)",
            data: valores,
            borderColor: "purple",
            borderWidth: 2,
            tension: 0.2
        });
    }

    return { etiquetas, datasets };
},

    //Gestión de la caché
    leerCache() {
        const datos = localStorage.getItem(this.claveDatos);
        const tiempo = localStorage.getItem(this.claveTiempo);

        if (!datos || !tiempo) {
            return null;
        }

        const horaActual = Date.now();
        const tiempoGuardado = Number(tiempo);

        // comprobar si ha pasado más de 1 hora
        if (horaActual - tiempoGuardado > this.duracionCache) {
            this.limpiarCache();
            return null;
        }

        try {
            return JSON.parse(datos);
        } catch (e) {
            this.limpiarCache();
            return null;
        }
    },

    //guardar datos en localStorage
    guardarCache(regiones) {
        localStorage.setItem(this.claveDatos, JSON.stringify(regiones));
        localStorage.setItem(this.claveTiempo, Date.now().toString());
    },

    //borrar cache
    limpiarCache() {
        localStorage.removeItem(this.claveDatos);
        localStorage.removeItem(this.claveTiempo);
    }
};
