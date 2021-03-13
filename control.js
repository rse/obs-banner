
/*  await DOM to be ready...  */
$(document).ready(() => {
    /*  initially fetch potentially already stored configuration  */
    const cfg = localStorage.getItem("obs-banner-cfg")
    if (cfg !== null) {
        const { text, x, y, w, h } = JSON.parse(cfg)
        $(".text").val(text)
        $(".posx").val(x)
        $(".posy").val(y)
        $(".sizew").val(w)
        $(".sizeh").val(h)
    }

    /*  establish channels to source  */
    const bcs = new BroadcastChannel("obs-banner-source")
    const bcc = new BroadcastChannel("obs-banner-control")

    /*  update configuration from UI form  */
    const update = () => {
        const x = parseInt($(".posx").val().replace(/[^-+0-9]/g, ""))
        const y = parseInt($(".posy").val().replace(/[^-+0-9]/g, ""))
        const w = parseInt($(".sizew").val().replace(/[^-+0-9]/g, ""))
        const h = parseInt($(".sizeh").val().replace(/[^-+0-9]/g, ""))
        const text = $(".text").val()
        if (text !== "" && x !== null && y !== null && w !== null && h !== null) {
            const data = { text, x, y, w, h }
            bcs.postMessage({ command: "configure", data: data })
            localStorage.setItem("obs-banner-cfg", JSON.stringify(data))
        }
    }

    /*  react on UI form changes  */
    $(".text, .posx, .posy, .sizew, .sizeh").on("keyup", (ev) => {
        update()
    })

    /*  react on UI buttons  */
    $(".control-update").on("click", (ev) => {
        update()
    })
    $(".control-trigger").on("click", (ev) => {
        const cfg = { command: "toggle" }
        bcs.postMessage(cfg)
    })

    /*  react on source polling  */
    bcc.addEventListener("message", (ev) => {
        if (ev.data.command === "poll")
            update()
    })

    /*  at least once update initially  */
    update()
})

