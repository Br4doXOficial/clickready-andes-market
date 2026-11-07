# Click&Ready · Andes Market

Prototipo académico individual para la evaluación de la Unidad II (Fundamentos de Scrum), IPLACEX. Se simulan catálogo, búsqueda, carrito y comprobante de reserva ficticia. **No existen pagos reales, autenticación, correos enviados, reservas comerciales ni integración con ERP.**

## Cómo ejecutar

Abrir `index.html` con Live Server en VS Code o con un servidor estático local. Para las pruebas se requiere Node.js 22.

```sh
npm test
npm run coverage
```

## Alcance y honestidad de la evidencia

Las pruebas unitarias cubren `src/core.js`, no toda la aplicación. La CI remota y el despliegue se revisan en las pestañas Actions y Settings → Pages de GitHub. La aprobación por pares debe ser realizada por una persona externa; este repositorio no la presupone.

Autor académico: Brandon Moraga. Caso ficticio de Andes Market.