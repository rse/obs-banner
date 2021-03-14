
/*  await DOM to be ready...  */
$(document).ready(() => {
    /*  initially fetch potentially already stored configuration  */
    const cfg = localStorage.getItem("obs-banner-cfg")
    if (cfg !== null) {
        const { text, x, y, w, h, colbar1, colbar2, colbox1, colbox2, coltxt1, coltxt2, fontf, fonts, fontw } = JSON.parse(cfg)
        if (text !== "" && x !== null && y !== null && w !== null && h !== null &&
            colbar1 !== "" && colbar2 !== "" && colbox1 !== "" && colbox2 !== "" && coltxt1 !== "" && coltxt2 !== "" &&
            fontf !== "" && fonts !== "" && fontw !== "") {
            $(".text").val(text)
            $(".posx").val(x)
            $(".posy").val(y)
            $(".sizew").val(w)
            $(".sizeh").val(h)
            $(".colbar1").val(colbar1)
            $(".colbar2").val(colbar2)
            $(".colbox1").val(colbox1)
            $(".colbox2").val(colbox2)
            $(".coltxt1").val(coltxt1)
            $(".coltxt2").val(coltxt2)
            $(".fontf").val(fontf)
            $(".fonts").val(fonts)
            $(".fontw").val(fontw)
        }
    }

    /*  establish channels to source  */
    const bcs = new BroadcastChannel("obs-banner-source")
    const bcc = new BroadcastChannel("obs-banner-control")

    /*  manage tabs  */
    $(".tab-button").on("click", (ev) => {
        let id = $(ev.target).attr("data-tab")
        $(".tab-button").removeClass("active")
        $(`.tab-button-${id}`).addClass("active")
        $(".tab-content").removeClass("active")
        $(`.tab-content-${id}`).addClass("active")
    })

    /*  update configuration from UI form  */
    const update = () => {
        const x = parseInt($(".posx").val().replace(/[^-+0-9]/g, ""))
        const y = parseInt($(".posy").val().replace(/[^-+0-9]/g, ""))
        const w = parseInt($(".sizew").val().replace(/[^-+0-9]/g, ""))
        const h = parseInt($(".sizeh").val().replace(/[^-+0-9]/g, ""))
        const colbar1 = $(".colbar1").val().replace(/[^0-9a-fA-F]/g, "")
        const colbar2 = $(".colbar2").val().replace(/[^0-9a-fA-F]/g, "")
        const colbox1 = $(".colbox1").val().replace(/[^0-9a-fA-F]/g, "")
        const colbox2 = $(".colbox2").val().replace(/[^0-9a-fA-F]/g, "")
        const coltxt1 = $(".coltxt1").val().replace(/[^0-9a-fA-F]/g, "")
        const coltxt2 = $(".coltxt2").val().replace(/[^0-9a-fA-F]/g, "")
        const fontf = $(".fontf").val().replace(/^\s+/, "").replace(/\s+$/, "")
        const fonts = $(".fonts").val().replace(/^\s+/, "").replace(/\s+$/, "")
        const fontw = $(".fontw").val().replace(/^\s+/, "").replace(/\s+$/, "")
        const text = $(".text").val()
        if (text !== "" && x !== null && y !== null && w !== null && h !== null &&
            colbar1 !== "" && colbar2 !== "" && colbox1 !== "" && colbox2 !== "" && coltxt1 !== "" && coltxt2 !== "" &&
            fontf !== "" && fonts !== "" && fontw !== "") {
            const data = { text, x, y, w, h, colbar1, colbar2, colbox1, colbox2, coltxt1, coltxt2, fontf, fonts, fontw }
            bcs.postMessage({ command: "configure", data: data })
            localStorage.setItem("obs-banner-cfg", JSON.stringify(data))
        }
    }

    /*  react on UI form changes  */
    $(".text, .posx, .posy, .sizew, .sizeh, " +
        ".colbar1, .colbar2, .colbox1, .colbox2, .coltxt1, .coltxt2, .fontf, .fonts, .fontw").on("keyup", (ev) => {
        update()
    })

    /*  react on UI buttons  */
    $(".control-reset").on("click", (ev) => {
        localStorage.removeItem("obs-banner-cfg")
        location.reload()
    })
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

