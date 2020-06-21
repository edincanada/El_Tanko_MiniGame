

var Turret = function ( pProcessing , pColor , pControls , pCannonColor , pShellColor )
{
  this._$p = pProcessing ;
  this._color = pColor ;
  this._shellColor = pShellColor ;
  this._cannonColor = pCannonColor ;
  
  this._centerX = -1 ;
  this._centerY = -1 ;
  
  this._input = pControls ;
  
} ;

Turret.SIZE = 20 ;
Turret.RADIUS = 30 ;
Turret.GUN_WIDTH = 6 ;
Turret.HALF_PI = Math.PI / 2.0 ;
Turret.SHELL_ORIGIN_RADIUS = 20 ;

Turret.prototype.setPosition = function ( pPosition )
{
  this._centerX = pPosition.x ;
  this._centerY = pPosition.y ;
} ;

Turret.prototype.draw = function ( )
{

  //draw turret. From the center to the aim point
  var aim = this._input.getAim() ;
  
  var deltaX = aim.x - this._centerX ;
  var deltaY = aim.y - this._centerY ;
  
  var angle = Turret.HALF_PI - Math.atan2( deltaX , deltaY ) ;
  
  var turretX = this._centerX + ( Turret.RADIUS * Math.cos( angle )) ;
  var turretY = this._centerY + ( Turret.RADIUS * Math.sin( angle )) ;
  
  this._$p.stroke( this._cannonColor ) ;
  this._$p.strokeWeight( Turret.GUN_WIDTH ) ;
  this._$p.line( this._centerX , this._centerY , turretX , turretY ) ;
  this._$p.strokeWeight( 1 ) ;
  this._$p.stroke( Color.BLACK ) ;
  
  this._$p.fill( this._color ) ;
  this._$p.ellipse( this._centerX , this._centerY , Turret.SIZE , Turret.SIZE ) ;
} ;

Turret.prototype.fireShell = function ( pShooter )
{
  var aim = this._input.getAim() ;

  var retShell = new Shell(
    this._$p ,
    pShooter ,
    { x: this._centerX , y : this._centerY } ,
    { x : aim.x , y : aim.y } ,
    this._shellColor
  ) ;
    
  Shell.Shells.push( retShell ) ;
} ;