

var Shell = function ( pProcessing , pShooter , pOrigin , pAim , pColor )
{
  this._$p = null ;
  this._origin = null ;
  this._aim = null ;
  this._currentPosition = null ;
  this._color = null ;
  
  this.status = Shell.STATUS_UNFIRED ;
  this._place = 0 ;
  this._cosAngle = -1 ;
  this._sinAngle = -1 ;
  
  this._shooter = pShooter ;
  this._blowupRadius = -1 ;
  this._internalDraw = function ( ) { } ;

  this.initialize( pProcessing , pOrigin , pAim , pColor ) ;
} ;

Shell.Shells = [ ] ;

Shell._explodingShells = [ ] ;

Shell.updateAll = function ( )
{
  var ii = 0 ;
  for ( ii = 0 ; ii < Shell.Shells.length ; ii ++ )
  {
    Shell.Shells[ ii ].update() ;
  }
  
  for ( ii = 0 ; ii < Shell._explodingShells.length ; ii ++ )
  {
    Shell._explodingShells[ ii ].update() ;
  }
  
  ii = 0 ;
  while ( ii < Shell.Shells.length )
  {
    if ( Shell.Shells[ ii ].status === Shell.STATUS_HIT )
    {
      Shell._explodingShells.push( Shell.Shells[ ii ] ) ;
      Shell.Shells.splice( ii , 1 ) ;
      ii -- ;
    }
    else if ( Shell.Shells[ ii ].status === Shell.STATUS_FINISHED )
    {
      Shell.Shells.splice( ii , 1 ) ;
      ii -- ;
    }
    ii ++ ;
  }
  
  ii = 0 ;
  while ( ii < Shell._explodingShells.length )
  {
    if ( Shell._explodingShells[ ii ].status === Shell.STATUS_FINISHED )
    {
      Shell._explodingShells.splice( ii , 1 ) ;
      ii -- ;
    }

    ii ++ ;
  }
} ;

Shell.drawFired = function ( )
{
  var ii = 0 ;
  for ( ii = 0 ; ii < Shell.Shells.length ; ii ++ )
  {
    Shell.Shells[ ii ].draw() ;
  }
} ;

Shell.drawExploding = function ( )
{
  var ii = 0 ;
  for ( ii = 0 ; ii < Shell._explodingShells.length ; ii ++ )
  {
    Shell._explodingShells[ ii ].draw() ;
  }
} ;

Shell.prototype.initialize = function ( pProcessing , pOrigin , pAim , pColor )
{

  this._$p = pProcessing ;
  this._color = pColor ;
  
  this._origin = {
    x : pOrigin.x ,
    y : pOrigin.y
  } ;
  
  this._aim = {
    x : pAim.x ,
    y : pAim.y
  } ;
  
  this._currentPosition = {
    x : pOrigin.x ,
    y : pOrigin.y
  } ;
  
  this.status = Shell.STATUS_FIRED ;
  
  var deltaX = this._aim.x - this._origin.x ;
  var deltaY = this._aim.y - this._origin.y ;

  var angle = Turret.HALF_PI - Math.atan2( deltaX , deltaY ) ;
  
  this._cosAngle = Math.cos( angle ) ;
  this._sinAngle = Math.sin( angle ) ;
  
  this._place = 30 ;
  
  this._blowupRadius = Shell.BLOWUP_RADIUS ;
  this._internalDraw = Shell.prototype._drawFired ;
} ;

Shell.SIZE = 5 ;

Shell.STATUS_UNFIRED = 0 ;
Shell.STATUS_FIRED = 1 ;
Shell.STATUS_HIT = 2 ;
Shell.STATUS_FINISHED = 3 ;

Shell.SPEED = 4 ;

Shell.BLOWUP_RADIUS = 20 ;

Shell.DAMAGE = 10 ;

Shell.prototype.update = function ( )
{
  if ( this.status === Shell.STATUS_FIRED )
  {
    this._place = this._place + Shell.SPEED ;

    this._currentPosition.x = this._origin.x + ( this._place * this._cosAngle ) ;
    this._currentPosition.y = this._origin.y + ( this._place * this._sinAngle ) ;

    if ( this.outOfBounds())
    {
      this.status = Shell.STATUS_FINISHED ;
    }
    else
    {
      var ii = 0 ;
      
      while (( ii < Tank.Tanks.length ) && ( this.status != Shell.STATUS_HIT ))
      {
        if (( Tank.Tanks[ ii ] != this._shooter ) && this.collided( Tank.Tanks[ ii ] ))
        {
          this.status = Shell.STATUS_HIT ;
          Tank.Tanks[ ii ].takeDamage( Shell.DAMAGE ) ;
          this._internalDraw = Shell.prototype._drawHit ;
        }
        
        ii ++ ;
      }
      
      if ( this.status != Shell.STATUS_HIT )
      {
        ii = 0 ;
        while (( ii < Wall.Walls.length ) && ( this.status != Shell.STATUS_HIT ))
        {
          if ( this.collided( Wall.Walls[ ii ])) //hit a wall, much easier
          {
            this.status = Shell.STATUS_HIT ;
            this._internalDraw = Shell.prototype._drawHit ;
          }
 
          ii ++ ;
        }
      }
    }
  }
  else if ( this.status === Shell.STATUS_HIT )
  {
    this._blowupRadius -= 2 ;
    if ( this._blowupRadius < 1 )
    {
      this.status = Shell.STATUS_FINISHED ;
    }
  }
} ;

Shell.prototype._drawFired = function ( )
{
  this._$p.fill( this._color ) ;
  this._$p.ellipse(
    this._currentPosition.x ,
    this._currentPosition.y  ,
    Shell.SIZE ,
    Shell.SIZE
  ) ;
} ;

Shell.prototype._drawHit = function ( )
{
  this._$p.fill( Color.ORANGE ) ;
  this._$p.ellipse(
    this._currentPosition.x ,
    this._currentPosition.y  ,
    this._blowupRadius ,
    this._blowupRadius
  ) ;
} ;

Shell.prototype.draw = function ( )
{
  this._internalDraw() ;
} ;

Shell.prototype.collided = function ( pCollider )
{
  var bounds = pCollider.getBounds() ;
  
  return (
    ( this._currentPosition.x > bounds.left ) &&
    ( this._currentPosition.x < bounds.right ) &&
    ( this._currentPosition.y < bounds.bottom ) &&
    ( this._currentPosition.y > bounds.top )
  ) ;
} ;

Shell.prototype.outOfBounds = function ( )
{
  return (
    ( this._currentPosition.x < 0 ) ||
    ( this._currentPosition.x > this._$p.width ) ||
    ( this._currentPosition.y < 0 ) ||
    ( this._currentPosition.y > this._$p.height )
  ) ;     
} ;