---
layout: project
title:  "Simon"
date:   2018-07-19
script: /javascript/simon.js
categories: freeCodeCamp
---
<div>Simon Say play a game.</div>

<div class="main">
    <div id="1" class="quarter quarter-tl"></div>
    <div id="2" class="quarter quarter-tr"></div>
    <div id="3" class="quarter quarter-bl"></div>
    <div id="4" class="quarter quarter-br"></div>
    <div class="cutout">
    <table id="controlls">
        <tr>
            <td class="uniform"><div id="start-c" class="small-circle"></div></td>
            <td class="uniform"><div id="strict-c" class="small-circle"></div></td>
            <td class="uniform"><div id="reset-c" class="small-circle"></div></td>
        </tr>
        <tr>
            <td id="start"  class="label">START</td>
            <td id="strict" class="label">STRICT</td>
            <td id="reset"  class="label">RESET</td>
        </tr>
        <tr>
            <td>
            <div id="power-label">
                POWER:
            </div></td>
            <td class="uniform"><div id="power"></div></td>
            <td>
                <div id="counter">
                    --
                </div>
            </td>
        </tr>
    </table>
    </div>
</div>