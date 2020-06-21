

var DummyInput = function ( pProcessing )
{
  
  this._$p = pProcessing ;
  this.moveDown = false ;
  this.moveUp = false ;
  this.moveLeft = false ;
  this.moveRight = false ;
  
} ;


DummyInput.prototype.getAim = function  ( )
{
  return {
    x : 0 ,
    y : 0
  } ;
} ;



