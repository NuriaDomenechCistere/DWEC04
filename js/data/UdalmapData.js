export const UdalmapData = {
    async getRegions() {
        const resultado = await fetch('https://api.euskadi.eus/udalmap/indicators/162?lang=SPANISH');
        return (await resultado.json()).regions;
    },

    async getIndicator(id, regionId) {
        const resultado = await fetch(`https://api.euskadi.eus/udalmap/indicators/${id}/regions/${regionId}?lang=SPANISH`);
        const datos = await resultado.json();
        return datos.regions[0];
    },

    obtenerValor(obj) {
        if (!obj || !obj.years || !obj.years[0]) return 0;
        const y = obj.years[0];
        return parseFloat(y["2024"] ?? y["2023"] ?? 0);
    },

    obtenerHistorico(obj) {
        if (!obj || !obj.years || !obj.years[0]) return {};
        const y = obj.years[0];
        const r = {};
        for (const year in y) {
            if (parseInt(year) >= 2010) r[year] = y[year];
        }
        return r;
    }
};

