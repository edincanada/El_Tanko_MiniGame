

var Color = { } ;



var sketch = function ( pProcessing )
{
  
var _$p = pProcessing ;
var _userInput = null ;
var _computerInput = null ;
var _turret = null ;
var _myTank = null ;

var _walls = [] ;


var _otherTank = null ;
var _backgroundMap ;

var _spanKills = document.getElementById( 'spanKills' ) ;
var _spanDeaths = document.getElementById( 'spanDeaths' ) ;
var _divEnemyHealth = document.getElementById( 'divPlayerEnemyBar' ) ;
var _divPlayerHealth = document.getElementById( 'divPlayerHealthBar' ) ;

var _kills = 0 , _deaths = 0 ;



_$p.setup = function ( )
{
  
  Color.BLACK = _$p.color( 0 , 0 , 0 ) ;
  Color.RED   = _$p.color( 255 , 0 , 0 ) ;
  Color.WHITE = _$p.color( 255 , 255 , 255 ) ;
  Color.ORANGE = _$p.color( 0xFF , 0x66 , 0x00 ) ;
  Color.LIGHT_GREEN = _$p.color( 0 , 255 , 0 ) ;
  Color.GREEN =  _$p.color( 0 , 128 , 0 ) ;
  Color.DARK_GREEN = _$p.color( 0 , 96 , 0 ) ;
  
  _backgroundMap = _$p.requestImage( 'http://edincanada.tech/apps/eltanko/eltankomap.jpg' ) ;

  _userInput = new UserInput( _$p ) ;
  _turret = new Turret( _$p , Color.LIGHT_GREEN , _userInput , Color.GREEN , Color.BLACK ) ;
 
  _walls.push( new Wall( { left : 0 , top : 0 , right : 53 , bottom : 165 })) ;
  _walls.push( new Wall( { left : 0 , top : 251 , right : 42 , bottom : 465 })) ;
  _walls.push( new Wall( { left : 78 , top : 550 , right : 140 , bottom : 599 })) ;
  _walls.push( new Wall( { left : 184 , top : 72 , right : 526 , bottom : 136 })) ;
  _walls.push( new Wall( { left : 172 , top : 293 , right : 533 , bottom : 331 })) ;
  _walls.push( new Wall( { left : 169 , top : 429 , right : 413 , bottom : 465 })) ;
  _walls.push( new Wall( { left : 253 , top : 466 , right : 299 , bottom : 540 })) ;
  _walls.push( new Wall( { left : 380 , top : 137 , right : 434 , bottom : 292 })) ;
  _walls.push( new Wall( { left : 534 , top : 293 , right : 602 , bottom : 465 })) ;
  _walls.push( new Wall( { left : 603 , top : 341 , right : 724 , bottom : 410 })) ;
  _walls.push( new Wall( { left : 386 , top : 544 , right : 720 , bottom : 599 })) ;
  _walls.push( new Wall( { left : 695 , top : 0 , right : 799 , bottom : 187 })) ;

  
  _myTank = new Tank( _$p , _turret , Color.DARK_GREEN , { top : 150 , left : 150 } , _userInput , Color.BLACK ) ;

  _myTank.onKilled = function ( )
  {
    _myTank.randomRespawn({ left : 80 , top : 42 , right : 119 , bottom : 508 }) ;
    var width = _myTank.getHealth() * 4 ;
    _divPlayerHealth.style.width = width + 'px' ;
    _deaths ++ ;
    _spanDeaths.innerHTML = '' + _deaths ; 
  } ;
  
  _myTank.onDamageTaken = function ( )
  {
    var width = _myTank.getHealth() * 4 ;
    _divPlayerHealth.style.width = width + 'px' ;
  } ;

  _computerInput = new ComputerInput([ _myTank ]) ;
  _otherTank = new Tank(
    _$p ,
    new Turret( _$p , Color.RED , _computerInput , Color.RED , Color.BLACK ) ,
    Color.BLACK ,
    { top : 480 , left : 730 } ,
    _computerInput ,
    Color.RED
  ) ;
    
  _otherTank.onKilled = function ( )
  {
    _otherTank.randomRespawn({ left : 740 , top : 205 , right : 760 , bottom : 587 }) ;
    var width = _otherTank.getHealth() * 4 ;
    _divEnemyHealth.style.width = width + 'px' ;
    _kills ++ ;
    _spanKills.innerHTML = '' + _kills ;
  } ;
  
  _otherTank.onDamageTaken = function ( )
  {
    var width = _otherTank.getHealth() * 4 ;
    _divEnemyHealth.style.width = width + 'px' ;
  } ;
    
  _computerInput.setTank( _otherTank ) ;

  _$p.size( 800 , 600 ) ;
  _$p.background( Color.WHITE ) ;
  _$p.frameRate( 40 ) ;

} ;

_$p.draw = function ( )
{
  if ( _backgroundMap.width < 1 )
  {
    return ;
  }

  _$p.image( _backgroundMap , 0 , 0 ) ;
  
  _myTank.update() ;
 
  _otherTank.update() ;
  Shell.updateAll() ;

  Shell.drawFired() ;
  _myTank.draw() ;
  _otherTank.draw() ;
  Shell.drawExploding() ;

  _userInput.reset() ;
  _computerInput.update() ;
} ;

_$p.keyPressed = function ( )
{
  _userInput.updateKeyPressed( _$p.keyCode ) ;
} ;

_$p.mousePressed = function ( )
{
  _userInput.shoot() ;
  //_myTank.shoot() ;
} ;

_$p.keyTyped = function ( )
{
  _userInput.updateKeyTyped( _$p.key ) ;
} ;

} ;


window.addEventListener(
  'load' ,
  function ( )
  {
    var cnvElTanko = document.getElementById( 'cnvElTanko' ) ;
    var processingSketch = new Processing( cnvElTanko , sketch ) ;
    
    ExtraTabSelect( document.getElementById( 'sltCodeDisplay' ) , true ) ;
  } ,
  false
) ;