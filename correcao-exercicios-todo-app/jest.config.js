export default {
    transform: {},
    "reporters": [
        "default",
        ["jest-html-reporters", {
            "publicPath": "/home/leo/cobertura-codigo/correcao-todo",
            "filename": "report.html",
            "openReport": false
        }]
    ]
}