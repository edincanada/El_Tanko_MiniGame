

var Tank = function ( pProcessing , pTurret , pColor , pPosition , pControls , pTrackColor )
{
  
  this._$p = pProcessing ;
  this._turret = pTurret ;
  this._color = pColor ;
  this._currentPosition = { } ;
  this._currentPosition.top = pPosition.top ;
  this._currentPosition.left = pPosition.left ;
  this._input = pControls ;
  this._health = Tank.HEALTH_POINTS ;
  
  this._turret.setPosition({
    x : this._currentPosition.left + ( Tank.WIDTH / 2 ) ,
    y : this._currentPosition.top + ( Tank.HEIGHT / 2 )
  }) ;
  
  this._isNorthSouth = true ;
  this._trackColor = pTrackColor ;
  
  this._bounds = { } ;
  this._bounds.top = this._currentPosition.top - Tank.OUTER_BOUND_WIDTH ;
  this._bounds.left = this._currentPosition.left - Tank.OUTER_BOUND_WIDTH ;
  
  this._bounds.bottom = this._currentPosition.top + Tank.HEIGHT + Tank.OUTER_BOUND_WIDTH ;
  this._bounds.right = this._currentPosition.left + Tank.WIDTH + Tank.OUTER_BOUND_WIDTH ;
  
  this._internalDraw = Tank.prototype._drawNorthSouth ;
  
  this.onKilled = function () { } ;
  this.onDamageTaken = function ( ) { } ;
  
  Tank.Tanks.push( this ) ;
  
} ;

Tank.WIDTH = 30 ;
Tank.HEIGHT = 30 ;
Tank.HALF_WIDTH = Tank.WIDTH / 2 ;
Tank.HALF_HEIGHT = Tank.HEIGHT / 2 ;
Tank.TRACK_LENGTH = 40 ;
Tank.TRACK_WIDTH = 10 ;
Tank.HALF_TRACK_WIDTH = Tank.TRACK_WIDTH / 2 ;
Tank.SPEED = 2 ;
Tank.TRACK_TOP_OFFSET = (( Tank.TRACK_LENGTH - Tank.HEIGHT )/ 2 ) ;
Tank.BOTTOM_TRACK_TOP_OFFSET = (( 3 * Tank.HEIGHT ) - Tank.TRACK_LENGTH ) / 2 ;

Tank.OUTER_BOUND_WIDTH = 5 ;
Tank.HEALTH_POINTS = 100 ;

Tank.Tanks = [] ;

Tank.prototype._drawNorthSouth = function ( )
{
  this._$p.rect(
    this._currentPosition.left - Tank.HALF_TRACK_WIDTH ,
    this._currentPosition.top - Tank.TRACK_TOP_OFFSET ,
    Tank.TRACK_WIDTH ,
    Tank.TRACK_LENGTH
  ) ;

  this._$p.rect(
    this._currentPosition.left +  Tank.WIDTH - Tank.HALF_TRACK_WIDTH ,
    this._currentPosition.top - Tank.TRACK_TOP_OFFSET ,
    Tank.TRACK_WIDTH ,
    Tank.TRACK_LENGTH
  ) ;
} ;

Tank.prototype._drawEastWest = function ( )
{
  this._$p.fill( this._trackColor ) ;
  this._$p.rect(
    this._currentPosition.left - Tank.HALF_TRACK_WIDTH ,
    this._currentPosition.top - Tank.TRACK_TOP_OFFSET ,
    Tank.TRACK_LENGTH ,
    Tank.TRACK_WIDTH
  ) ;

  this._$p.rect(
    this._currentPosition.left - Tank.HALF_TRACK_WIDTH ,
    this._currentPosition.top + Tank.BOTTOM_TRACK_TOP_OFFSET  ,
    Tank.TRACK_LENGTH ,
    Tank.TRACK_WIDTH
  ) ;
} ;

Tank.prototype.draw = function ( )
{
  //processing calls
  
  this._$p.fill( this._color ) ;
  
  this._$p.rect(
    this._currentPosition.left , 
    this._currentPosition.top ,
    Tank.WIDTH ,
    Tank.HEIGHT
  ) ;
    
  this._$p.fill( this._trackColor ) ;
  
  this._internalDraw() ;
  this._turret.draw() ;
} ;

Tank.prototype.update = function ( )
{
  if ( this._health < 1 )
  {
    this.onKilled() ;
  }
  else
  {
    var oldPositionTop = this._currentPosition.top ,
        oldPositionLeft  = this._currentPosition.left ,
        oldTop = this._bounds.top ,
        oldLeft = this._bounds.left ,
        oldBottom  = this._bounds.bottom ,
        oldRight  = this._bounds.right ;

    if ( this._input.moveDown )
    {
      this._currentPosition.top += Tank.SPEED ;
      this._isNorthSouth = true ;
      this._internalDraw = Tank.prototype._drawNorthSouth ;

      this._bounds.top = this._currentPosition.top - Tank.OUTER_BOUND_WIDTH ;
      this._bounds.left = this._currentPosition.left - Tank.OUTER_BOUND_WIDTH ;

      this._bounds.bottom =
        this._currentPosition.top + Tank.HEIGHT + Tank.OUTER_BOUND_WIDTH ;

      this._bounds.right =
        this._currentPosition.left + Tank.WIDTH + Tank.OUTER_BOUND_WIDTH ;
    }

    if ( this._input.moveUp )
    {
      this._currentPosition.top -= Tank.SPEED ;
      this._isNorthSouth = true ;
      this._internalDraw = Tank.prototype._drawNorthSouth ;

      this._bounds.top = this._currentPosition.top - Tank.OUTER_BOUND_WIDTH ;
      this._bounds.left = this._currentPosition.left - Tank.OUTER_BOUND_WIDTH ;

      this._bounds.bottom =
        this._currentPosition.top + Tank.HEIGHT + Tank.OUTER_BOUND_WIDTH ;

      this._bounds.right =
        this._currentPosition.left + Tank.WIDTH + Tank.OUTER_BOUND_WIDTH ;
    }

    if ( this._input.moveLeft )
    {
      this._currentPosition.left -= Tank.SPEED ;
      this._isNorthSouth = false ;
      this._internalDraw = Tank.prototype._drawEastWest ;

      this._bounds.top = this._currentPosition.top - Tank.OUTER_BOUND_WIDTH ;
      this._bounds.left = this._currentPosition.left - Tank.OUTER_BOUND_WIDTH ;
      this._bounds.bottom = this._currentPosition.top + Tank.WIDTH + Tank.OUTER_BOUND_WIDTH ;
      this._bounds.right = this._currentPosition.left + Tank.HEIGHT + Tank.OUTER_BOUND_WIDTH ;
    }

    if ( this._input.moveRight )
    {
      this._currentPosition.left += Tank.SPEED ;
      this._isNorthSouth = false ;
      this._internalDraw = Tank.prototype._drawEastWest ;

      this._bounds.top = this._currentPosition.top - Tank.OUTER_BOUND_WIDTH ;
      this._bounds.left = this._currentPosition.left - Tank.OUTER_BOUND_WIDTH ;
      this._bounds.bottom = this._currentPosition.top + Tank.WIDTH + Tank.OUTER_BOUND_WIDTH ;
      this._bounds.right = this._currentPosition.left + Tank.HEIGHT + Tank.OUTER_BOUND_WIDTH ;
    }

    if ( this._input.shooting )
    {
      this.shoot() ;
    }


    var collided = this._outOfBounds() ;
    var ii = 0 ;
    while (( ! collided ) && ( ii < Wall.Walls.length ))
    {
      collided = ( this._collidingWith( Wall.Walls[ ii ])) ;
      ii ++ ;
    }

    var ii = 0 ;
    while (( ! collided ) && ( ii < Tank.Tanks.length ))
    {
      if ( Tank.Tanks[ ii ] != this )
      {
        collided = ( this._collidingWith( Tank.Tanks[ ii ])) ;
      }

      ii ++ ;
    }

    if ( collided )
    {
      this._currentPosition.top = oldPositionTop ,
      this._currentPosition.left = oldPositionLeft ,
      this._bounds.top = oldTop ,
      this._bounds.left = oldLeft ,
      this._bounds.bottom = oldBottom ,
      this._bounds.right = oldRight ;
    }
    else
    {
      this._turret.setPosition({
        x : this._currentPosition.left + ( Tank.HALF_WIDTH ) ,
        y : this._currentPosition.top + ( Tank.HALF_HEIGHT )
      }) ;
    }
  }
} ;

Tank.prototype._outOfBounds = function ( )
{
  return (
    ( this._bounds.top < 0 ) ||
    ( this._bounds.bottom > this._$p.height ) ||
    ( this._bounds.right > this._$p.width ) ||
    ( this._bounds.left < 0 )
  ) ;
} ;

Tank.prototype._withinVertically = function ( pBounds )
{
  return (
    (( this._bounds.top > pBounds.top ) && ( this._bounds.top < pBounds.bottom )) ||
    (( this._bounds.bottom > pBounds.top ) && ( this._bounds.bottom < pBounds.bottom ))
  ) ;
} ;

Tank.prototype._withinHorizontally = function ( pBounds )
{
  return (
    (( this._bounds.right > pBounds.left ) && ( this._bounds.right < pBounds.right )) ||
    (( this._bounds.left > pBounds.left ) && ( this._bounds.left < pBounds.right ))
  ) ;
} ;

Tank.prototype._fullyBetweenHorizontally = function ( pBounds )
{
  return (
    (( this._bounds.left <= pBounds.left ) && ( this._bounds.right >= pBounds.right )) ||
    (( pBounds.left <= this._bounds.left ) && ( pBounds.right >= this._bounds.right ))
  ) ;
} ;

Tank.prototype._fullyBetweenVertically = function ( pBounds )
{
  return (
    (( this._bounds.top <= pBounds.top ) && ( this._bounds.bottom >= pBounds.bottom )) ||
    (( pBounds.top <= this._bounds.top ) && ( pBounds.bottom >= this._bounds.bottom ))
  ) ;
} ;

Tank.prototype._collidingWith = function ( pObject )
{
  var bounds = pObject.getBounds() ;
  
  return (
    ( this._withinVertically( bounds ) || this._fullyBetweenVertically( bounds )) &&
    ( this._withinHorizontally( bounds ) || this._fullyBetweenHorizontally( bounds ))
  ) ;

} ;

Tank.prototype.getBounds = function ( )
{
  return this._bounds ;
} ;

Tank.prototype.shoot = function ( )
{
  this._turret.fireShell( this ) ;
} ;

Tank.prototype.takeDamage = function ( pDamage )
{
  this._health -= pDamage ;
  if ( this._health < 0 )
  {
    this._health = 0 ;
  }
  
  this.onDamageTaken() ;
} ;

Tank.prototype.getHealth = function ( )
{
  return this._health ;
} ;

Tank.prototype.randomRespawn = function ( pRespawnBounds )
{
  this._health = Tank.HEALTH_POINTS ;
  
  this._currentPosition.top =
    ComputerInput.prototype.randomIntInRange( pRespawnBounds.top , pRespawnBounds.bottom ) ;
  this._currentPosition.left =
    ComputerInput.prototype.randomIntInRange( pRespawnBounds.left , pRespawnBounds.right ) ;
    
  this._bounds.top = this._currentPosition.top - Tank.OUTER_BOUND_WIDTH ;
  this._bounds.left = this._currentPosition.left - Tank.OUTER_BOUND_WIDTH ;
  
  this._bounds.bottom = this._currentPosition.top + Tank.HEIGHT + Tank.OUTER_BOUND_WIDTH ;
  this._bounds.right = this._currentPosition.left + Tank.WIDTH + Tank.OUTER_BOUND_WIDTH ;
  
} ;