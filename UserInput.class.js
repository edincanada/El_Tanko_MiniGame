

var UserInput = function ( pProcessing )
{
  
  this._$p = pProcessing ;
  this.moveDown = false ;
  this.moveUp = false ;
  this.moveLeft = false ;
  this.moveRight = false ;
} ;

UserInput.prototype.updateKeyPressed = function ( pKey )
{
  this.moveDown =( pKey == this._$p.DOWN ) ;
  this.moveUp = ( pKey == this._$p.UP ) ;
  this.moveRight = ( pKey == this._$p.RIGHT ) ;
  this.moveLeft = ( pKey == this._$p.LEFT ) ;
} ;

UserInput._CODE_w = 119 ;
UserInput._CODE_a = 97 ;
UserInput._CODE_s = 115 ;
UserInput._CODE_d = 100 ;

UserInput._CODE_W = 87 ;
UserInput._CODE_A = 65 ;
UserInput._CODE_S = 83 ;
UserInput._CODE_D = 68 ;

UserInput.prototype.updateKeyTyped = function ( pKey )
{
  this.moveDown = ( pKey.code == UserInput._CODE_s ) || ( pKey.code == UserInput._CODE_S ) ;
  this.moveUp = ( pKey.code == UserInput._CODE_w ) || ( pKey.code == UserInput._CODE_W ) ;
  this.moveRight = ( pKey.code == UserInput._CODE_d ) || ( pKey.code == UserInput._CODE_D ) ;
  this.moveLeft = ( pKey.code == UserInput._CODE_a ) || ( pKey.code == UserInput._CODE_A ) ;
} ;


UserInput.prototype.reset = function ( )
{
  this.moveDown = false ;
  this.moveUp = false ;
  this.moveRight = false ;
  this.moveLeft = false ;
  this.shooting = false ;
} ;

UserInput.prototype.getAim = function  ( )
{
  return {
    x : this._$p.mouseX ,
    y : this._$p.mouseY
  } ;
} ;

UserInput.prototype.shoot = function ( )
{
  this.shooting = true ;
} ;