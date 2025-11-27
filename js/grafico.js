import { GraficoModel } from "./model/GraficoModel.js";
import { RegionesService } from "./service/RegionesService.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const regionId = params.get("id");

        if (!regionId) {
            GraficoModel.mostrarError("No se especificó región");
            return;
        }

        await GraficoModel.init(regionId);

        const todasRegiones = await RegionesService.obtenerRegiones();
        GraficoModel.renderizarListaRegiones(todasRegiones, regionId);

        GraficoModel.crearFiltros();
        GraficoModel.renderizarGrafico();
        GraficoModel.configurarEventos();

    } catch (error) {
        console.error("Error en grafico.js:", error);
    }
});