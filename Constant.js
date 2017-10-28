/*
*常量
*/

var BASE=16;
var WALL="wall";
var HOME="home";
var TANK="tank";
var FLOW="flow";
var SLAB="slab";
var ENEMY="enemy";
var MYTANK="myTank";
var BULLET="bullet";
var BULLETWIDTH=BULLETHEIGHT=6;
var TankObj={};
var oGrid=new Object();//所有地图元素
var oBox=document.getElementById("box");
var oMoveBox=document.getElementById("moveBox");
var START_AUDIO = new Audio("audio/start.mp3");
var ATTACK_AUDIO = new Audio("audio/attack.mp3");
