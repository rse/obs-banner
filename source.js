
/*  await DOM to be ready...  */
$(document).ready(() => {
    /*  grab the elements in the DOM fragment  */
    const elGFCSS   = $("#gfcss").get(0)
    const el        = $(".banner").get(0)
    const elDoor    = $(".door", el).get(0)
    const elBar     = $(".door .bar", el).get(0)
    const elContent = $(".content", el).get(0)

    /*  fixed animation times  */
    const timeAnimation1 = 250
    const timeAnimation2 = 1500

    /*  positioning configuration  */
    let xd, yd, x, y, w, h, sw, sh

    /*  update configuration  */
    const reconfigure = (cfg) => {
        /*  take over configuration  */
        x = cfg.x; y = cfg.y; w = cfg.w; h = cfg.h

        /*  position DOM fragment  */
        if (x > 0) {
            $(el).css("left", `${x}px`)
            $(el).prop("style").removeProperty("right")
            xd = "l"
        }
        else {
            $(el).prop("style").removeProperty("left")
            $(el).css("right", `${-x}px`)
            xd = "r"
        }
        if (y > 0) {
            $(el).css("top", `${y}px`)
            $(el).prop("style").removeProperty("bottom")
            yd = "t"
        }
        else {
            $(el).prop("style").removeProperty("top")
            $(el).css("bottom", `${-y}px`)
            yd = "b"
        }

        /*  determine width/height  */
        sw = 6 + 15 + w + 15
        sh = 6 + h + 6

        /*  update font reference */
        $(elGFCSS).attr("href", `https://fonts.googleapis.com/css?family=${cfg.fontf.replace(/\s+/g, "+")}`)

        /*  update fragment content  */
        $(elContent).html(cfg.text)

        /*  style DOM fragment  */
        $(el)
            .css("width",  `${sw}px`)
            .css("height", `${sh}px`)
            .removeClass("banner-l")
            .removeClass("banner-r")
            .addClass(`banner-${xd}`)
        $(elContent)
            .css("width",  `${15 + w + 15}px`)
            .css("height", `${sh}px`)
            .css("background", `linear-gradient(180deg, #${cfg.colbox1}, #${cfg.colbox2})`)
            .css("color", `#${cfg.coltxt1}`)
            .css("font-family", `${cfg.fontf}`)
            .css("font-size", `${cfg.fonts}`)
            .css("font-weight", `${cfg.fontw}`)
        $("em", elContent)
            .css("color", `#${cfg.coltxt2}`)
        $(elDoor)
            .css("height", `${sh}px`)
        $(elBar)
            .css("height", `${sh}px`)
            .css("background", `linear-gradient(180deg, #${cfg.colbar1}, #${cfg.colbar2})`)
    }

    /*  show banner  */
    const show = (quick = false) => {
        if (quick) {
            /*  show quickly (no animation at all)  */
            $(elBar).css("top", 0)
            $(elContent).css("left", 0)
            return
        }

        /*  initialize animation positions  */
        $(elBar).css("top", yd === "t" ? -sh : sh)
        $(elContent).css("left", xd === "l" ? -sw : sw)

        /*  create animation timeline  */
        const tl = anime.timeline({
            autoplay:  true,
            direction: "normal"
        })

        /*  coming: bar  */
        tl.add({
            targets:   elBar,
            duration:  timeAnimation1,
            easing:    "easeOutSine",
            ...(yd === "t" ? { top: [ -sh, 0 ] } : { top: [  sh, 0 ] })
        })

        /*  coming: content  */
        tl.add({
            targets:   elContent,
            duration:  timeAnimation2,
            easing:    "easeOutSine",
            ...(xd === "l" ? { left: [ -sw, 0 ] } : { left: [  sw, 0 ] })
        })
    }

    /*  hide banner  */
    const hide = (quick = false) => {
        if (quick) {
            /*  hide quickly (no animation at all)  */
            $(elBar).css("top", yd === "t" ? -sh : sh)
            $(elContent).css("left", xd === "l" ? -sw : sw)
            return
        }

        /*  initialize animation positions  */
        $(elBar).css("top", yd === "t" ? sh : -sh)
        $(elContent).css("left", xd === "l" ? sw : -sw)

        /*  create animation timeline  */
        const tl = anime.timeline({
            autoplay:  true,
            direction: "normal"
        })

        /*  going: content  */
        tl.add({
            targets:   elContent,
            duration:  timeAnimation2,
            easing:    "easeInSine",
            ...(xd === "l" ? { left: [ 0, -sw ] } : { left: [ 0,  sw ] })
        })

        /*  going: bar  */
        tl.add({
            targets:   elBar,
            duration:  timeAnimation1,
            easing:    "easeInSine",
            ...(yd === "t" ? { top: [ 0, -sh ] } : { top: [ 0,  sh ] })
        })
    }

    /*  user keyboard interaction  */
    let active = false
    window.addEventListener("keyup", (ev) => {
        if (ev.key === "a") {
            /*  toggle banner (show or hide)  */
            active = !active
            if (active)
                show()
            else
                hide()
        }
    })

    /*  establish channels to control  */
    const bcs = new BroadcastChannel("obs-banner-source")
    const bcc = new BroadcastChannel("obs-banner-control")

    /*  receive control command  */
    bcs.addEventListener("message", (ev) => {
        if (typeof ev.data === "object") {
            if (ev.data.command === "configure") {
                /*  reconfigure ourself  */
                reconfigure(ev.data.data)
                if (active)
                    show(true)
                else
                    hide(true)
            }
            else if (ev.data.command === "toggle") {
                /*  toggle banner (show or hide)  */
                active = !active
                if (active)
                    show()
                else
                    hide()
            }
        }
    })

    /*  initialize our configuration at least once  */
    reconfigure({
        text: "",
        x: 100, y: 100,
        w: 400, h: 100,
        colbar1: "ff3333", colbar2: "cc0000",
        colbox1: "ffffffc0", colbox2: "f8f8f8c0",
        coltxt1: "000000", coltxt2: "cc0000",
        fonts: "12pt", fontw: "normal",
        fontf: "Source Sans Pro:normal,italic,bold,bolditalic"
    })
    hide(true)

    /*  poll control once to be updated with real configuration  */
    bcc.postMessage({ command: "poll" })
})

