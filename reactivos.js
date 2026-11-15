// Banco de reactivos del juego 2.
// Se carga como <script> y no con fetch para que funcione abriendo index.html directo (file://).
//
// Cada reactivo:
//   pregunta     texto; lo que va entre $...$ se dibuja con KaTeX
//   correcta     respuesta correcta (TeX)
//   distractor   respuesta incorrecta (TeX)
//   trampa       true  -> el error es una "trampa absurda"
//                false -> es un error de procedimiento (signos, factorización incompleta...)
//   tema         caso de factorización; se usa para la tabla de la retroalimentación
//   explicacion  desarrollo que se muestra en la pantalla después de responder
const REACTIVOS = {
    "tema": "Simplificación de fracciones algebraicas",
    "resultadoAprendizaje": "Simplifica fracciones algebraicas empleando la factorización de polinomios en el numerador y en el denominador.",
    "reactivosPorPartida": 8,
    "reactivos": [
        {
            "id": 1, "tema": "factor común",
            "pregunta": "Simplifica $\\dfrac{3x^{2}+6x}{3x}$",
            "correcta": "x+2", "distractor": "x", "trampa": false,
            "explicacion": "$\\dfrac{3x(x+2)}{3x} = x+2$"
        },
        {
            "id": 2, "tema": "factor común",
            "pregunta": "Simplifica $\\dfrac{5x^{3}-10x^{2}}{5x^{2}}$",
            "correcta": "x-2", "distractor": "x-1", "trampa": false,
            "explicacion": "$\\dfrac{5x^{2}(x-2)}{5x^{2}} = x-2$"
        },
        {
            "id": 3, "tema": "factor común",
            "pregunta": "Simplifica $\\dfrac{4x^{2}y+8xy}{4xy}$",
            "correcta": "x+2", "distractor": "x+2y", "trampa": false,
            "explicacion": "$\\dfrac{4xy(x+2)}{4xy} = x+2$"
        },
        {
            "id": 4, "tema": "factor común",
            "pregunta": "Simplifica $\\dfrac{2x(x-1)+3(x-1)}{x-1}$",
            "correcta": "2x+3", "distractor": "2x+1", "trampa": false,
            "explicacion": "El binomio $(x-1)$ es factor común: $\\dfrac{(x-1)(2x+3)}{x-1} = 2x+3$"
        },
        {
            "id": 5, "tema": "diferencia de cuadrados",
            "pregunta": "Simplifica $\\dfrac{x^{2}-25}{x-5}$",
            "correcta": "x+5", "distractor": "x-5", "trampa": false,
            "explicacion": "$\\dfrac{(x+5)(x-5)}{x-5} = x+5$"
        },
        {
            "id": 6, "tema": "diferencia de cuadrados",
            "pregunta": "Simplifica $\\dfrac{4x^{2}-9}{2x-3}$",
            "correcta": "2x+3", "distractor": "2x-3", "trampa": false,
            "explicacion": "$\\dfrac{(2x+3)(2x-3)}{2x-3} = 2x+3$"
        },
        {
            "id": 7, "tema": "diferencia de cuadrados",
            "pregunta": "Simplifica $\\dfrac{x^{2}-1}{x+1}$",
            "correcta": "x-1", "distractor": "x+1", "trampa": false,
            "explicacion": "$\\dfrac{(x+1)(x-1)}{x+1} = x-1$"
        },
        {
            "id": 8, "tema": "diferencia de cuadrados",
            "pregunta": "Simplifica $\\dfrac{9x^{2}-16}{3x-4}$",
            "correcta": "3x+4", "distractor": "3x-4", "trampa": false,
            "explicacion": "$\\dfrac{(3x+4)(3x-4)}{3x-4} = 3x+4$"
        },
        {
            "id": 9, "tema": "trinomio cuadrado perfecto",
            "pregunta": "Simplifica $\\dfrac{x^{2}+6x+9}{x+3}$",
            "correcta": "x+3", "distractor": "x+6", "trampa": false,
            "explicacion": "$\\dfrac{(x+3)^{2}}{x+3} = x+3$"
        },
        {
            "id": 10, "tema": "trinomio cuadrado perfecto",
            "pregunta": "Simplifica $\\dfrac{x^{2}-8x+16}{x-4}$",
            "correcta": "x-4", "distractor": "x+4", "trampa": true,
            "explicacion": "$\\dfrac{(x-4)^{2}}{x-4} = x-4$"
        },
        {
            "id": 11, "tema": "trinomio cuadrado perfecto",
            "pregunta": "Simplifica $\\dfrac{4x^{2}+4x+1}{2x+1}$",
            "correcta": "2x+1", "distractor": "2x", "trampa": false,
            "explicacion": "$\\dfrac{(2x+1)^{2}}{2x+1} = 2x+1$"
        },
        {
            "id": 12, "tema": "trinomio cuadrado perfecto",
            "pregunta": "Simplifica $\\dfrac{x^{2}+10x+25}{x+5}$",
            "correcta": "x+5", "distractor": "x+25", "trampa": false,
            "explicacion": "$\\dfrac{(x+5)^{2}}{x+5} = x+5$"
        },
        {
            "id": 13, "tema": "trinomio de la forma x²+bx+c",
            "pregunta": "Simplifica $\\dfrac{x^{2}+5x+6}{x+2}$",
            "correcta": "x+3", "distractor": "x+2", "trampa": false,
            "explicacion": "$\\dfrac{(x+2)(x+3)}{x+2} = x+3$"
        },
        {
            "id": 14, "tema": "trinomio de la forma x²+bx+c",
            "pregunta": "Simplifica $\\dfrac{x^{2}-3x-10}{x-5}$",
            "correcta": "x+2", "distractor": "x-2", "trampa": true,
            "explicacion": "$\\dfrac{(x-5)(x+2)}{x-5} = x+2$"
        },
        {
            "id": 15, "tema": "trinomio de la forma x²+bx+c",
            "pregunta": "Simplifica $\\dfrac{x^{2}-7x+12}{x-3}$",
            "correcta": "x-4", "distractor": "x+4", "trampa": true,
            "explicacion": "$\\dfrac{(x-3)(x-4)}{x-3} = x-4$"
        },
        {
            "id": 16, "tema": "trinomio de la forma x²+bx+c",
            "pregunta": "Simplifica $\\dfrac{x^{2}+2x-15}{x+5}$",
            "correcta": "x-3", "distractor": "x+3", "trampa": false,
            "explicacion": "$\\dfrac{(x+5)(x-3)}{x+5} = x-3$"
        },
        {
            "id": 17, "tema": "factorización combinada",
            "pregunta": "Simplifica $\\dfrac{2x^{2}-8}{x-2}$",
            "correcta": "2x+4", "distractor": "x+2", "trampa": false,
            "explicacion": "$\\dfrac{2(x^{2}-4)}{x-2} = \\dfrac{2(x+2)(x-2)}{x-2} = 2(x+2) = 2x+4$"
        },
        {
            "id": 18, "tema": "factorización combinada",
            "pregunta": "Simplifica $\\dfrac{x^{3}-x}{x^{2}-1}$",
            "correcta": "x", "distractor": "1", "trampa": false,
            "explicacion": "$\\dfrac{x(x^{2}-1)}{x^{2}-1} = x$"
        },
        {
            "id": 19, "tema": "factorización combinada",
            "pregunta": "Simplifica $\\dfrac{x^{2}-4x+4}{x^{2}-4}$",
            "correcta": "\\dfrac{x-2}{x+2}", "distractor": "1", "trampa": false,
            "explicacion": "$\\dfrac{(x-2)^{2}}{(x+2)(x-2)} = \\dfrac{x-2}{x+2}$"
        },
        {
            "id": 20, "tema": "factorización combinada",
            "pregunta": "Simplifica $\\dfrac{x^{2}-9}{x^{2}+6x+9}$",
            "correcta": "\\dfrac{x-3}{x+3}", "distractor": "\\dfrac{x-3}{x-3}", "trampa": false,
            "explicacion": "$\\dfrac{(x+3)(x-3)}{(x+3)^{2}} = \\dfrac{x-3}{x+3}$"
        }
    ]
};
