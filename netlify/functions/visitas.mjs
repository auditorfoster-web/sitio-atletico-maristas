// Contador de visitas global, persistido en Netlify Blobs (sin servicios de
// terceros). Cada GET incrementa y devuelve el total: { visitas: N }.
// El front (script.js) lo pide una vez por carga y lo muestra en el footer.
import { getStore } from '@netlify/blobs';

export default async () => {
  try {
    const store = getStore('contador');
    const actual = parseInt((await store.get('visitas')) || '0', 10) + 1;
    await store.set('visitas', String(actual));
    return Response.json(
      { visitas: actual },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    return Response.json({ error: 'no disponible' }, { status: 500 });
  }
};
