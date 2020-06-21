

var Wall = function ( pBounds )
{
  this._position = { } ;
  this._position.top = pBounds.top ;
  this._position.left = pBounds.left ;
  this._position.bottom = pBounds.bottom ;
  this._position.right = pBounds.right ;
  
  
  Wall.Walls.push( this ) ;
} ;

Wall.prototype.getBounds = function ( )
{
  return this._position ;
}

Wall.Walls = [ ] ;