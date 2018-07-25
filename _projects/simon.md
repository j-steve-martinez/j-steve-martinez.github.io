---
layout: project
title:  "Simon"
date:   2018-07-19
script: /javascript/simon.js
categories: freeCodeCamp
---
<div>Simon Say play a game.</div>

<div class="main">
    <div class="simon-control">controlls
        <div>
            <div id="button-start" class="simon-control-button">Start</div>
            <div id="button-strict" class="simon-control-button">Strict</div>
            <div id="button-reset" class="simon-control-button">Reset</div>
            <div id="button-power"  class="simon-control-button">Power</div>
        </div>
        <div>
            <div id="output-power"   class="simon-control-output">off</div>
            <div id="output-counter" class="simon-control-output">00</div>
        </div>
    </div>
    <div class="simon-input">inputs
        <div id="input-1" class="simon-input"></div>
        <div id="input-2" class="simon-input"></div>
        <div id="input-3" class="simon-input"></div>
        <div id="input-4" class="simon-input"></div>
    </div>
	<div id="wrapper">	
		<a href="#" class="button">Button</a>
		<a href="#" data-icon="♚" class="button orange shield glossy">King</a>
		<a href="#" data-icon="♛" class="button pink serif round glass">Queen</a>
		<a href="#" data-icon="♞" class="button blue skew">Horse</a>
		<br />
		<a href="#accessibility" role="button" tabindex="1" class="button green">Tab1</a>
		<a href="#accessibility" role="button" tabindex="2" class="button green">Tab2</a>
		<button disabled class="button green glossy">Disabled</button>
	</div>
</div>