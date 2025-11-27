import { IndexModel } from "./model/IndexModel.js";

document.addEventListener("DOMContentLoaded", async () => {
    try {
        IndexModel.mostrarCargando("tabla");
        IndexModel.mostrarCargando("tablaRanking");

        //Cargar datos
        await IndexModel.init();

        //Renderizar tablas
        IndexModel.renderizarTabla(
            IndexModel.regiones,
            "tabla",
            (region) => IndexModel.irAGrafico(region)
        );

        IndexModel.renderizarTabla(
            IndexModel.top3,
            "tablaRanking",
            (region) => IndexModel.irAGrafico(region)
        );

    } catch (error) {
        console.error("Error en index.js:", error);
 
    }
});
