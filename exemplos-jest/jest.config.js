const config = {
    "reporters": [
        "default",
        ["jest-html-reporters", {
            "publicPath": "/home/leo/cobertura-codigo/exemplos-jest",
            "filename": "relatorio-testes.html",
            "openReport": true
        }]
    ]
}

module.exports = config;