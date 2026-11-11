import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class ReportesServicio {

    informeIncidenciasPdf = async (datosReporte) => {
        try {
            const plantillaPath = path.join(__dirname, '../utiles/handlebars/reporte.hbs');
            const plantillaHtml = fs.readFileSync(plantillaPath, 'utf8');

            const template = handlebars.compile(plantillaHtml);
            const htmlFinal = template({
                incidencias: datosReporte
            });

            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            await page.setContent(htmlFinal);

            const buffer = await page.pdf({
                format: 'A4',
                printBackground: true
            });

            await browser.close();
            return buffer;

        } catch (error) {
            console.error('Error generando el PDF:', error);
            throw error;
        }
    };
}
