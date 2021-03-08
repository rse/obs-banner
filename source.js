
/*  await DOM to be ready...  */
$(document).ready(() => {
    /*  grab the elements in the DOM fragment  */
    const el        = $(".banner").get(0)
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

        /*  style DOM fragment  */
        $(el)
            .css("width",  `${sw}px`)
            .css("height", `${sh}px`)
            .removeClass("banner-l")
            .removeClass("banner-r")
            .addClass(`banner-${xd}`)
        $(".content", el)
            .css("width",  `${15 + w + 15}px`)
            .css("height", `${sh}px`)
        $(".door", el)
            .css("height", `${sh}px`)
        $(".door .bar", el)
            .css("height", `${sh}px`)

        /*  update fragment content  */
        $(".content", el)
            .html(cfg.text)
    }

    /*  show banner  */
    const show = (quick) => {
        if (quick) {
            /*  show quickly (no animation at all)  */
            $(".door .bar", el).css("top", 0)
            $(".content", el).css("left", 0)
            return
        }

        /*  initialize animation positions  */
        $(".door .bar", el).css("top", yd === "t" ? -sh : sh)
        $(".content", el).css("left", xd === "l" ? -sw : sw)

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
    const hide = (quick) => {
        if (quick) {
            /*  hide quickly (no animation at all)  */
            $(".door .bar", el).css("top", yd === "t" ? -sh : sh)
            $(".content", el).css("left", xd === "l" ? -sw : sw)
            return
        }

        /*  initialize animation positions  */
        $(".door .bar", el).css("top", yd === "t" ? sh : -sh)
        $(".content", el).css("left", xd === "l" ? sw : -sw)

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
        $(".content", el).text("ev.key=" + ev.key)
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
    const bcs = new BroadcastChannel("topics-source")
    const bcc = new BroadcastChannel("topics-control")

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
    reconfigure({ text: "", x: 100, y: 100, w: 400, h: 100 })
    // hide(true)
    show(true)

    /*  poll control once to be updated with real configuration  */
    bcc.postMessage({ command: "poll" })
})

