
OBS-Banner
==========

**Simple Banner for OBS Studio**

Abstract
--------

**OBS-Banner** is a HTML/CSS/JS-based Browser Source layer for [OBS
Studio](http://obsproject.com/) for displaying a prominent banner as an
animated overlay in a video broadcasting scene. This is usually used to
show central information of an event. The banner text can be arbitrary
HTML and can be configured through a companion Custom Browser Dock.

Usage
-----

1. Download and unpack the **OBS-Banner** sources:<br/>
   https://github.com/rse/obs-banner/archive/master.zip

2. Download and unpack the **OBS-Scripts** sources:<br/>
   https://github.com/rse/obs-scripts/archive/master.zip

3. Add the Custom Browser Dock to your OBS Studio UI:<br/>
   **View** &rarr; **Docks** &rarr; **Custom Browser Docks...**

   - Dock Name: **OBS Banner**
   - URL: *local-path*`/obs-banner/control.html`

4. Add the **Keyboard Event Filter** script:<br/>
   **Tools** &rarr; **Scripts** &rarr; **+**

   - Filename: *local-path*`/obs-scripts/keyboard-event-filter.lua`

5. Add the **Browser Source** to your scene:
   **Sources** &rarr; **+** &rarr; **Browser** &rarr; **Create new** &rarr; <i>your-source-name</i>

   - Local File: **(disabled)**
   - URL: *local-path*`/obs-banner/source.html`
   - Width: <i>your-browser-source-width</i>
   - Height: <i>your-browser-source-height</i>
   - Use custom frame rate: **(enabled)**
   - Control audio via OBS: **(disabled)**
   - FPS: **30**
   - Custom CSS: **(empty)**
   - Shutdown source when not visible: **(disabled)**
   - Refresh browser when scene becomes active: **(disabled)**

6. Add the **Keyboard Event** filter to your **Browser Source**:<br/>
   **Sources** &rarr; <i>your-source-name</i> &rarr; (context menu) **Filters**<br/>
   **Effect Filters** &rarr; **+** &rarr; **Keyboard Event**<br/>
   **Keyboard events** &rarr; **+** &rarr; **a**

7. Map an OBS Studio global hotkey onto the **Keyboard Event**:<br/>
   **File** &rarr; **Settings** &rarr; **Hotkeys** &rarr; **Keyboard Event: a**

License
-------

Copyright (c) 2021 Dr. Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

