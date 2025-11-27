import { RegionesService } from "../service/RegionesService.js";

export const IndexModel = {
    regiones: [],
    top3: [],

    // Inicializar y cargar datos
    async init() {
        try {
            this.regiones = await RegionesService.obtenerRegiones();
            this.top3 = RegionesService.obtenerTop3(this.regiones);
            return { regiones: this.regiones, top3: this.top3 };
        } catch (error) {
            console.error("Error en IndexModel:", error);
            throw error;
        }
    },

    renderizarTabla(regiones, idTabla, onClickFila) {
        const tbody = document.getElementById(idTabla).querySelector("tbody");
        tbody.innerHTML = "";

        regiones.forEach(region => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${region.nombre}</td>
    <td>${region.poblacion.toLocaleString('es-ES')}</td>
    <td>${region.envejecimiento.toFixed(2)}%</td>
    <td>${region.sobreEnvejecimiento.toFixed(2)}%</td>
    <td>${region.poblacionJoven.toFixed(2)}%</td>
            `;
            tr.onclick = () => onClickFila(region);
            tbody.appendChild(tr);
        });
    },

    //Navegar a página de visualización del gráfico
    irAGrafico(region) {
        window.location.href = `grafico.html?id=${region.id}`;
    },

    //Para mientras se carga la primera vez visualizar un mensaje
    mostrarCargando(idTabla) {
        const tbody = document.getElementById(idTabla).querySelector("tbody");
        tbody.innerHTML = '<tr><td colspan="5">⏳ Barkatu, se están cargando los datos, espera un poco...  ⏳ </td></tr>';
    },


};