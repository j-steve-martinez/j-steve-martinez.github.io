---
layout: project
title:  Tic-Tac-Toe
date:   2018-07-24 08:59:14
script: /javascript/tic_tac_toe.js
categories: freeCodeCamp
---
<h3>Would you like to play a game?</h3>
<div class="container">
  <div class="jumbotron text-center">
    <table id="board">
      <tr>
        <td id="1" class="box"></td>
        <td id="2" class="box"></td>
        <td id="3" class="box"></td>
      </tr>
      <tr>
        <td id="4" class="box"></td>
        <td id="5" class="box"></td>
        <td id="6" class="box"></td>
      </tr>
      <tr>
        <td id="7" class="box"></td>
        <td id="8" class="box"></td>
        <td id="9" class="box"></td>
      </tr>
    </table>
    <div id="ask">
      Just click on  
      <button id="X" class="ask">X</button>
      or
      <button id="O" class="ask">O</button>
      to start.
    </div>
  </div>
</div>
<script>
$(document).ready(ticTacToe);
</script>
