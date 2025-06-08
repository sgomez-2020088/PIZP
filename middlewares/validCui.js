
export function cuiIsValid(req, res, next) {
    const cui = req.body.DPI

    if (!cui) {
        return res.status(400).send({ success: false, message: "CUI is required." })
    }

    const cuiRegExp = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/

    if (!cuiRegExp.test(cui)) {
        return res.status(400).send({ success: false, message: "CUI format is invalid." })
    }

    const cleanedCui = cui.replace(/\s/, '')
    const depto = parseInt(cleanedCui.substring(9, 11), 10)
    const muni = parseInt(cleanedCui.substring(11, 13))
    const numero = cleanedCui.substring(0, 8)
    const verificador = parseInt(cleanedCui.substring(8, 9))
    
    const munisPorDepto = [ 
        17, 8, 16, 16, 13, 14, 19, 8, 24, 21, 9, 30, 32, 21, 8, 17, 14, 5, 11, 11, 7, 17
    ];

    if (depto === 0 || muni === 0) {
        return res.status(400).send({ success: false, message: "Invalid department or municipality code." })
    }

    if (depto > munisPorDepto.length) {
        return res.status(400).send({ success: false, message: "Invalid department code." })
    }

    if (muni > munisPorDepto[depto - 1]) {
        return res.status(400).send({ success: false, message: "Invalid municipality code." })
    }

    let total = 0;
    for (let i = 0; i < numero.length; i++) {
        total += numero[i] * (i + 2)
    }

    const modulo = total % 11

    if (modulo !== verificador) {
        return res.status(400).send({ success: false, message: "Invalid CUI based on the 11 complement rule." })
    }

    next()
}
