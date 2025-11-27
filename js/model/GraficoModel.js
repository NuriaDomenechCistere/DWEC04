import { RegionesService } from "../service/RegionesService.js";

export const GraficoModel = {
    region: null,
    grafico: null,

    async init(regionId) {
        try {
            const regiones = await RegionesService.obtenerRegiones();
            this.region = RegionesService.buscarPorId(regiones, regionId);

            if (!this.region) {
                throw new Error("Región no encontrada");
            }

            return this.region;
        } catch (error) {
            console.error("Error en el GraficoModel:", error);
        }
    },

    crearFiltros() {
        const canvas = document.getElementById("grafico");
        const filtrosDiv = document.createElement("div");
        filtrosDiv.id = "filtrosGrafico";
        filtrosDiv.innerHTML = `
            <div class="row">
                <h2>Filtros de tiempo e indicador</h2>
            </div>
            <div class="row">
                <div class="col">
                    <label class ="indicador-titulo">Rango temporal:</label>
                    <select id="filtroTiempo">
                        <option value="all">Todos</option>
                        <option value="5">Últimos 5 años</option>
                        <option value="10">Últimos 10 años</option>
                    </select>
                   
                    <label class="indicador-titulo">Indicadores:</label>
                    <label><input type="checkbox" id="chkEnve" checked> Envejecimiento</label>
                    <label><input type="checkbox" id="chkJuv" checked> Juventud</label>
                    <label><input type="checkbox" id="chkSobre" checked> Sobre-envejecimiento</label>
                </div>
            </div>
        `;
        canvas.parentElement.insertBefore(filtrosDiv, canvas);
    },

    renderizarGrafico() {
        const opciones = {
            rango: document.getElementById("filtroTiempo").value,
            mostrarEnv: document.getElementById("chkEnve").checked,
            mostrarJuv: document.getElementById("chkJuv").checked,
            mostrarSobre: document.getElementById("chkSobre").checked
        };

        const datos = RegionesService.procesarDatosGrafico(this.region, opciones);

        document.getElementById("tituloGrafico").textContent = 
            `Evolución de indicadores demográficos en ${this.region.nombre}`;

        if (this.grafico) {
            this.grafico.destroy();
        }

        const ctx = document.getElementById("grafico").getContext("2d");
        this.grafico = new Chart(ctx, {
            type: "line",
            data: { labels: datos.etiquetas, datasets: datos.datasets },
            options: {
                scales: { y: { min: 0, max: 100, beginAtZero: true } }
            }
        });
    },

    configurarEventos() {
        const actualizar = () => this.renderizarGrafico();
        
        document.getElementById("filtroTiempo").onchange = actualizar;
        document.getElementById("chkEnve").onchange = actualizar;
        document.getElementById("chkJuv").onchange = actualizar;
        document.getElementById("chkSobre").onchange = actualizar;
    },

    renderizarListaRegiones(todasRegiones, regionActualId) {
        const lista = document.getElementById("listaRegiones");
        if (!lista) return;
        
        lista.innerHTML = "";
        
        let otrasRegiones = todasRegiones.filter(regionActual => regionActual.id != regionActualId);
        //Para que muestre regiones aleatorias de la lista que tenemos sin contar la que estamos visualizando
        const regionesAleatorias = [];
        for (let i = 0; i < 3 && otrasRegiones.length > 0; i++) {
            const indiceAleatorio = Math.floor(Math.random() * otrasRegiones.length);
            regionesAleatorias.push(otrasRegiones[indiceAleatorio]);
            otrasRegiones.splice(indiceAleatorio, 1);
        }
        
        regionesAleatorias.forEach(region => {
            const li = document.createElement("li");
            li.style.marginBottom = "10px";
            
            li.innerHTML = `
                <a class="enlace-region" href="grafico.html?id=${region.id}" 
                 >
                 ${region.nombre}
                </a>
            `;
        
            
            lista.appendChild(li);
        });
    },
};